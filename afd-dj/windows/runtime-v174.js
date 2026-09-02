(()=>{
if(window.__afdWin174){window.__afdWin174.refresh();return;}
const frame=()=>document.getElementById('console');
const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return frame()?.contentWindow||null}catch(e){return null}};
const clean=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const PL_KEY='afdSavedPlaylists174';
const VIDEO=new Set('mp4 m4v mov webm ogv avi wmv asf mkv mpg mpeg m2v ts mts m2ts vob flv f4v 3gp 3g2 rm rmvb divx dv'.split(' '));
const AUDIO=new Set('mp3 wav wave m4a aac flac ogg oga opus wma aiff aif ape ac3 dts amr mka mp2'.split(' '));
const NATIVE=new Set('mp4 m4v webm ogv ogg mp3 wav wave m4a aac flac opus'.split(' '));
let playlists={};
try{const x=JSON.parse(localStorage.getItem(PL_KEY)||'{}');if(x&&typeof x==='object')playlists=x}catch(e){}
const extOf=x=>{const n=String(x?.name||x?.path||'').toLowerCase(),m=n.match(/\.([a-z0-9]+)$/);return m?m[1]:''};
const isMedia=f=>VIDEO.has(extOf(f))||AUDIO.has(extOf(f));
const kindOf=x=>VIDEO.has(extOf(x))?'video':'music';
const keyOf=f=>(f.webkitRelativePath||f.name)+'|'+f.size+'|'+f.lastModified;
const folderOf=f=>{const p=f.webkitRelativePath||'';return p.includes('/')?p.split('/').slice(0,-1).join('/'):'Files'};
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD MEDIA/PLAYLIST 174]',t)}
function savePlaylists(){try{localStorage.setItem(PL_KEY,JSON.stringify(playlists))}catch(e){}}

function broadenInputs(){
  ['folderInput','filesInput'].forEach(id=>{const x=document.getElementById(id);if(x)x.removeAttribute('accept')});
  const d=D();d?.getElementById('file')?.removeAttribute('accept');
}
function captureAllMedia(e){
  const input=e.target;if(input?.tagName!=='INPUT'||input?.type!=='file'||!input.files?.length)return;
  const api=window.__afdWin170;if(!api?.items)return;
  let n=0;
  [...input.files].forEach(f=>{
    if(!isMedia(f))return;
    const k=keyOf(f);if(api.items.some(x=>x.key===k))return;
    api.items.push({key:k,file:f,name:f.name,folder:folderOf(f),kind:kindOf(f)});n++;
  });
  if(n)setTimeout(()=>{api.refresh();status('LOCAL LIBRARY • נוספו '+n+' קבצי מדיה')},0);
}
document.addEventListener('change',captureAllMedia,true);

async function bridgePrepare(deck,it,force=false){
  const bridge=window.afdDesktopMedia;if(!bridge||!it)return false;
  const ext=extOf(it);
  if(!it.path&&!force&&NATIVE.has(ext))return false;
  try{
    status((force?'MEDIA FALLBACK':'MEDIA')+' • מכין '+it.name+'...');
    const meta={key:it.key,path:it.path||'',name:it.name||'',kind:kindOf(it),force:!!force};
    const res=it.path?await bridge.preparePath(meta):await bridge.prepare(meta);
    if(!res?.url)throw Error('No media URL');
    const d=D(),v=d?.getElementById('vid'+deck),m=d?.getElementById('master'+deck);if(!v||!m)return false;
    try{v.pause();m.pause()}catch(e){}
    v.src=res.url;m.src=res.url;
    const video=(res.kind||kindOf(it))==='video';
    v.style.display=video?'block':'none';m.style.display=video?'block':'none';
    const post=d.getElementById('post'+deck);if(post)post.style.display=video?'none':'grid';
    const logo=d.getElementById('masterLogo');if(logo&&video)logo.style.display='none';
    try{v.load();m.load()}catch(e){}
    v.dataset.afdBridge174='1';m.dataset.afdBridge174='1';
    status((res.converted?'CONVERTED':'LOADED')+' • '+it.name+' → DECK '+deck+' • לחץ PLAY');
    return true;
  }catch(e){status('MEDIA ERROR • '+(e?.message||e));return false}
}
const current={A:null,B:null};
window.addEventListener('afd-local-load',e=>{
  const deck=e.detail?.deck,it=e.detail?.item;if(!deck||!it)return;current[deck]=it;
  const d=D(),v=d?.getElementById('vid'+deck);if(v&&!v.dataset.afdErr174){
    v.dataset.afdErr174='1';v.addEventListener('error',()=>{const x=current[deck];if(x&&!v.dataset.afdFallbackBusy174){v.dataset.afdFallbackBusy174='1';bridgePrepare(deck,x,true).finally(()=>{delete v.dataset.afdFallbackBusy174})}})
  }
  if(it.path||!NATIVE.has(extOf(it)))bridgePrepare(deck,it,false);
});

function directLoad(deck,it){
  const win=W();if(!win||typeof win.load!=='function'||!it?.file)return;
  win.load(deck,it.file);current[deck]=it;
  window.dispatchEvent(new CustomEvent('afd-local-load',{detail:{deck,item:it}}));
  status('SIDEVIEW • '+it.name+' → DECK '+deck);
}
function installSideDrag(d){
  if(!d||d.documentElement.dataset.afdSideDrag174)return;
  d.documentElement.dataset.afdSideDrag174='1';
  d.addEventListener('drop',e=>{
    const root=e.target?.closest?.('.deckA,.deckB');if(!root)return;
    const raw=e.dataTransfer?.getData('application/x-afd-q-index');if(raw===''||raw==null)return;
    const i=Number(raw),q=window.__afdWin170?.queue||[],it=q[i];if(!Number.isInteger(i)||!it)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    directLoad(root.classList.contains('deckB')?'B':'A',it);
  },true);
}

