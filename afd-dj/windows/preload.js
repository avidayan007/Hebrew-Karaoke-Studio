const {contextBridge,ipcRenderer,webUtils}=require('electron');
const fs=require('fs');
const path=require('path');
const os=require('os');
const {spawn}=require('child_process');
const {Worker}=require('worker_threads');

const paths=new Map();
const bpmCache=new Map();
const bpmJobs=new Map();
let bpmQueue=Promise.resolve();
const BPM_START=5;
const BPM_SECONDS=60;
const MAX_PCM_BYTES=16*1024*1024;
const MUSIC_TEMPO=require.resolve('music-tempo');

const keyOf=f=>(f?.webkitRelativePath||f?.name||'')+'|'+(f?.size||0)+'|'+(f?.lastModified||0);
function captureFiles(input){try{[...(input?.files||[])].forEach(f=>{const p=webUtils.getPathForFile(f);if(p)paths.set(keyOf(f),p)})}catch(e){}}
document.addEventListener('change',e=>{if(e.target?.tagName==='INPUT'&&e.target?.type==='file')captureFiles(e.target)},true);
function pathFor(meta){const p=paths.get(String(meta?.key||''));if(!p)throw new Error('Local file path is not available. Re-select the folder/file.');return p}
function checkedPath(raw){const p=path.resolve(String(raw||''));if(!p||!path.isAbsolute(p)||!fs.existsSync(p)||!fs.statSync(p).isFile())throw new Error('BPM source file was not found.');return p}
function ffmpegExecutable(){let p=require('ffmpeg-static');if(p.includes('app.asar'+path.sep))p=p.replace('app.asar'+path.sep,'app.asar.unpacked'+path.sep);return p}
function signature(p){const s=fs.statSync(p);return p+'|'+s.size+'|'+s.mtimeMs}

function extractPcm(input){return new Promise((resolve,reject)=>{
  const args=['-hide_banner','-loglevel','error','-nostdin','-threads','1','-ss',String(BPM_START),'-t',String(BPM_SECONDS),'-i',input,'-vn','-ac','1','-ar','44100','-f','f32le','pipe:1'];
  const cp=spawn(ffmpegExecutable(),args,{windowsHide:true,stdio:['ignore','pipe','pipe']});
  try{if(cp.pid)os.setPriority(cp.pid,os.constants.priority.PRIORITY_BELOW_NORMAL)}catch(e){}
  const chunks=[];let size=0,err='',done=false;
  const timer=setTimeout(()=>{try{cp.kill('SIGKILL')}catch(e){}finish(new Error('BPM audio extraction timed out.'))},90000);
  function finish(error,data){if(done)return;done=true;clearTimeout(timer);error?reject(error):resolve(data)}
  cp.stdout.on('data',b=>{size+=b.length;if(size>MAX_PCM_BYTES){try{cp.kill('SIGKILL')}catch(e){}finish(new Error('BPM analysis buffer is too large.'));return}chunks.push(b)});
  cp.stderr.on('data',b=>{err+=b.toString();if(err.length>10000)err=err.slice(-10000)});
  cp.on('error',e=>finish(e));
  cp.on('close',code=>{if(done)return;if(code!==0)return finish(new Error(err.trim()||('BPM FFmpeg exited '+code)));const out=Buffer.concat(chunks);if(out.length<44100*4*5)return finish(new Error('Not enough audio for BPM analysis.'));finish(null,out)});
})}

function beatroot(pcm){return new Promise((resolve,reject)=>{
  const source=`const {parentPort,workerData}=require('worker_threads');\nconst mod=require(workerData.modulePath);const MusicTempo=mod&&mod.default||mod;\nparentPort.on('message',ab=>{try{const data=new Float32Array(ab);const mt=new MusicTempo(data);parentPort.postMessage({tempo:Number(mt.tempo),beats:Array.isArray(mt.beats)?mt.beats.map(Number).filter(Number.isFinite):[]})}catch(e){parentPort.postMessage({error:String(e&&e.message||e)})}});`;
  const w=new Worker(source,{eval:true,workerData:{modulePath:MUSIC_TEMPO}});let done=false;
  const timer=setTimeout(()=>{try{w.terminate()}catch(e){}finish(new Error('BPM beat analysis timed out.'))},45000);
  function finish(error,result){if(done)return;done=true;clearTimeout(timer);try{w.terminate()}catch(e){}error?reject(error):resolve(result)}
  w.on('error',e=>finish(e));
  w.on('message',m=>m?.error?finish(new Error(m.error)):finish(null,m));
  const ab=pcm.buffer.slice(pcm.byteOffset,pcm.byteOffset+pcm.byteLength);w.postMessage(ab,[ab]);
})}

