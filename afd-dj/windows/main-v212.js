const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;

const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);

function rep(s,a,b,label){
  if(!s.includes(a))throw new Error('AFD v212 patch marker missing: '+label);
  return s.replace(a,b);
}
function patchText(file,s){
  if(typeof s!=='string')return s;
  if(file==='runtime-v211.js')return "(()=>{window.__afd211DisabledBy212=true;window.__afd211Active=true})();";
  if(file==='runtime-v208.js'){
    s=s.replace("function spSide(){const p=$('afdSP196');","function spSide(){if(window.__afd212Active)return;const p=$('afdSP196');");
  }
  if(file==='spotify-playback-v85-local.js'){
    s=rep(
      s,
      "play:deck=>queue(()=>play(deck)),pause:deck=>queue(()=>pauseDeck(deck))};",
      "play:deck=>queue(()=>play(deck)),pause:deck=>queue(()=>pauseDeck(deck)),pauseNow:deck=>pauseDeck(deck),stopNow:deck=>stopDeck(deck),seekSeconds:(deck,sec)=>seekDeck(deck,Math.max(0,Number(sec)||0)*1000)};",
      'Spotify direct transport API'
    );
  }
  if(file==='inline-youtube-core-v48.js'){
    s=rep(
      s,
      "window.AFDOpenYT=searchNow;window.AFDYouTubeState={isPlaying:deck=>!!yt[deck]?.playing,clear:clearYT,load,applyCross,getTime:",
      "window.AFDOpenYT=searchNow;window.AFDYouTubeState={isPlaying:deck=>!!yt[deck]?.playing,isLoaded:deck=>!!yt[deck],clear:clearYT,load,play:playYT,playNow:deck=>{const r=yt[deck],p=players[deck];if(!r||!p||r.blocked)return false;try{p.playVideo();lastLevel[deck]=-1;applyCross();return true}catch(e){status('YouTube PLAY ERROR • '+e.message);return false}},pause:deck=>pauseYT(deck,false),stop:deck=>pauseYT(deck,true),seek:(deck,sec)=>{const p=players[deck];if(!yt[deck]||!p||yt[deck].blocked)return false;try{p.seekTo(Math.max(0,Number(sec)||0),true);updateDeckTime(deck);return true}catch(e){return false}},getItems:()=>lastItems.slice(),applyCross,getTime:",
      'YouTube direct transport and result API'
    );
  }
  return s;
}

fs.readFileSync=function(p,...args){
  const out=originalRead(p,...args),file=path.basename(String(p));
  return patchText(file,out);
};

const runtime212=originalRead(path.join(__dirname,'runtime-v212.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject212(w){
  try{
    if(!w||w.isDestroyed())return;
    const u=String(w.webContents.getURL()||'');
    if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;
    w.webContents.executeJavaScript(runtime212,true).catch(e=>console.error('AFD 212 inject',e));
    w.setTitle('AFD DJ '+VERSION);
  }catch(e){console.error('AFD 212 window',e)}
}

app.on('browser-window-created',(_e,w)=>{
  w.webContents.on('dom-ready',()=>setTimeout(()=>inject212(w),2050));
  w.webContents.on('did-finish-load',()=>setTimeout(()=>inject212(w),2450));
});

require('./main-v211.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject212),3000));
