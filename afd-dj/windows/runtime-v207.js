(()=>{
if(window.__afdRecover207){window.__afdRecover207.refresh();return;}
const VERSION='__AFD_VERSION__';
const frame=()=>document.getElementById('console');
const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return frame()?.contentWindow||null}catch(e){return null}};
const core=()=>window.__afdCore206||null;
const items=()=>Array.from(window.__afdWin170?.items||[]);
let dragLocal=null,dragOuterRow=null,dragQueue=-1,boundWin=null,badgeObserver=null;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD RECOVER 207]',t)}
function keyOfFile(f){return (f?.webkitRelativePath||f?.name||'')+'|'+(f?.size||0)+'|'+(f?.lastModified||0)}
function kindOfFile(f){const n=String(f?.name||'').toLowerCase();return (f?.type||'').startsWith('video/')||/\.(mp4|m4v|mov|webm|avi|mkv|wmv|mpg|mpeg|ts|mts|m2ts|vob|flv)$/i.test(n)?'video':'music'}
function itemByKey(k){return items().find(x=>String(x?.key)===String(k))||null}
function itemFromRow(row){return row?itemByKey(row.dataset.key):null}
function itemFromFile(f){if(!f)return null;try{window.__afdWin170?.addFiles?.([f])}catch(e){}return itemByKey(keyOfFile(f))||{key:keyOfFile(f),file:f,name:f.name||'Local file',folder:'Windows',kind:kindOfFile(f)}}
function isFileDrag(e){const dt=e?.dataTransfer;return !!(dt&&((dt.files&&dt.files.length)||Array.from(dt.types||[]).includes('Files')))}
function stop(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
function paintVersion(){
 let b=document.getElementById('afdCoreBadge201');
 if(!b){b=document.createElement('div');b.id='afdCoreBadge201';document.body.appendChild(b)}
 const txt='AFD DJ '+VERSION;
 if(b.textContent!==txt)b.textContent=txt;
 b.style.cssText='position:fixed;right:8px;top:7px;z-index:2147483647;background:#0d1117;border:1px solid #9a71d0;color:#f0e4ff;border-radius:5px;padding:3px 7px;font:800 9px Arial;pointer-events:none;opacity:.96';
 if(document.title!==txt)document.title=txt;
 const s=document.getElementById('status');if(s&&/1\.5\.4/.test(s.textContent||''))s.textContent=txt+' READY';
}
function watchVersion(){
 paintVersion();
 const b=document.getElementById('afdCoreBadge201');
 if(b&&(!badgeObserver||badgeObserver.__target!==b)){
  try{badgeObserver?.disconnect?.()}catch(e){}
  badgeObserver=new MutationObserver(()=>paintVersion());badgeObserver.__target=b;
  badgeObserver.observe(b,{childList:true,subtree:true,characterData:true});
 }
}
async function reliableLocal(deck,it){
 if(!it)return false;
 const c=core();
 try{if(c?.loadLocal){const ok=await c.loadLocal(deck,it);if(ok)return true}}catch(e){console.warn('[AFD 207 core local]',e)}
 try{const w=W();if(it.file&&typeof w?.load==='function'){w.load(deck,it.file);status('LOCAL • '+it.name+' → DECK '+deck);return true}}catch(e){console.warn('[AFD 207 direct local]',e)}
 try{if(typeof window.AFDWindowsLoadItem==='function'){const ok=await window.AFDWindowsLoadItem(deck,it);if(ok){status('LOCAL • '+(it.name||'Track')+' → DECK '+deck);return true}}}catch(e){console.warn('[AFD 207 bridge local]',e)}
 status('LOCAL ERROR • '+(it.name||'Track')+' לא נטען ל-DECK '+deck);return false;
}
function addSide(it){if(!it)return false;const c=core();if(c?.addQueue){const ok=c.addQueue(it);if(ok!==false)return true}status('SIDE VIEW ERROR • לא ניתן להוסיף את השיר');return false}
function queueAt(i){const q=core()?.queue;return Array.isArray(q)&&Number.isInteger(i)?q[i]||null:null}
function reorder(from,to){const c=core(),q=c?.queue;if(!Array.isArray(q)||c?.autoRunning||from<0||to<0||from>=q.length||to>=q.length||from===to)return false;const [x]=q.splice(from,1);q.splice(to,0,x);c.renderQueue?.();status('SIDE VIEW • הסדר עודכן');return true}
function removeAt(i){const c=core(),q=c?.queue;if(!Array.isArray(q)||i<0||i>=q.length)return false;if(c.autoRunning)c.stopAuto?.();q.splice(i,1);c.renderQueue?.();status('SIDE VIEW • השיר הוסר');return true}
function clearSide(){const c=core(),q=c?.queue;if(!Array.isArray(q))return false;c.stopAuto?.();q.splice(0,q.length);c.renderQueue?.();status('SIDE VIEW • הרשימה נוקתה');return true}
function deckFromTarget(t){const r=t?.closest?.('.deckA,.deckB');return r?(r.classList.contains('deckA')?'A':'B'):''}
function bindInner(){
 const w=W(),d=D();if(!w||!d)return false;
 d.querySelectorAll('#afdTracks170 .afdLocalRow170,#afdQueue170 .afdQ206').forEach(r=>r.draggable=true);
 if(boundWin===w)return true;
 boundWin=w;
 w.addEventListener('dragstart',e=>{
  const local=e.target?.closest?.('#afdTracks170 .afdLocalRow170');
  if(local){dragLocal=itemFromRow(local);dragQueue=-1;if(dragLocal){try{e.dataTransfer.effectAllowed='copyMove';e.dataTransfer.setData('application/x-afd-local-key',dragLocal.key);e.dataTransfer.setData('text/plain',dragLocal.key)}catch(x){}}return}
  const q=e.target?.closest?.('#afdQueue170 .afdQ206');
  if(q){dragQueue=Number(q.dataset.i);dragLocal=null;try{e.dataTransfer.effectAllowed='copyMove';e.dataTransfer.setData('application/x-afd-q206',String(dragQueue))}catch(x){}}
 },true);
 w.addEventListener('dragover',e=>{
  const deck=deckFromTarget(e.target),side=e.target?.closest?.('#afdQueue170');
  if(deck||side){if(dragLocal||dragQueue>=0||isFileDrag(e)){e.preventDefault();try{e.dataTransfer.dropEffect=(side&&dragQueue>=0)?'move':'copy'}catch(x){}}}
 },true);
 w.addEventListener('drop',e=>{
  const deck=deckFromTarget(e.target),side=e.target?.closest?.('#afdQueue170');if(!deck&&!side)return;
  const files=Array.from(e.dataTransfer?.files||[]);let local=dragLocal;
  if(!local){const k=e.dataTransfer?.getData?.('application/x-afd-local-key')||'';if(k)local=itemByKey(k)}
  if(!local&&files.length)local=itemFromFile(files[0]);
  if(deck){
   if(dragQueue>=0){const it=queueAt(dragQueue);if(it){stop(e);Promise.resolve(core()?.loadAny?.(deck,it)).catch(x=>console.warn(x));dragQueue=-1;return}}
   if(local){stop(e);Promise.resolve(reliableLocal(deck,local)).catch(x=>console.warn(x));dragLocal=null;return}
  }
  if(side){
   if(dragQueue>=0){const row=e.target?.closest?.('#afdQueue170 .afdQ206'),to=row?Number(row.dataset.i):Math.max(0,(core()?.queue?.length||1)-1);if(Number.isInteger(to)&&reorder(dragQueue,to)){stop(e);dragQueue=-1;return}}
   if(local){stop(e);addSide(local);dragLocal=null;return}
  }
 },true);
 w.addEventListener('dragend',()=>{dragLocal=null;dragQueue=-1},true);
 w.addEventListener('click',e=>{
  const t=e.target;
  const local=t?.closest?.('#afdTracks170 .afdLocalRow170');
  if(local){const it=itemFromRow(local),b=t.closest?.('[data-a]'),side=t.closest?.('[data-side]');if(b&&it){stop(e);Promise.resolve(reliableLocal(b.dataset.a,it)).catch(x=>console.warn(x));return}if(side&&it){stop(e);addSide(it);return}}
  const q=t?.closest?.('#afdQueue170 .afdQ206');
  if(q){const i=Number(q.dataset.i),it=queueAt(i),load=t.closest?.('[data-load]');if(load&&it){stop(e);Promise.resolve(core()?.loadAny?.(load.dataset.load,it)).catch(x=>console.warn(x));return}if(t.closest?.('[data-play]')&&it){stop(e);Promise.resolve(core()?.playIndex?.(i)).catch(x=>console.warn(x));return}if(t.closest?.('[data-up]')){stop(e);reorder(i,Math.max(0,i-1));return}if(t.closest?.('[data-down]')){stop(e);reorder(i,Math.min((core()?.queue?.length||1)-1,i+1));return}if(t.closest?.('[data-rm]')){stop(e);removeAt(i);return}}
  if(t?.closest?.('#afdAutoStart170')){stop(e);Promise.resolve(core()?.startAuto?.()).catch(x=>console.warn(x));return}
  if(t?.closest?.('#afdAutoStop170')){stop(e);core()?.stopAuto?.();return}
  if(t?.closest?.('#afdStartNext206,#afdStartNext205,#afdStartNext194')){stop(e);Promise.resolve(core()?.startNext?.()).catch(x=>console.warn(x));return}
  if(t?.closest?.('#afdClearQueue170')){stop(e);clearSide();return}
 },true);
 return true;
}
function bindOuter(){
 document.querySelectorAll('#rows .row').forEach(r=>r.draggable=true);
 if(document.documentElement.dataset.afdOuterRecover207)return;
 document.documentElement.dataset.afdOuterRecover207='1';
 document.addEventListener('dragstart',e=>{const r=e.target?.closest?.('#rows .row');if(r){dragOuterRow=r;try{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-afd-outer-row',r.dataset.i||'1')}catch(x){}}},true);
 document.addEventListener('dragend',()=>{dragOuterRow=null},true);
}
function bridgeOuterDrag(){
 const w=W();if(!w||w.__afdOuterBridge207)return;w.__afdOuterBridge207=1;
 w.addEventListener('dragover',e=>{if(dragOuterRow&&deckFromTarget(e.target))e.preventDefault()},true);
 w.addEventListener('drop',e=>{const deck=deckFromTarget(e.target);if(!deck||!dragOuterRow)return;stop(e);const b=dragOuterRow.querySelector('[data-d="'+deck+'"]');if(b){b.click();status('LOCAL • נטען ל-DECK '+deck)}dragOuterRow=null},true);
}
function refresh(){watchVersion();bindOuter();bindInner();bridgeOuterDrag();try{core()?.refresh?.()}catch(e){}}
window.__afdRecover207={refresh,reliableLocal,addSide,get version(){return VERSION}};
frame()?.addEventListener('load',()=>setTimeout(refresh,120));
refresh();setTimeout(refresh,450);setInterval(refresh,350);
})();
