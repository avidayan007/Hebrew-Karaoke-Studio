(()=>{
if(window.__afd214){window.__afd214.refresh();return}
window.__afd214Active=true;
const VERSION='__AFD_VERSION__';
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return F()?.contentWindow||null}catch(e){return null}};
const C=()=>window.__afdCore206;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const seq={A:0,B:0},owner={A:'',B:''};
let boundWindow=null,dragOnline=null;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 214]',t)}
function typeOf(x){if(!x)return'';if(x.afdHistorySource==='Spotify'||x.afdSpotifyItem||x.spotifyItem||x.__source==='spotify')return'spotify';if(x.afdHistorySource==='YouTube'||x.afdYouTubeItem||x.youtubeItem)return'youtube';return'local'}
function nameOf(x){return String(x?.name||x?.afdSpotifyItem?.name||x?.afdYouTubeItem?.title||x?.afdHistoryItem?.name||'Track')}
function payload(x,t=typeOf(x)){
  if(t==='spotify')return x?.afdHistoryItem||x?.afdSpotifyItem||x?.spotifyItem||x;
  if(t==='youtube'){const i=x?.afdHistoryItem||x?.afdYouTubeItem||x?.youtubeItem||x||{};return{id:i.id||i.videoId||'',title:i.title||x?.name||'YouTube',channel:i.channel||'',thumb:i.thumb||''}}
  if(x?.afdHistorySource==='Local')return{...(x.afdHistoryItem||{}),path:x.afdHistoryItem?.path||x.path||'',key:x.afdHistoryItem?.key||x.key||'',name:x.afdHistoryItem?.name||x.name||'Track',folder:x.afdHistoryItem?.folder||x.folder||'Playlist',kind:x.afdHistoryItem?.kind||x.kind||'music'};
  return x||{};
}
function deckVideo(k){return D()?.getElementById('vid'+k)||null}
function deckMaster(k){return D()?.getElementById('master'+k)||null}
function inferOwner(k){if(window.AFDSpotifyState?.has?.(k))return'spotify';if(window.AFDYouTubeState?.isLoaded?.(k)||D()?.getElementById('ytDeck'+k))return'youtube';const v=deckVideo(k);if(window.AFDLocalDeckMeta?.[k]||(v&&(v.currentSrc||v.src)))return'local';return''}
function waitFor(fn,ms=6500){return new Promise(async resolve=>{const end=performance.now()+ms;while(performance.now()<end){try{if(fn())return resolve(true)}catch(e){}await sleep(65)}let ok=false;try{ok=!!fn()}catch(e){}resolve(ok)})}
async function stopSpotify(k){const s=window.AFDSpotifyState;if(!s)return;try{if(s.has?.(k)){if(s.stopNow)await Promise.race([Promise.resolve(s.stopNow(k)),sleep(700)]);else if(s.pauseNow)await Promise.race([Promise.resolve(s.pauseNow(k)),sleep(700)]);else s.pause?.(k)}}catch(e){}try{s.clear?.(k)}catch(e){}D()?.getElementById('afdSP105Deck'+k)?.remove()}
function stopYouTube(k){const s=window.AFDYouTubeState;try{s?.stop?.(k)}catch(e){}try{s?.clear?.(k)}catch(e){}const d=D();d?.getElementById('ytDeck'+k)?.remove();const m=d?.getElementById('ytMaster'+k);if(m)m.style.display='none'}
function stopLocal(k){try{window.AFDWindowsLoadState?.cancel?.(k)}catch(e){}const v=deckVideo(k),m=deckMaster(k);if(v){try{v.pause();v.removeAttribute('src');v.load()}catch(e){}v.style.display='none'}if(m){try{m.pause();m.removeAttribute('src');m.load()}catch(e){}m.style.display='none'}if(window.AFDLocalDeckMeta)window.AFDLocalDeckMeta[k]=null}
async function hardClear(k){await stopSpotify(k);stopYouTube(k);stopLocal(k);owner[k]='';const d=D();const t=d?.getElementById('title'+k);if(t)t.textContent='Loading…'}
async function replaceSpotify(k,x,my){const i=payload(x,'spotify');if(!i?.id&&!i?.uri)return false;window.dispatchEvent(new CustomEvent('afd-spotify-load',{detail:{deck:k,item:i,afd214:true}}));const ok=await waitFor(()=>window.AFDSpotifyState?.has?.(k),4500);if(my!==seq[k])return false;if(ok){owner[k]='spotify';status('SPOTIFY • '+(i.name||'Track')+' → DECK '+k)}else status('SPOTIFY ERROR • לא נטען ל-DECK '+k);return ok}
async function replaceYouTube(k,x,my){const i=payload(x,'youtube');if(!i?.id)return false;let ok=false;try{ok=(await window.AFDYouTubeState?.load?.(k,i))!==false}catch(e){status('YOUTUBE ERROR • '+(e?.message||e));return false}if(ok)ok=await waitFor(()=>window.AFDYouTubeState?.isLoaded?.(k)||!!D()?.getElementById('ytDeck'+k),6000);if(my!==seq[k]){try{window.AFDYouTubeState?.clear?.(k)}catch(e){}return false}if(ok){owner[k]='youtube';status('YOUTUBE • '+(i.title||'Track')+' → DECK '+k)}else status('YOUTUBE ERROR • לא נטען ל-DECK '+k);return ok}
async function replaceLocal(k,x,my){const i=payload(x,'local');let ok=false;try{if(typeof window.AFDWindowsLoadItem==='function')ok=!!(await window.AFDWindowsLoadItem(k,i));if(!ok&&i?.file&&typeof W()?.load==='function'){W().load(k,i.file);ok=await waitFor(()=>!!(deckVideo(k)?.currentSrc||deckVideo(k)?.src),2500)}}catch(e){status('LOCAL ERROR • '+(e?.message||e));return false}if(my!==seq[k])return false;if(ok){owner[k]='local';status('LOCAL • '+nameOf(i)+' → DECK '+k)}else status('LOCAL ERROR • לא נטען ל-DECK '+k);return ok}
async function replaceDeck(k,x,forced=''){
  if(!['A','B'].includes(k)||!x)return false;
  const my=++seq[k],t=forced||typeOf(x);status('DECK '+k+' • מחליף מקור...');
  await hardClear(k);if(my!==seq[k])return false;
  if(t==='spotify')return replaceSpotify(k,x,my);
  if(t==='youtube')return replaceYouTube(k,x,my);
  return replaceLocal(k,x,my);
}
const loadDeck=(k,x)=>replaceDeck(k,x,'');
const loadSpotify=(k,x)=>replaceDeck(k,x,'spotify');
const loadYouTube=(k,x)=>replaceDeck(k,x,'youtube');
const loadLocal=(k,x)=>replaceDeck(k,x,'local');
function spWrap(i){return i?{key:'sp214:'+(i.id||i.uri||Date.now()),name:i.name||'Spotify',folder:'Spotify',kind:'music',afdSpotifyItem:i}:null}
function ytWrap(i){return i?{key:'yt214:'+(i.id||i.videoId||Date.now()),name:i.title||'YouTube',folder:'YouTube',kind:'video',afdYouTubeItem:{id:i.id||i.videoId||'',title:i.title||'YouTube',channel:i.channel||'',thumb:i.thumb||''}}:null}
function decorateDrag(){
  document.querySelectorAll('#afdYTInlineResults .afdYTListRow[data-i]').forEach(r=>{r.draggable=true;r.style.cursor='grab'});
  document.querySelectorAll('#afdSP196 [data-i]').forEach(r=>{r.draggable=true;r.style.cursor='grab'});
}
function bindOuterDrag(){
  if(document.documentElement.dataset.afd214drag)return;document.documentElement.dataset.afd214drag='1';
  document.addEventListener('dragstart',e=>{
    const y=e.target?.closest?.('#afdYTInlineResults .afdYTListRow[data-i]');
    if(y){const i=(window.AFDYouTubeState?.getItems?.()||[])[+y.dataset.i];dragOnline=ytWrap(i);if(dragOnline){try{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-afd214-youtube',JSON.stringify(dragOnline.afdYouTubeItem));e.dataTransfer.setData('text/plain',dragOnline.name)}catch(x){}}return}
    const s=e.target?.closest?.('#afdSP196 [data-i]');
    if(s){const i=(window.__afdSpotify196?.getItems?.()||[])[+s.dataset.i];dragOnline=spWrap(i);if(dragOnline){try{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-afd214-spotify',JSON.stringify(dragOnline.afdSpotifyItem));e.dataTransfer.setData('text/plain',dragOnline.name)}catch(x){}}}
  },true);
  document.addEventListener('dragend',()=>setTimeout(()=>{dragOnline=null},80),true);
}
function bindInnerDrop(){
  const w=W(),d=D();if(!w||!d||boundWindow===w)return;boundWindow=w;
  w.addEventListener('dragover',e=>{if(dragOnline&&e.target?.closest?.('.deckA,.deckB,#afd212side')){e.preventDefault();try{e.dataTransfer.dropEffect='copy'}catch(x){}}},true);
  w.addEventListener('drop',e=>{if(!dragOnline)return;const deck=e.target?.closest?.('.deckA,.deckB'),side=e.target?.closest?.('#afd212side');if(!deck&&!side)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const item=dragOnline;dragOnline=null;if(deck)loadDeck(deck.classList.contains('deckA')?'A':'B',item);else{C()?.addQueue?.(item);window.__afd212?.renderSide?.(true)}},true);
}
function localPath(i){let p=String(i?.path||'');if(p)return p;try{return String(window.afdDesktopMedia?.getPath?.(i?.key||'')||'')}catch(e){return''}}
function serialize(x){const t=typeOf(x),i=payload(x,t);if(t==='spotify')return{t:'sp',n:nameOf(x),i};if(t==='youtube')return{t:'yt',n:nameOf(x),i};return{t:'lo',n:nameOf(x),p:localPath(i),k:String(i?.key||''),f:String(i?.folder||'Playlist'),d:String(i?.kind||'music')}}
async function saveSide(){
  const list=Array.isArray(C()?.queue)?C().queue:[],items=list.map(serialize).filter(x=>x.t!=='lo'||x.p);
  if(!items.length){status('PLAYLIST • אין שירים שניתנים לשמירה');return false}
  const saver=window.afdDesktopMedia?.savePlaylist;if(!saver){status('PLAYLIST SAVE ERROR • מנוע Save לא נטען');return false}
  status('PLAYLIST • פותח חלון שמירה...');
  try{
    const r=await saver({defaultName:'AFD Playlist',items});if(!r||r.canceled){status('PLAYLIST • השמירה בוטלה');return false}
    const key='afdSavedPlaylists212',reg=JSON.parse(localStorage.getItem(key)||'{}')||{};
    reg[r.name]={name:r.name,path:r.filePath,items:r.items||items,savedAt:Date.now()};localStorage.setItem(key,JSON.stringify(reg));
    window.__afd212?.renderPlaylist?.(true);status('PLAYLIST SAVED • '+r.name+' • '+items.length+' שירים');return true
  }catch(e){status('PLAYLIST SAVE ERROR • '+(e?.message||e));return false}
}
function css(){
  const d=D();if(!d?.head)return;let s=d.getElementById('afd214css');if(!s){s=d.createElement('style');s.id='afd214css';d.head.appendChild(s)}
  s.textContent=`
.deck .transport{gap:8px!important;align-items:start!important;min-height:62px!important}
.deck .transport button{height:54px!important;min-height:54px!important;font-size:12px!important;border-radius:7px!important;padding:0 8px!important}
.deck .transport .sync,.deck .transport [data-act="sync"]{height:50px!important;min-height:50px!important;margin-top:6px!important;font-size:11px!important}
#afd212side .s212ctl button{min-height:28px!important;font-size:8px!important}
`;
}
function refresh(){window.__afd214Active=true;decorateDrag();bindOuterDrag();bindInnerDrop();css();for(const k of ['A','B'])if(!owner[k])owner[k]=inferOwner(k)}
const api={refresh,loadDeck,loadLocal,loadSpotify,loadYouTube,saveSide,getOwner:k=>owner[k]||inferOwner(k)};
window.__afdUnified214=api;window.__afdUnified213=api;window.__afdUnified212=api;window.__afdUnified211=api;window.__afd214=api;
F()?.addEventListener('load',()=>setTimeout(()=>{boundWindow=null;refresh()},650));refresh();setInterval(refresh,950);
})();