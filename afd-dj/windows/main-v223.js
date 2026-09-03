const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const rawRead=fs.readFileSync.bind(fs);
const runtime223=rawRead(path.join(__dirname,'runtime-v223.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
const needle="C()?.playIndex?.(+r.dataset.i,{mix:true});return";
const replacement="const i=+r.dataset.i,x=q()[i];if(typeOf(x)==='youtube'&&window.__afd223?.playSideYouTube){window.__afd223.playSideYouTube(i,x);return}C()?.playIndex?.(i,{mix:true});return";
fs.readFileSync=function(p,...args){
  let out=rawRead(p,...args);
  if(path.basename(String(p))==='runtime-v212.js'&&typeof out==='string'){
    if(out.includes(needle))out=out.replace(needle,replacement);
    else console.error('AFD 223 warning: runtime-v212 dblclick marker not found; using legacy fallback');
  }
  return out;
};
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime223,true).catch(e=>console.error('AFD 223 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 223 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject(w),7600));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject(w),8000))});
require('./main-v222.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),9000));
