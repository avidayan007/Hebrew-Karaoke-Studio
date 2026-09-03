const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;

const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);

function patchText(file,s){
  if(typeof s!=='string')return s;
  if(file==='runtime-v206.js'){
    s=s.replace("async function loadAny(k,it){","async function loadAny(k,it){if(window.__afdUnified211?.loadDeck)return window.__afdUnified211.loadDeck(k,it);");
    s=s.replace("async function loadLocal(k,it){","async function loadLocal(k,it){if(window.__afdUnified211?.loadLocal)return window.__afdUnified211.loadLocal(k,it);");
    s=s.replace("async function loadSpotify(k,it){","async function loadSpotify(k,it){if(window.__afdUnified211?.loadSpotify)return window.__afdUnified211.loadSpotify(k,it);");
    s=s.replace("async function loadYouTube(k,it){","async function loadYouTube(k,it){if(window.__afdUnified211?.loadYouTube)return window.__afdUnified211.loadYouTube(k,it);");
    s=s.replace("status('MIX • '+from+' → '+k+' הושלם');return true}finally{mixBusy=false}","try{if(hasSP(from))window.AFDSpotifyState?.pause?.(from);else if(hasYT(from))window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:from,action:'pause'}}));else{const old=deckMedia(from);if(old&&!old.paused)old.pause()}}catch(e){}status('MIX • '+from+' → '+k+' הושלם');return true}finally{mixBusy=false}");
  }
  if(file==='runtime-v208.js'){
    s=s.replace("function side(force=false){","function side(force=false){if(window.__afd211Active)return;");
  }
  if(file==='runtime-v210.js')return "(()=>{window.__afd210DisabledBy211=true})();";
  return s;
}

fs.readFileSync=function(p,...args){
  const out=originalRead(p,...args),file=path.basename(String(p));
  return patchText(file,out);
};

const runtime211=originalRead(path.join(__dirname,'runtime-v211.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject211(w){
  try{
    if(!w||w.isDestroyed())return;
    const u=String(w.webContents.getURL()||'');
    if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;
    w.webContents.executeJavaScript(runtime211,true).catch(e=>console.error('AFD 211 inject',e));
    w.setTitle('AFD DJ '+VERSION);
  }catch(e){console.error('AFD 211 window',e)}
}

app.on('browser-window-created',(_e,w)=>{
  w.webContents.on('dom-ready',()=>setTimeout(()=>inject211(w),1450));
  w.webContents.on('did-finish-load',()=>setTimeout(()=>inject211(w),1850));
});

require('./main-v210.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject211),2300));
