const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const runtime228=fs.readFileSync(path.join(__dirname,'runtime-v228.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime228,true).catch(e=>console.error('AFD 228 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 228 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>{setTimeout(()=>inject(w),250);setTimeout(()=>inject(w),900);setTimeout(()=>inject(w),1800)});w.webContents.on('did-finish-load',()=>{setTimeout(()=>inject(w),350);setTimeout(()=>inject(w),1200)})});
app.whenReady().then(()=>{setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),700);setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),2200)});
require('./main-v227.js');