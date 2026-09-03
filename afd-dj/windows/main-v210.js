const fs=require('fs');
const path=require('path');
const os=require('os');
const childProcess=require('child_process');
const electron=require('electron');
const {app,ipcMain,dialog}=electron;

const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const realRead=fs.readFileSync.bind(fs);
const realSpawn=childProcess.spawn.bind(childProcess);

function rep(s,a,b,label){
  if(!s.includes(a))throw new Error('AFD v210 patch marker missing: '+label);
  return s.replace(a,b);
}
function patchRuntime(file,s){
  if(typeof s!=='string')return s;
  if(file==='spotify-playback-v85-local.js'){
    s=rep(s,
      "function clearDeck(deck){loaded[deck]=null;playing[deck]=false;D()?.getElementById('afdSP105Deck'+deck)?.remove();resetTime(deck,null);if(activeDeck===deck)activeDeck=null}",
      "function clearDeck(deck){const wasActive=activeDeck===deck,wasPlaying=!!playing[deck],dev=activeDeviceId,mode=activeMode;if(wasActive&&wasPlaying){if(player&&sdkReady&&mode==='sdk'){try{Promise.resolve(player.pause()).catch(()=>{})}catch(e){}}else if(dev){try{api('/me/player/pause?device_id='+encodeURIComponent(dev),{method:'PUT'}).catch(()=>{})}catch(e){}}}loaded[deck]=null;playing[deck]=false;D()?.getElementById('afdSP105Deck'+deck)?.remove();resetTime(deck,null);if(activeDeck===deck)activeDeck=null}",
      'Spotify safe source clear');
  }
  if(file==='runtime-v184.js'){
    s=rep(s,"v.addEventListener('loadedmetadata',()=>resetDeckProcess(k))","v.addEventListener('loadedmetadata',()=>{serial[k]++;n.decoded=null;n.grid=null;disposeStretch(k)})",'KEY metadata race');
    s=rep(s,"function changeTone(k,d){setTone(k,key[k]+d)}","function changeTone(k,d){return setTone(k,key[k]+d)}",'KEY promise');
  }
  if(file==='runtime-v177.js')s=s.replace("rm rmvb divx dv'.split(' ')","rm rmvb divx dv wmp'.split(' ')");
  if(file==='runtime-v185.js')s=s.replace("rm rmvb divx dv'.split(' ')","rm rmvb divx dv wmp'.split(' ')");
  if(file==='runtime-v206.js'){
    s=rep(s,
      "window.__afdCore206={refresh,addQueue,renderQueue,startAuto,stopAuto,startNext:startNextManual,playIndex,loadAny,loadLocal,loadSpotify,mixTo,get queue(){return queue},get autoRunning(){return autoRunning}};",
      "window.__afdCore206={refresh,addQueue,removeQueue,clearQueue,moveQueue,renderQueue,startAuto,stopAuto,startNext:startNextManual,playIndex,loadAny,loadLocal,loadSpotify,mixTo,get queue(){return queue},get autoRunning(){return autoRunning},get activeIndex(){return activeIndex}};",
      'core queue mutation API');
    s=s.replace("setInterval(()=>{refresh();autoTick()},420)","setInterval(()=>{refresh();autoTick()},600)");
  }
  if(file==='runtime-v207.js')s=s.replace('setInterval(refresh,350)','setInterval(refresh,1000)');
  if(file==='runtime-v208.js'){
    s=s.replace("function move(a,b){if(C()?.autoRunning){status('SIDE VIEW • עצור AUTO לפני שינוי סדר');return}const z=q();if(a<0||b<0||a>=z.length||b>=z.length||a===b)return;const[x]=z.splice(a,1);z.splice(b,0,x);C()?.renderQueue?.();side(true)}","function move(a,b){C()?.moveQueue?.(a,b);side(true)}");
    s=s.replace("function clear(){C()?.stopAuto?.();q().splice(0);C()?.renderQueue?.();side(true)}","function clear(){C()?.clearQueue?.();side(true)}");
    s=s.replace("C()?.stopAuto?.();q().splice(i,1);C()?.renderQueue?.();side(true)","C()?.removeQueue?.(i);side(true)");
    s=s.replace("setInterval(()=>{refresh();tick()},350)","setInterval(()=>{refresh();tick()},1000)");
  }
  return s;
}
fs.readFileSync=function(p,...args){
  const out=realRead(p,...args),file=path.basename(String(p));
  return patchRuntime(file,out);
};

childProcess.spawn=function(command,args,options){
  let a=Array.isArray(args)?args.slice():args;
  if(Array.isArray(a)&&/ffmpeg/i.test(String(command||''))){
    for(let i=0;i<a.length-1;i++)if(a[i]==='-threads'&&String(a[i+1])==='0')a[i+1]='2';
  }
  const cp=realSpawn(command,a,options);
  if(/ffmpeg/i.test(String(command||'')))try{if(cp.pid)os.setPriority(cp.pid,os.constants.priority.PRIORITY_BELOW_NORMAL)}catch(e){}
  return cp;
};

