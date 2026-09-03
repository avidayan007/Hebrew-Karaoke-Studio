const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app,BrowserWindow,ipcMain,dialog}=electron;
const VERSION=JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version;
const originalRead=fs.readFileSync.bind(fs);
function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v214 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
  if(typeof s!=='string')return s;
  if(file==='runtime-v212.js'){
    s=rep(s,"else if(x==='save')saveSide();","else if(x==='save'&&window.__afd214?.saveSide)window.__afd214.saveSide();else if(x==='save')saveSide();",'Side Save delegation');
    s=rep(s,"if(b)loadDeck(b.dataset.d,x);","if(b)(window.__afdUnified214?.loadDeck||loadDeck)(b.dataset.d,x);",'Playlist occupied-deck load');
    s=rep(s,"if(x)loadDeck(freeDeck(),x)","if(x)(window.__afdUnified214?.loadDeck||loadDeck)(freeDeck(),x)",'Playlist double-click load');
    s=rep(s,"if(deck)loadDeck(deck.classList.contains('deckA')?'A':'B',dragItem);","if(deck)(window.__afdUnified214?.loadDeck||loadDeck)(deck.classList.contains('deckA')?'A':'B',dragItem);",'Cross-frame drag deck load');
    s=rep(s,"loadDeck(b.dataset.d,spQueueItem(it));","(window.__afdUnified214?.loadDeck||loadDeck)(b.dataset.d,spQueueItem(it));",'Spotify result load');
    s=rep(s,"loadDeck(b.dataset.d,ytQueueItem(it));","(window.__afdUnified214?.loadDeck||loadDeck)(b.dataset.d,ytQueueItem(it));",'YouTube result load');
  }
  if(file==='runtime-v213.js'){
    s=s.replace("loadYouTube(y.dataset.d,it)","(window.__afdUnified214?.loadYouTube||loadYouTube)(y.dataset.d,it)");
    s=s.replace("loadSpotify(s.dataset.d,it)","(window.__afdUnified214?.loadSpotify||loadSpotify)(s.dataset.d,it)");
  }
  return s;
}
fs.readFileSync=function(p,...args){const out=originalRead(p,...args),file=path.basename(String(p));return patchText(file,out)};
function trusted(event){const u=String(event?.senderFrame?.url||event?.sender?.getURL?.()||'');return u.startsWith('https://afd-dj.vercel.app/')}
function cleanName(s){return String(s||'AFD Playlist').replace(/[<>:\"/\\|?*\x00-\x1F]/g,' ').replace(/\s+/g,' ').trim().slice(0,100)||'AFD Playlist'}
function cleanItems(raw){
  const out=[];
  for(const x of Array.isArray(raw)?raw:[]){
    if(x?.t==='sp'){
      const i=x.i||{};if(i.id||i.uri)out.push({t:'sp',n:String(x.n||i.name||'Spotify'),i});continue;
    }
    if(x?.t==='yt'){
      const i=x.i||{},id=String(i.id||i.videoId||'');if(id)out.push({t:'yt',n:String(x.n||i.title||'YouTube'),i:{id,title:String(i.title||x.n||'YouTube'),channel:String(i.channel||''),thumb:String(i.thumb||'')}});continue;
    }
    if(x?.t==='lo'){
      const rawPath=String(x.p||'');if(!rawPath)continue;const p=path.resolve(rawPath);
      if(path.isAbsolute(p)&&fs.existsSync(p)&&fs.statSync(p).isFile())out.push({t:'lo',n:String(x.n||path.basename(p)),p,k:String(x.k||''),f:String(x.f||'Playlist'),d:String(x.d||'music')});
    }
  }
  return out;
}
async function save214(event,payload){
  if(!trusted(event))throw Error('Playlist request blocked.');
  const items=cleanItems(payload?.items);if(!items.length)throw Error('Playlist has no loadable tracks.');
  const base=cleanName(payload?.defaultName||'AFD Playlist');
  const r=await dialog.showSaveDialog({title:'Save AFD DJ Playlist',defaultPath:path.join(app.getPath('documents'),base+'.afdplaylist'),buttonLabel:'Save Playlist',filters:[{name:'AFD DJ Playlist',extensions:['afdplaylist']},{name:'JSON',extensions:['json']}],properties:['showOverwriteConfirmation','createDirectory']});
  if(r.canceled||!r.filePath)return{canceled:true};
  let filePath=r.filePath;if(!/\.(afdplaylist|json)$/i.test(filePath))filePath+='.afdplaylist';
  const name=cleanName(path.basename(filePath).replace(/\.(afdplaylist|json)$/i,''));
  const data={format:'AFD-DJ-PLAYLIST',version:4,name,savedAt:new Date().toISOString(),items};
  fs.writeFileSync(filePath,JSON.stringify(data,null,2),'utf8');
  return{canceled:false,filePath,name,items};
}
function installHandlers(){try{ipcMain.removeHandler('afd-playlist-save')}catch(e){}ipcMain.handle('afd-playlist-save',save214)}
const runtime214=originalRead(path.join(__dirname,'runtime-v214.js'),'utf8').replace(/__AFD_VERSION__/g,VERSION);
function inject(w){
  try{
    if(!w||w.isDestroyed())return;
    const u=String(w.webContents.getURL()||'');if(!u.startsWith('https://afd-dj.vercel.app/workstation.html'))return;
    w.webContents.executeJavaScript(runtime214,true).catch(e=>console.error('AFD 214 inject',e));
    w.setTitle('AFD DJ '+VERSION);
  }catch(e){console.error('AFD 214 window',e)}
}
app.on('browser-window-created',(_e,w)=>{w.webContents.on('dom-ready',()=>setTimeout(()=>inject(w),3350));w.webContents.on('did-finish-load',()=>setTimeout(()=>inject(w),3750))});
require('./main-v213.js');
app.whenReady().then(()=>{setTimeout(installHandlers,2600);setTimeout(installHandlers,5000);setTimeout(()=>BrowserWindow.getAllWindows().forEach(inject),4200)});