async function saveCurrentPlaylist(){
  const q=window.__afdWin170?.queue||[];if(!q.length){status('PLAYLIST • אין שירים ב-SIDEVIEW');return}
  let name=window.prompt('שם הפלייליסט לשמירה:','My Playlist');if(name==null)return;name=name.trim();if(!name)return;
  const bridge=window.afdDesktopMedia,tracks=[];
  for(const it of q){
    let p=it.path||'';if(!p&&bridge?.getPath)try{p=await bridge.getPath(it.key)}catch(e){}
    if(!p)continue;
    tracks.push({path:p,name:it.name||p.split(/[\\/]/).pop(),folder:it.folder||'Saved Playlist',kind:it.kind||kindOf(it)});
  }
  if(!tracks.length){status('PLAYLIST • לא ניתן לשמור נתיבי קבצים. בחר מחדש את התיקייה מהמחשב.');return}
  playlists[name]=tracks;savePlaylists();renderSaved();status('PLAYLIST SAVED • '+name+' • '+tracks.length+' שירים');
}
function restoreItem(x){
  const kind=x.kind==='video'||VIDEO.has(extOf(x))?'video':'music';
  const mime=kind==='video'?'video/mp4':'audio/mpeg';
  const f=new File([],x.name||'Track',{type:mime,lastModified:0});
  return{key:'saved:'+x.path,file:f,path:x.path,name:x.name||'Track',folder:x.folder||'Saved Playlist',kind};
}
function loadPlaylist(name){
  const src=playlists[name];if(!Array.isArray(src)||!src.length)return;
  const api=window.__afdWin170,q=api?.queue;if(!q)return;
  q.splice(0,q.length,...src.map(restoreItem));api.refresh();
  setTimeout(()=>{const d=D();d?.querySelector('[data-cat="playlist"]')?.click();renderSaved()},80);
  status('PLAYLIST • '+name+' • נטענו '+src.length+' שירים');
}
function deletePlaylist(name){
  if(!window.confirm('למחוק את הפלייליסט "'+name+'"?'))return;
  delete playlists[name];savePlaylists();renderSaved();status('PLAYLIST DELETED • '+name);
}
function renderSaved(){
  const d=D(),host=d?.getElementById('afdFolders170');if(!host)return;
  host.querySelector('.afdSavedWrap174')?.remove();
  const names=Object.keys(playlists).sort((a,b)=>a.localeCompare(b));if(!names.length)return;
  const wrap=d.createElement('div');wrap.className='afdSavedWrap174';
  wrap.innerHTML='<div class="afdFolderTitle170">SAVED PLAYLISTS</div>'+names.map(n=>'<div class="afdSavedPlaylist174" data-pl="'+clean(n)+'"><span>♫ '+clean(n)+'</span><small>'+playlists[n].length+'</small><button data-del="'+clean(n)+'">×</button></div>').join('');
  host.appendChild(wrap);
  wrap.querySelectorAll('[data-pl]').forEach(r=>r.addEventListener('click',e=>{if(e.target.closest('[data-del]'))return;loadPlaylist(r.dataset.pl)}));
  wrap.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();deletePlaylist(b.dataset.del)}));
}
function installPlaylistUI(d){
  const tabs=d?.querySelector('.afdSideTabs170');if(!tabs)return;
  if(!d.getElementById('afdSavePlaylist174')){
    const b=d.createElement('button');b.id='afdSavePlaylist174';b.textContent='💾 SAVE';b.title='שמור את רשימת SIDEVIEW כפלייליסט';tabs.appendChild(b);b.addEventListener('click',saveCurrentPlaylist);
  }
  renderSaved();
}
function patchRows(d){
  d?.querySelectorAll('.afdLocalRow170 [data-side]').forEach(b=>{b.textContent='＋SIDEVIEW';b.title='הוסף ל-Side View / Automix'});
  d?.querySelectorAll('.afdQ170').forEach(r=>{if(r.dataset.afdDrag174)return;r.dataset.afdDrag174='1';r.addEventListener('dragstart',e=>{const i=Number(r.dataset.i),it=window.__afdWin170?.queue?.[i];if(it)e.dataTransfer.setData('application/x-afd-local-key',it.key||'')},true)});
}
function hideDeckStrip(d){
  if(!d?.head)return;let s=d.getElementById('afdRemoveDeckStrip174');if(!s){s=d.createElement('style');s.id='afdRemoveDeckStrip174';d.head.appendChild(s)}
  s.textContent='.afdDeckStrip131{display:none!important;margin:0!important;padding:0!important;height:0!important;min-height:0!important;border:0!important}.afdSavedPlaylist174{display:grid;grid-template-columns:minmax(0,1fr) 28px 22px;gap:4px;align-items:center;padding:6px 7px;border-radius:4px;cursor:pointer}.afdSavedPlaylist174:hover{background:#252d38}.afdSavedPlaylist174 span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.afdSavedPlaylist174 small{color:#8793a1;text-align:center}.afdSavedPlaylist174 button{height:20px;border:1px solid #5a626d;border-radius:3px;background:#25151b;color:#ff9eac}.afdSideTabs170{grid-template-columns:1fr auto auto!important}';
}
function refresh(){
  broadenInputs();const d=D();if(!d)return;hideDeckStrip(d);installSideDrag(d);installPlaylistUI(d);patchRows(d);
}
window.__afdWin174={refresh,saveCurrentPlaylist,loadPlaylist};
frame()?.addEventListener('load',()=>setTimeout(refresh,180));
refresh();setTimeout(refresh,600);setInterval(refresh,1200);
})();