function trusted(event){return String(event?.sender?.getURL?.()||'').startsWith('https://afd-dj.vercel.app/');}
function cleanName(s){return String(s||'AFD Playlist').replace(/[<>:"/\\|?*\x00-\x1F]/g,' ').replace(/\s+/g,' ').trim().slice(0,100)||'AFD Playlist';}
function safeSP(i){return{id:String(i?.id||''),uri:String(i?.uri||''),name:String(i?.name||'Spotify'),duration_ms:Number(i?.duration_ms)||0,artists:Array.isArray(i?.artists)?i.artists.slice(0,8).map(a=>({name:String(a?.name||'')})):[],album:{name:String(i?.album?.name||''),images:Array.isArray(i?.album?.images)?i.album.images.slice(0,3).map(x=>({url:String(x?.url||''),width:Number(x?.width)||null,height:Number(x?.height)||null})):[]}};}
function cleanItems(raw){
  const out=[];
  for(const x of Array.isArray(raw)?raw:[]){
    if(x?.t==='sp'){const i=safeSP(x.i);if(i.id||i.uri)out.push({t:'sp',n:String(x.n||i.name),i});continue;}
    if(x?.t==='yt'){const i=x.i||{};const id=String(i.id||i.videoId||'');if(id)out.push({t:'yt',n:String(x.n||i.title||'YouTube'),i:{id,title:String(i.title||x.n||'YouTube'),thumb:String(i.thumb||'')}});continue;}
    if(x?.t==='lo'){const p=path.resolve(String(x.p||''));if(path.isAbsolute(p)&&fs.existsSync(p)&&fs.statSync(p).isFile())out.push({t:'lo',n:String(x.n||path.basename(p)),p,k:String(x.k||''),f:String(x.f||'Playlist'),d:String(x.d||'music')});}
  }
  return out;
}
function trackItems(raw){return(Array.isArray(raw)?raw:[]).map(x=>{const p=path.resolve(String(x?.path||''));if(!path.isAbsolute(p)||!fs.existsSync(p))return null;return{t:'lo',n:String(x?.name||path.basename(p)),p,k:'',f:String(x?.folder||'Playlist'),d:String(x?.kind||'music')}}).filter(Boolean);}
async function savePlaylist210(event,payload){
  if(!trusted(event))throw Error('Playlist request blocked.');
  const items=cleanItems(payload?.items);if(!items.length)items.push(...trackItems(payload?.tracks));
  if(!items.length)throw Error('Playlist has no loadable tracks.');
  const base=cleanName(payload?.defaultName||'AFD Playlist');
  const result=await dialog.showSaveDialog({title:'Save AFD DJ Playlist',defaultPath:path.join(app.getPath('documents'),base+'.afdplaylist'),buttonLabel:'Save Playlist',filters:[{name:'AFD DJ Playlist',extensions:['afdplaylist']},{name:'JSON',extensions:['json']}],properties:['showOverwriteConfirmation','createDirectory']});
  if(result.canceled||!result.filePath)return{canceled:true};
  let filePath=result.filePath;if(!/\.(afdplaylist|json)$/i.test(filePath))filePath+='.afdplaylist';
  const name=cleanName(path.basename(filePath).replace(/\.(afdplaylist|json)$/i,'')||base),data={format:'AFD-DJ-PLAYLIST',version:2,name,savedAt:new Date().toISOString(),items};
  fs.writeFileSync(filePath,JSON.stringify(data,null,2),'utf8');return{canceled:false,filePath,name,items};
}
async function readPlaylist210(event,filePath){
  if(!trusted(event))throw Error('Playlist request blocked.');
  const p=path.resolve(String(filePath||''));if(!path.isAbsolute(p)||!fs.existsSync(p)||!fs.statSync(p).isFile())throw Error('Playlist file not found.');
  const data=JSON.parse(fs.readFileSync(p,'utf8'));let items=cleanItems(data?.items);if(!items.length)items=trackItems(data?.tracks);if(!items.length)throw Error('Invalid or empty AFD DJ playlist.');
  return{name:cleanName(data?.name||path.basename(p).replace(/\.(afdplaylist|json)$/i,'')),filePath:p,items};
}
function installPlaylistHandlers(){
  try{ipcMain.removeHandler('afd-playlist-save')}catch(e){}try{ipcMain.removeHandler('afd-playlist-read')}catch(e){}
  ipcMain.handle('afd-playlist-save',savePlaylist210);ipcMain.handle('afd-playlist-read',readPlaylist210);
}

const runtime210=realRead(path.join(__dirname,'runtime-v210.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject210(w){
  try{if(w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime210,true).catch(e=>console.error('AFD 210 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){}
}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject210(w),900));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject210(w),1300));});

require('./main-v209.js');
app.whenReady().then(()=>{setTimeout(installPlaylistHandlers,0);setTimeout(()=>electron.BrowserWindow.getAllWindows().forEach(inject210),1800)});
