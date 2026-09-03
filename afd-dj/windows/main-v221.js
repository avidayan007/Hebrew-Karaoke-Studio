const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const runtime221=fs.readFileSync(path.join(__dirname,'runtime-v221.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime221,true).catch(e=>console.error('AFD 221 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 221 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject(w),6900));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject(w),7300))});
require('./main-v220.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),8100));
