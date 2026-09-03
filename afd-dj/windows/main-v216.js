const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);
function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v216 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
 if(typeof s!=='string')return s;
 if(file==='runtime-v196.js'){
  s=rep(s,"u.searchParams.set('type','track');","u.searchParams.set('type','track');u.searchParams.set('limit','30');",'Spotify 30 results per page');
 }
 if(file==='inline-youtube-core-v48.js'){
  s=rep(s,"maxResults:'25'","maxResults:'50'",'YouTube 50 search results');
 }
 return s;
}
fs.readFileSync=function(p,...args){const out=originalRead(p,...args),file=path.basename(String(p));return patchText(file,out)};
const runtime216=originalRead(path.join(__dirname,'runtime-v216.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime216,true).catch(e=>console.error('AFD 216 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 216 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject(w),4050));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject(w),4450))});
require('./main-v215.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),5200));
