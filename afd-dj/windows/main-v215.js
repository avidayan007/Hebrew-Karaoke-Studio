const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow,ipcMain,dialog}=electron;
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);
function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v215 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
 if(typeof s!=='string')return s;
 if(file==='runtime-v212.js'){
  s=rep(s,"else if(x==='save')saveSide();","else if(x==='save'&&window.__afd215?.saveSide)window.__afd215.saveSide();else if(x==='save')saveSide();",'Side Save delegation');
  s=rep(s,"if(b)loadDeck(b.dataset.d,x);","if(b)(window.__afdUnified215?.loadDeck||loadDeck)(b.dataset.d,x);",'Playlist Deck load');
  s=rep(s,"if(x)loadDeck(freeDeck(),x)","if(x)(window.__afdUnified215?.loadDeck||loadDeck)(freeDeck(),x)",'Playlist double click');
  s=rep(s,"if(deck)loadDeck(deck.classList.contains('deckA')?'A':'B',dragItem);","if(deck)(window.__afdUnified215?.loadDeck||loadDeck)(deck.classList.contains('deckA')?'A':'B',dragItem);",'Inner drag Deck load');
  s=rep(s,"loadDeck(b.dataset.d,spQueueItem(it));","(window.__afdUnified215?.loadDeck||loadDeck)(b.dataset.d,spQueueItem(it));",'Spotify result Deck load');
  s=rep(s,"loadDeck(b.dataset.d,ytQueueItem(it));","(window.__afdUnified215?.loadDeck||loadDeck)(b.dataset.d,ytQueueItem(it));",'YouTube result Deck load');
  s=rep(s,"function bindTransport(){","function bindTransport(){return;",'Disable old Deck transport owner');
  s=s.replace("document.addEventListener('click',e=>{\n    const spRow=e.target?.closest?.('#afdSP196 [data-i]')","document.addEventListener('click',e=>{\n    if(window.__afd215Active)return;\n    const spRow=e.target?.closest?.('#afdSP196 [data-i]')");
  s=s.replace("document.addEventListener('dragstart',e=>{\n    const sr=e.target?.closest?.('#afdSP196 [data-i]')","document.addEventListener('dragstart',e=>{\n    if(window.__afd215Active)return;\n    const sr=e.target?.closest?.('#afdSP196 [data-i]')");
 }
 if(file==='runtime-v213.js')s=s.replace("function bindOnlineCapture(){","function bindOnlineCapture(){return;");
 if(file==='runtime-v206.js')s=s.replace("async function startDeck(k){","async function startDeck(k){if(window.__afd215?.startDeck)return window.__afd215.startDeck(k);");
 return s;
}
fs.readFileSync=function(p,...args){const out=originalRead(p,...args),file=path.basename(String(p));return patchText(file,out)};
function trusted(event){const u=String(event?.senderFrame?.url||event?.sender?.getURL?.()||'');return u.startsWith('https://afd-dj.vercel.app/')}
function cleanName(s){return String(s||'AFD Playlist').replace(/[<>:\"/\\|?*\x00-\x1F]/g,' ').replace(/\s+/g,' ').trim().slice(0,100)||'AFD Playlist'}
function cleanItems(raw){const out=[];for(const x of Array.isArray(raw)?raw:[]){if(x?.t==='sp'){const i=x.i||{};if(i.id||i.uri)out.push({t:'sp',n:String(x.n||i.name||'Spotify'),i});continue}if(x?.t==='yt'){const i=x.i||{},id=String(i.id||i.videoId||'');if(id)out.push({t:'yt',n:String(x.n||i.title||'YouTube'),i:{id,title:String(i.title||x.n||'YouTube'),channel:String(i.channel||''),thumb:String(i.thumb||'')}});continue}if(x?.t==='lo'){const raw=String(x.p||'');if(!raw)continue;const p=path.resolve(raw);if(path.isAbsolute(p)&&fs.existsSync(p)&&fs.statSync(p).isFile())out.push({t:'lo',n:String(x.n||path.basename(p)),p,k:String(x.k||''),f:String(x.f||'Playlist'),d:String(x.d||'music')})}}return out}
async function save215(event,payload){if(!trusted(event))throw Error('Playlist request blocked.');const items=cleanItems(payload?.items);if(!items.length)throw Error('Playlist has no loadable tracks.');const base=cleanName(payload?.defaultName||'AFD Playlist');const r=await dialog.showSaveDialog({title:'Save AFD DJ Playlist',defaultPath:path.join(app.getPath('documents'),base+'.afdplaylist'),buttonLabel:'Save Playlist',filters:[{name:'AFD DJ Playlist',extensions:['afdplaylist']},{name:'JSON',extensions:['json']}],properties:['showOverwriteConfirmation','createDirectory']});if(r.canceled||!r.filePath)return{canceled:true};let filePath=r.filePath;if(!/\.(afdplaylist|json)$/i.test(filePath))filePath+='.afdplaylist';const name=cleanName(path.basename(filePath).replace(/\.(afdplaylist|json)$/i,''));fs.writeFileSync(filePath,JSON.stringify({format:'AFD-DJ-PLAYLIST',version:5,name,savedAt:new Date().toISOString(),items},null,2),'utf8');return{canceled:false,filePath,name,items}}
function installHandlers(){try{ipcMain.removeHandler('afd-playlist-save')}catch(e){}ipcMain.handle('afd-playlist-save',save215)}
const runtime215=originalRead(path.join(__dirname,'runtime-v215.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function preflag(w){try{if(!w||w.isDestroyed())return;w.webContents.executeJavaScript('window.__afd215Active=true',true).catch(()=>{})}catch(e){}}
function inject(w){try{if(!w||w.isDestroyed())return;const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;w.webContents.executeJavaScript(runtime215,true).catch(e=>console.error('AFD 215 inject',e));w.setTitle('AFD DJ '+VERSION)}catch(e){console.error('AFD 215 window',e)}}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>{setTimeout(()=>preflag(w),80);setTimeout(()=>inject(w),3000)});w.webContents.on('did-finish-load',()=>{preflag(w);setTimeout(()=>inject(w),3400)})});
require('./main-v213.js');
app.whenReady().then(()=>{setTimeout(installHandlers,2200);setTimeout(installHandlers,4800);setTimeout(()=>BrowserWindow.getAllWindows().forEach(w=>{preflag(w);inject(w)}),3900)});
