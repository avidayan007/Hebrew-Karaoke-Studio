const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
const {patchText}=require('./patch-v225.js');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const runtime225=fs.readFileSync(path.join(__dirname,'runtime-v225.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
const rawRead=fs.readFileSync.bind(fs);
fs.readFileSync=function(p,...args){const out=rawRead(p,...args),file=path.basename(String(p));return patchText(file,out)};
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime225,true).catch(e=>console.error('AFD 225 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 225 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>{setTimeout(()=>inject(w),120);setTimeout(()=>inject(w),700);setTimeout(()=>inject(w),1700)});w.webContents.on('did-finish-load',()=>{setTimeout(()=>inject(w),120);setTimeout(()=>inject(w),900)})});
app.whenReady().then(()=>{setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),450);setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),2400)});
require('./main-v220.js');