function median(a){if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y),m=Math.floor(b.length/2);return b.length%2?b[m]:(b[m-1]+b[m])/2}
function summarize(r){
  const raw=Number(r?.tempo||0);if(!(raw>20&&raw<320))throw new Error('No reliable BPM was detected.');
  let bpm=raw;while(bpm<70)bpm*=2;while(bpm>190)bpm/=2;
  const beats=(r?.beats||[]).filter(Number.isFinite).map(x=>x+BPM_START);const period=60/bpm;
  let offset=beats.length?((beats[0]%period)+period)%period:0;
  if(beats.length>=5&&Math.abs(bpm-raw)<.02){let sx=0,sy=0;for(const b of beats.slice(0,80)){const a=2*Math.PI*((b%period)/period);sx+=Math.cos(a);sy+=Math.sin(a)}let ph=Math.atan2(sy,sx)/(2*Math.PI);if(ph<0)ph+=1;offset=ph*period}
  const ints=[];for(let i=1;i<beats.length;i++){const d=beats[i]-beats[i-1];if(d>.15&&d<2)ints.push(d)}
  const med=median(ints),dev=med?median(ints.map(x=>Math.abs(x-med)))/med:1;const coverage=Math.min(1,beats.length/40);const confidence=Math.max(0,Math.min(1,coverage*(1-Math.min(.8,dev*5))));
  return{bpm:Number(bpm.toFixed(3)),rawBpm:Number(raw.toFixed(3)),offset:Number(offset.toFixed(6)),confidence:Number(confidence.toFixed(3)),beats:beats.slice(0,160),source:'beatroot-60s'}
}

async function analyzeNow(p){const pcm=await extractPcm(p);return summarize(await beatroot(pcm))}
function analyzePath(raw){
  let p;try{p=checkedPath(raw)}catch(e){return Promise.reject(e)}const sig=signature(p);if(bpmCache.has(sig))return Promise.resolve({...bpmCache.get(sig),cached:true});if(bpmJobs.has(sig))return bpmJobs.get(sig);
  const job=bpmQueue.then(()=>analyzeNow(p)).then(r=>{bpmCache.set(sig,r);return r}).finally(()=>bpmJobs.delete(sig));
  bpmJobs.set(sig,job);bpmQueue=job.catch(()=>{});return job;
}

contextBridge.exposeInMainWorld('afdDesktopMedia',{
  getPath:key=>paths.get(String(key||''))||'',
  prepare:meta=>ipcRenderer.invoke('afd-media-prepare',{path:pathFor(meta),name:String(meta?.name||''),kind:String(meta?.kind||''),force:!!meta?.force}),
  preparePath:meta=>ipcRenderer.invoke('afd-media-prepare',{path:String(meta?.path||''),name:String(meta?.name||''),kind:String(meta?.kind||''),force:!!meta?.force}),
  prepareKey:meta=>ipcRenderer.invoke('afd-key-audio-prepare',{path:pathFor(meta),name:String(meta?.name||'')}),
  prepareKeyPath:meta=>ipcRenderer.invoke('afd-key-audio-prepare',{path:String(meta?.path||''),name:String(meta?.name||'')}),
  analyzeBpm:meta=>analyzePath(pathFor(meta)),
  analyzeBpmPath:meta=>analyzePath(String(meta?.path||'')),
  savePlaylist:payload=>ipcRenderer.invoke('afd-playlist-save',payload),
  readPlaylist:filePath=>ipcRenderer.invoke('afd-playlist-read',String(filePath||''))
});
