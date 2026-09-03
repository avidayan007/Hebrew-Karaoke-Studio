(()=>{
if(window.__afd218){window.__afd218.refresh();return}
window.__afd218Active=true;
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return F()?.contentWindow||null}catch(e){return null}};
const C=()=>window.__afdCore206;
let dragItem=null,boundInner=null,boundOuter=false;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 218]',t)}
function youtubeFromDOM(row){
 if(!row)return null;
 const n=Number(row.dataset.i);
 let src=null;
 try{src=window.AFDYouTubeState?.getItem?.(n)||window.AFDYouTubeState?.getItems?.()?.[n]||null}catch(e){}
 let id=String(src?.id||src?.videoId||'');
 const img=row.querySelector('img');
 const thumb=String(src?.thumb||img?.currentSrc||img?.src||'');
 if(!id){const m=thumb.match(/\/vi(?:_webp)?\/([^/?]+)[/?]/i)||thumb.match(/[?&]v=([^&]+)/i);if(m)id=decodeURIComponent(m[1])}
 const title=String(src?.title||row.querySelector('b')?.textContent||'YouTube').trim();
 const channel=String(src?.channel||row.querySelector('small')?.textContent||'').trim();
 if(!id){status('YOUTUBE SIDE ERROR • לא נמצא Video ID לתוצאה');return null}
 return{key:'yt218:'+id,name:title,folder:'YouTube',kind:'video',afdYouTubeItem:{id,title,channel,thumb}}
}
function spotifyFromDOM(row){
 const n=Number(row?.dataset.i);let i=null;try{i=window.__afdSpotify196?.getItems?.()?.[n]||null}catch(e){}
 if(!i)return null;const id=String(i.id||i.uri||'');return id?{key:'sp218:'+id,name:String(i.name||'Spotify'),folder:'Spotify',kind:'music',afdSpotifyItem:i}:null
}
function itemFromRow(row){if(row?.matches?.('#afdYTInlineResults .afdYTListRow[data-i]'))return youtubeFromDOM(row);if(row?.matches?.('#afdSP196 [data-i]'))return spotifyFromDOM(row);return null}
function addSide(item){
 if(!item)return false;const core=C();if(!core?.addQueue){status('SIDE VIEW ERROR • מנוע Auto Mix לא זמין');return false}
 const before=Array.isArray(core.queue)?core.queue.length:0;let ok=false;try{ok=core.addQueue(item)!==false}catch(e){status('SIDE VIEW ERROR • '+(e?.message||e));return false}
 const after=Array.isArray(core.queue)?core.queue.length:before;
 if(!ok||after<=before){status('SIDE VIEW ERROR • YouTube לא נכנס לתור');return false}
 try{core.renderQueue?.()}catch(e){}try{window.__afd212?.renderSide?.(true)}catch(e){}
 status((item.afdYouTubeItem?'YOUTUBE':'SPOTIFY')+' • נוסף ל-SIDE VIEW • '+after+' שירים');return true
}
function decorate(){
 document.querySelectorAll('#afdYTInlineResults .afdYTListRow[data-i],#afdSP196 [data-i]').forEach(row=>{
  row.draggable=true;row.style.cursor='grab';
  row.querySelectorAll('[data-d]').forEach(b=>b.remove());
  let b=row.querySelector('[data-side218],[data-side217],[data-side215]');
  if(!b){b=document.createElement('button');(row.querySelector('.sp196acts')||row).appendChild(b)}
  b.dataset.side218=row.matches('#afdYTInlineResults .afdYTListRow[data-i]')?'youtube':'spotify';
  b.textContent='SIDE +';b.title='הוסף ל-Side View / Auto Mix';
 })
}
function pack(x){try{return JSON.stringify(x)}catch(e){return''}}
function unpack(dt){let raw='';try{raw=dt?.getData?.('application/x-afd218-online-json')||''}catch(e){}if(!raw)try{const t=dt?.getData?.('text/plain')||'';if(t.startsWith('AFD218:'))raw=t.slice(7)}catch(e){}if(raw)try{return JSON.parse(raw)}catch(e){}return dragItem}
function bindOuter(){if(boundOuter)return;boundOuter=true;
 window.addEventListener('click',e=>{
  const b=e.target?.closest?.('[data-side218]');if(!b)return;const row=b.closest?.('#afdYTInlineResults .afdYTListRow[data-i],#afdSP196 [data-i]');if(!row)return;
  const item=itemFromRow(row);if(!item)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();addSide(item)
 },true);
 window.addEventListener('dragstart',e=>{
  const row=e.target?.closest?.('#afdYTInlineResults .afdYTListRow[data-i],#afdSP196 [data-i]');if(!row)return;const item=itemFromRow(row);if(!item)return;dragItem=item;const raw=pack(item);
  try{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-afd218-online-json',raw);e.dataTransfer.setData('text/plain','AFD218:'+raw)}catch(x){}
 },true);
 window.addEventListener('dragend',()=>setTimeout(()=>{dragItem=null},700),true)
}
function bindInner(){const w=W(),d=D();if(!w||!d||boundInner===w)return;boundInner=w;
 const sideSel='#afd212side,#afd208side,#afdQueue170,.sideview';
 const accept=e=>{const item=unpack(e.dataTransfer);if(!item||!e.target?.closest?.(sideSel))return;e.preventDefault();e.stopPropagation();try{e.dataTransfer.dropEffect='copy'}catch(x){}};
 const drop=e=>{const item=unpack(e.dataTransfer);if(!item||!e.target?.closest?.(sideSel))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();dragItem=null;addSide(item)};
 w.addEventListener('dragenter',accept,true);w.addEventListener('dragover',accept,true);w.addEventListener('drop',drop,true);
 d.querySelectorAll('#afd212side,#afd208side,#afdQueue170,.sideview').forEach(el=>{el.addEventListener('dragover',accept,true);el.addEventListener('drop',drop,true)})
}
function css(){let s=document.getElementById('afd218css');if(!s){s=document.createElement('style');s.id='afd218css';document.head.appendChild(s)}s.textContent=`#afdSP196 [data-d],#afdYTInlineResults [data-d]{display:none!important}#afdSP196 [data-side218],#afdYTInlineResults [data-side218]{display:block!important;width:100%!important;height:29px!important;font-size:8px!important;font-weight:900!important;border:1px solid #59636e!important;border-radius:5px!important;background:#151b22!important;color:#fff!important}`}
function refresh(){window.__afd218Active=true;css();decorate();bindOuter();bindInner()}
window.__afd218={refresh,addSide,youtubeFromDOM};F()?.addEventListener('load',()=>setTimeout(()=>{boundInner=null;refresh()},800));refresh();setInterval(refresh,650);
})();
