const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow,ipcMain,dialog}=electron;
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);
function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v213 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
 if(typeof s!=='string')return s;
 if(file==='runtime-v212.js')s=s.replace("else if(x==='save')saveSide();","else if(x==='save'&&window.__afd213?.saveSide)window.__afd213.saveSide();else if(x==='save')saveSide();");
 if(file==='runtime-v184.js')s=s.replace("function online(k){return!!(doc?.getElementById('ytDeck'+k)||doc?.getElementById('afdSP105Deck'+k))}","function online(k){const o=window.__afdUnified213?.getOwner?.(k);if(o)return o!=='local';return!!(doc?.getElementById('ytDeck'+k)||doc?.getElementById('afdSP105Deck'+k))}");
 if(file==='inline-youtube-core-v48.js')s=s.replace("const other=captureOther(deck);clearYT(deck);","const other=window.__afd213Active?null:captureOther(deck);clearYT(deck);");
 return s;
}
fs.readFileSync=function(p,...args){const out=originalRead(p,...args),file=path.basename(String(p));return patchText(file,out)};
function trusted(event){return String(event?.sender?.getURL?.()||'').startsWith('https://afd-dj.vercel.app/')}
function cleanName(s){return String(s||'AFD Playlist').replace(/[<>:\"/\\|?*\x00-\x1F]/g,' ').replace(/\s+/g,' ').trim().slice(0,100)||'AFD Playlist'}
function cleanItems(raw){const out=[];for(const x of Array.isArray(raw)?raw:[]){if(x?.t==='sp'){const i=x.i||{};if(i.id||i.uri)out.push({t:'sp',n:String(x.n||i.name||'Spotify'),i});continue}if(x?.t==='yt'){const i=x.i||{},id=String(i.id||i.videoId||'');if(id)out.push({t:'yt',n:String(x.n||i.title||'YouTube'),i:{id,title:String(i.title||x.n||'YouTube'),channel:String(i.channel||''),thumb:String(i.thumb||'')}});continue}if(x?.t==='lo'){const p=path.resolve(String(x.p||''));if(path.isAbsolute(p)&&fs.existsSync(p)&&fs.statSync(p).isFile())out.push({t:'lo',n:String(x.n||path.basename(p)),p,k:String(x.k||''),f:String(x.f||'Playlist'),d:String(x.d||'music')})}}return out}
async function save213(event,payload){if(!trusted(event))throw Error('Playlist request blocked.');const items=cleanItems(payload?.items);if(!items.length)throw Error('Playlist has no loadable tracks.');const base=cleanName(payload?.defaultName||'AFD Playlist');const r=await dialog.showSaveDialog({title:'Save AFD DJ Playlist',defaultPath:path.join(app.getPath('documents'),base+'.afdplaylist'),buttonLabel:'Save Playlist',filters:[{name:'AFD DJ Playlist',extensions:['afdplaylist']},{name:'JSON',extensions:['json']}],properties:['showOverwriteConfirmation','createDirectory']});if(r.canceled||!r.filePath)return{canceled:true};let filePath=r.filePath;if(!/\.(afdplaylist|json)$/i.test(filePath))filePath+='.afdplaylist';const name=cleanName(path.basename(filePath).replace(/\.(afdplaylist|json)$/i,''));fs.writeFileSync(filePath,JSON.stringify({format:'AFD-DJ-PLAYLIST',version:3,name,savedAt:new Date().toISOString(),items},null,2),'utf8');return{canceled:false,filePath,name,items}}
function installHandlers(){try{ipcMain.removeHandler('afd-playlist-save')}catch(e){}ipcMain.handle('afd-playlist-save',save213)}
const runtime213=originalRead(path.join(__dirname,'runtime-v213.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime213,true).catch(e=>console.error('AFD 213 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 213 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject(w),2800));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject(w),3200))});
require('./main-v212.js');
app.whenReady().then(()=>{setTimeout(installHandlers,700);setTimeout(installHandlers,2200);setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),3600)});
