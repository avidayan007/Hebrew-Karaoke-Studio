const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const runtime220=fs.readFileSync(path.join(__dirname,'runtime-v220.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime220,true).catch(e=>console.error('AFD 220 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 220 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject(w),6100));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject(w),6500))});
require('./main-v218.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),7300));
