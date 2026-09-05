let ffmpeg=null;
function post(id,type,data,trans=[]){self.postMessage({id,type,data},trans)}
async function load({coreURL,wasmURL,workerURL}={}){
  if(!coreURL)throw new Error('coreURL missing');
  importScripts(coreURL);
  if(typeof createFFmpegCore!=='function')throw new Error('createFFmpegCore missing after importScripts');
  const first=!ffmpeg;
  const wURL=workerURL||coreURL.replace(/\.js$/,'\.worker.js');
  ffmpeg=await createFFmpegCore({mainScriptUrlOrBlob:`${coreURL}#${btoa(JSON.stringify({wasmURL:wasmURL||coreURL.replace(/\.js$/,'.wasm'),workerURL:wURL}))}`});
  // iPhone/Safari: forwarding every FFmpeg log/progress callback can flood the main
  // thread during a long encode. Keep error logs and cap progress telemetry to ~4 Hz.
  let lastProgressPost=0,lastProgress=-1;
  ffmpeg.setLogger(data=>{
    const m=String(data?.message||'');
    if(/error|failed|invalid|fatal|abort|out of memory/i.test(m))post(undefined,'LOG',data);
  });
  ffmpeg.setProgress(data=>{
    const now=Date.now(),p=Number(data?.progress);
    const important=Number.isFinite(p)&&(p>=.995||p<lastProgress);
    if(now-lastProgressPost>=250||important){lastProgressPost=now;if(Number.isFinite(p))lastProgress=p;post(undefined,'PROGRESS',data)}
  });
  return first;
}
function exec({args,timeout=-1}){ffmpeg.setTimeout(timeout);ffmpeg.exec(...args);const r=ffmpeg.ret;ffmpeg.reset();return r}
function ffprobe({args,timeout=-1}){ffmpeg.setTimeout(timeout);ffmpeg.ffprobe(...args);const r=ffmpeg.ret;ffmpeg.reset();return r}
self.onmessage=async({data:{id,type,data}})=>{try{
  if(type!=='LOAD'&&!ffmpeg)throw new Error('FFmpeg not loaded');
  let out;
  switch(type){
    case 'LOAD':out=await load(data);break;
    case 'EXEC':out=exec(data);break;
    case 'FFPROBE':out=ffprobe(data);break;
    case 'WRITE_FILE':ffmpeg.FS.writeFile(data.path,data.data);out=true;break;
    case 'READ_FILE':out=ffmpeg.FS.readFile(data.path,{encoding:data.encoding});break;
    case 'DELETE_FILE':ffmpeg.FS.unlink(data.path);out=true;break;
    case 'RENAME':ffmpeg.FS.rename(data.oldPath,data.newPath);out=true;break;
    case 'CREATE_DIR':ffmpeg.FS.mkdir(data.path);out=true;break;
    case 'LIST_DIR':out=ffmpeg.FS.readdir(data.path).map(name=>{const s=ffmpeg.FS.stat(`${data.path}/${name}`);return{name,isDir:ffmpeg.FS.isDir(s.mode)}});break;
    case 'DELETE_DIR':ffmpeg.FS.rmdir(data.path);out=true;break;
    default:throw new Error('Unknown FFmpeg message '+type)
  }
  const trans=[];if(out instanceof Uint8Array)trans.push(out.buffer);post(id,type,out,trans)
}catch(e){post(id,'ERROR',String(e?.message||e))}}
