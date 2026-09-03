(()=>{
if(window.__afd216){window.__afd216.refresh();return}
window.__afd216Active=true;
const VERSION='__AFD_VERSION__';
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return F()?.contentWindow||null}catch(e){return null}};
const C=()=>window.__afdCore206;
let boundInner=null,currentDrag=null,ytView=localStorage.getItem('afdYTView216')||'grid';
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 216]',t)}
function safeSpotify(i){if(!i)return null;return{id:String(i.id||''),uri:String(i.uri||''),name:String(i.name||'Spotify'),duration_ms:Number(i.duration_ms)||0,artists:Array.isArray(i.artists)?i.artists.slice(0,8).map(a=>({name:String(a?.name||'')})):[],album:{name:String(i.album?.name||''),images:Array.isArray(i.album?.images)?i.album.images.slice(0,3).map(x=>({url:String(x?.url||''),width:Number(x?.width)||null,height:Number(x?.height)||null})):[]}}}
function spWrap(i){const s=safeSpotify(i);return s&&(s.id||s.uri)?{key:'sp216:'+(s.id||s.uri),name:s.name,folder:'Spotify',kind:'music',afdSpotifyItem:s}:null}
function ytWrap(i){const id=String(i?.id||i?.videoId||'');return id?{key:'yt216:'+id,name:String(i?.title||'YouTube'),folder:'YouTube',kind:'video',afdYouTubeItem:{id,title:String(i?.title||'YouTube'),channel:String(i?.channel||''),thumb:String(i?.thumb||'')}}:null}
function rowItem(row,kind){const n=Number(row?.dataset.i);if(!Number.isInteger(n))return null;if(kind==='youtube')return ytWrap((window.AFDYouTubeState?.getItems?.()||[])[n]);return spWrap((window.__afdSpotify196?.getItems?.()||[])[n])}
function addSide(x){if(!x)return false;const ok=C()?.addQueue?.(x);window.__afd212?.renderSide?.(true);if(ok!==false)status((x.afdYouTubeItem?'YOUTUBE':'SPOTIFY')+' • נוסף ל-SIDE VIEW');return ok!==false}
function onlineKind(row){return row?.matches?.('#afdYTInlineResults .afdYTListRow[data-i]')?'youtube':row?.matches?.('#afdSP196 [data-i]')?'spotify':''}
function packed(x){if(!x)return'';try{return JSON.stringify(x)}catch(e){return''}}
function unpack(dt){
 let raw='';try{raw=dt?.getData?.('application/x-afd216-online-json')||''}catch(e){}
 if(!raw)try{const t=dt?.getData?.('text/plain')||'';if(t.startsWith('AFD216:'))raw=t.slice(7)}catch(e){}
 if(raw)try{return JSON.parse(raw)}catch(e){}
 return currentDrag;
}
function hasOnlineDrag(e){if(currentDrag)return true;try{const t=[...(e.dataTransfer?.types||[])];return t.includes('application/x-afd216-online-json')||t.includes('application/x-afd215-online')}catch(x){return false}}
function ensureYTTools(){
 const body=document.getElementById('yt208body');if(!body)return;
 let tools=document.getElementById('afdYTTools216');
 if(!tools){tools=document.createElement('div');tools.id='afdYTTools216';tools.innerHTML='<span>תצוגת YouTube</span><button data-v216="grid">▦ GRID</button><button data-v216="list">☰ LIST</button><small>גרור שיר ל-DECK או ל-SIDE VIEW</small>';body.insertBefore(tools,body.firstChild);tools.querySelectorAll('[data-v216]').forEach(b=>b.onclick=()=>setYTView(b.dataset.v216))}
 tools.querySelector('[data-v216="grid"]')?.classList.toggle('on',ytView==='grid');
 tools.querySelector('[data-v216="list"]')?.classList.toggle('on',ytView==='list');
}
function setYTView(v){ytView=v==='list'?'list':'grid';localStorage.setItem('afdYTView216',ytView);applyYTView()}
function applyYTView(){ensureYTTools();const box=document.getElementById('afdYTInlineResults');if(!box)return;box.classList.toggle('afdYTGrid216',ytView==='grid');box.classList.toggle('afdYTList216',ytView==='list');const tools=document.getElementById('afdYTTools216');tools?.querySelector('[data-v216="grid"]')?.classList.toggle('on',ytView==='grid');tools?.querySelector('[data-v216="list"]')?.classList.toggle('on',ytView==='list')}
function decorate(){
 document.querySelectorAll('#afdSP196 [data-i],#afdYTInlineResults .afdYTListRow[data-i]').forEach(r=>{r.draggable=true;r.style.cursor='grab'});
 applyYTView();
}
function bindOuter(){
 if(document.documentElement.dataset.afd216outer)return;document.documentElement.dataset.afd216outer='1';
 document.addEventListener('dragstart',e=>{
  const row=e.target?.closest?.('#afdYTInlineResults .afdYTListRow[data-i],#afdSP196 [data-i]');if(!row)return;const kind=onlineKind(row),item=rowItem(row,kind);if(!item)return;currentDrag=item;const raw=packed(item);try{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-afd216-online-json',raw);e.dataTransfer.setData('text/plain','AFD216:'+raw)}catch(x){}
 },true);
 document.addEventListener('dragend',()=>setTimeout(()=>{currentDrag=null},350),true);
 document.addEventListener('click',e=>{
  const b=e.target?.closest?.('#afdYTInlineResults [data-side215],#afdSP196 [data-side215]');if(!b)return;const row=b.closest?.('#afdYTInlineResults .afdYTListRow[data-i],#afdSP196 [data-i]');if(!row)return;const kind=onlineKind(row),item=rowItem(row,kind);if(!item)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();addSide(item)
 },true)
}
function bindInner(){
 const w=W();if(!w||!w.document||boundInner===w)return;boundInner=w;
 const targetSel='.deckA,.deckB,#afd212side,#afd208side,#afdQueue170,.sideview';
 w.addEventListener('dragover',e=>{if(!hasOnlineDrag(e)||!e.target?.closest?.(targetSel))return;e.preventDefault();try{e.dataTransfer.dropEffect='copy'}catch(x){}},true);
 w.addEventListener('drop',e=>{
  if(!hasOnlineDrag(e))return;const deck=e.target?.closest?.('.deckA,.deckB'),side=e.target?.closest?.('#afd212side,#afd208side,#afdQueue170,.sideview');if(!deck&&!side)return;const item=unpack(e.dataTransfer);if(!item)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();currentDrag=null;
  if(deck){const k=deck.classList.contains('deckA')?'A':'B';const loader=window.__afdUnified215?.loadDeck||window.__afd215?.loadDeck;if(loader)loader(k,item)}else addSide(item)
 },true)
}
function css(){
 let s=document.getElementById('afd216css');if(!s){s=document.createElement('style');s.id='afd216css';document.head.appendChild(s)}
 s.textContent=`
#afdSP196 [data-d],#afdYTInlineResults [data-d]{display:none!important}
#afdSP196 .sp196grid{grid-template-columns:repeat(auto-fill,minmax(112px,1fr))!important;gap:7px!important}
#afdSP196 .sp196card{padding:6px!important;min-width:0!important}
#afdSP196 .sp196card img{width:82px!important;height:82px!important;aspect-ratio:1!important;object-fit:cover!important;display:block!important;margin:0 auto 5px!important;border-radius:5px!important}
#afdSP196 .sp196card b{font-size:9px!important}
#afdSP196 .sp196card span{font-size:7px!important}
#afdSP196 .sp196acts{grid-template-columns:1fr!important;margin-top:5px!important}
#afdSP196 .sp196row{grid-template-columns:44px minmax(0,1fr) 64px!important;padding:5px!important}
#afdSP196 .sp196row img{width:42px!important;height:42px!important;aspect-ratio:1!important;object-fit:cover!important}
#afdSP196 [data-side215]{display:block!important;width:100%!important;height:25px!important;font-size:7px!important}
#afd208online{min-height:0!important}
#yt208body{flex:1!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;padding:6px!important}
#afdYTTools216{display:grid;grid-template-columns:120px 72px 72px 1fr;gap:6px;align-items:center;padding:5px 6px;border:1px solid #303944;border-radius:5px;background:#0d1218;margin-bottom:6px;direction:rtl}
#afdYTTools216 span{font-weight:900;font-size:9px}#afdYTTools216 small{font-size:8px;color:#98a5b2;text-align:left}
#afdYTTools216 button{height:28px!important;border:1px solid #4c5661;border-radius:5px;background:#141b23;color:#fff;font-size:8px!important}#afdYTTools216 button.on{border-color:#ff4b4b!important;background:#271417!important}
#yt208body #afdYTInlineResults{flex:1!important;min-height:0!important;max-height:none!important;width:100%!important;overflow:auto!important;margin:0!important}
#afdYTInlineResults.afdYTGrid216{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,1fr))!important;align-content:start!important;gap:8px!important;padding:8px!important}
#afdYTInlineResults.afdYTGrid216 .afdYTListRow{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:5px!important;padding:6px!important;border:1px solid #252d36!important;border-radius:6px!important;background:#10161d!important;min-width:0!important}
#afdYTInlineResults.afdYTGrid216 .afdYTListRow>img{width:100%!important;height:76px!important;object-fit:cover!important;border-radius:4px!important}
#afdYTInlineResults.afdYTGrid216 .afdYTListRow>div{min-width:0!important}
#afdYTInlineResults.afdYTGrid216 .afdYTListRow b{display:block!important;font-size:8px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#afdYTInlineResults.afdYTGrid216 .afdYTListRow small{font-size:7px!important;color:#9aa6b2!important}
#afdYTInlineResults.afdYTGrid216 [data-side215]{width:100%!important;height:25px!important;font-size:7px!important;margin-top:auto!important}
#afdYTInlineResults.afdYTList216{display:block!important;padding:4px!important}
#afdYTInlineResults.afdYTList216 .afdYTListRow{display:grid!important;grid-template-columns:64px minmax(0,1fr) 70px!important;gap:8px!important;align-items:center!important;padding:6px!important;border-bottom:1px solid #20262d!important}
#afdYTInlineResults.afdYTList216 .afdYTListRow>img{width:62px!important;height:38px!important;object-fit:cover!important;border-radius:4px!important}
#afdYTInlineResults.afdYTList216 [data-side215]{display:block!important;height:25px!important;font-size:7px!important}
`;
}
function refresh(){window.__afd216Active=true;css();decorate();bindOuter();bindInner()}
window.__afd216={refresh,setYTView,addSide};
F()?.addEventListener('load',()=>setTimeout(()=>{boundInner=null;refresh()},700));refresh();setInterval(refresh,900);
})();
