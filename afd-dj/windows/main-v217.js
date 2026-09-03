const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow}=electron;
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);
function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v217 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
 if(typeof s!=='string')return s;
 if(file==='runtime-v196.js'){
  s=rep(s,
    '<div class="sp196acts"><button data-d="A">LOAD A</button><button data-d="B">LOAD B</button></div>',
    '<div class="sp196acts"><button data-side215="spotify" data-side217="spotify">SIDE +</button></div>',
    'Spotify card SIDE only');
  s=rep(s,
    '<button data-d="A">A</button><button data-d="B">B</button></div>',
    '<button data-side215="spotify" data-side217="spotify">SIDE +</button></div>',
    'Spotify list SIDE only');
 }
 if(file==='inline-youtube-core-v48.js'){
  s=rep(s,
    'grid-template-columns:58px 1fr 48px 48px',
    'grid-template-columns:58px 1fr 70px',
    'YouTube result columns');
  s=rep(s,
    '</div><button data-d="A">A</button><button data-d="B">B</button></div>',
    '</div><button data-side215="youtube" data-side217="youtube">SIDE +</button></div>',
    'YouTube SIDE only');
  s=rep(s,
    'window.AFDYouTubeState={isPlaying:deck=>!!yt[deck]?.playing,clear:clearYT,load,applyCross,getTime:',
    "window.AFDYouTubeState={isPlaying:deck=>!!yt[deck]?.playing,isLoaded:deck=>!!yt[deck]&&!yt[deck]?.blocked,getItems:()=>lastItems.slice(),getItem:i=>lastItems[Number(i)]||null,play:deck=>{const r=yt[deck],p=players[deck];if(!r||!p||r.blocked)return false;try{p.playVideo();markPlaying(deck,true);lastLevel[deck]=-1;applyCross();return true}catch(e){return false}},pause:deck=>pauseYT(deck,false),stop:deck=>pauseYT(deck,true),seek:(deck,sec)=>{const r=yt[deck],p=players[deck];if(!r||!p||r.blocked)return false;try{p.seekTo(Math.max(0,Number(sec)||0),true);return true}catch(e){return false}},clear:clearYT,load,applyCross,getTime:",
    'YouTube state API for Side and transport');
 }
 return s;
}
fs.readFileSync=function(p,...args){const out=originalRead(p,...args),file=path.basename(String(p));return patchText(file,out)};
const runtime217=originalRead(path.join(__dirname,'runtime-v217.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime217,true).catch(e=>console.error('AFD 217 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 217 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject(w),4550));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject(w),4950))});
require('./main-v216.js');
app.whenReady().then(()=>setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),5700));
