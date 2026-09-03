const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);
function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v219 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
 if(typeof s!=='string')return s;
 if(file==='runtime-v215.js'){
  const old=` if(own==='youtube'){
  if(window.AFDYouTubeState?.isPlaying?.(k))return true;
  try{if(typeof window.AFDYouTubeState?.play==='function')window.AFDYouTubeState.play(k);else window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'play'}}))}catch(e){status('YOUTUBE PLAY ERROR • '+(e?.message||e));return false}
  const ok=await waitFor(()=>!!window.AFDYouTubeState?.isPlaying?.(k),6500);if(!ok){const t=window.AFDYouTubeState?.getTime?.(k)||{};status(t.blocked?'YOUTUBE • הסרטון חסום לניגון בתוך אפליקציה':'YOUTUBE PLAY ERROR • הסרטון לא התחיל')}return ok
 }`;
  const neu=` if(own==='youtube'){
  if(window.AFDYouTubeState?.isPlaying?.(k))return true;
  const end=performance.now()+10000;let attempt=0,lastErr='';
  while(performance.now()<end){
   attempt++;
   try{
    const y=window.AFDYouTubeState;
    if(typeof y?.play==='function')y.play(k);else window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'play'}}));
   }catch(e){lastErr=String(e?.message||e||'')}
   if(await waitFor(()=>!!window.AFDYouTubeState?.isPlaying?.(k),650)){status('YOUTUBE PLAY • DECK '+k+' • התחיל');return true}
   const t=window.AFDYouTubeState?.getTime?.(k)||{};if(t.blocked){status('YOUTUBE • הסרטון חסום לניגון בתוך אפליקציה');return false}
   await sleep(Math.min(520,140+attempt*45));
  }
  status('YOUTUBE PLAY ERROR • הסרטון נטען אבל לא התחיל'+(lastErr?' • '+lastErr:''));return false
 }`;
  s=rep(s,old,neu,'Reliable YouTube Side View Play/Mix');
 }
 return s;
}
fs.readFileSync=function(p,...args){const out=originalRead(p,...args),file=path.basename(String(p));return patchText(file,out)};
function stamp(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.setTitle('AFD DJ '+VERSION)}catch(e){}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>stamp(w),5800));w.webContents.on('did-finish-load',()=>setTimeout(()=>stamp(w),6200))});
require('./main-v218.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(stamp),7000));
