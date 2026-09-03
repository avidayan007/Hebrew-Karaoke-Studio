(()=>{
if(window.__afd215){window.__afd215.refresh();return}
window.__afd215Active=true;
const VERSION='__AFD_VERSION__';
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return F()?.contentWindow||null}catch(e){return null}};
const C=()=>window.__afdCore206;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const seq={A:0,B:0},slots={A:null,B:null};
let boundWindow=null,dragOnline=null;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 215]',t)}
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
function waitFor(fn,ms=8000){return new Promise(async resolve=>{const end=performance.now()+ms;while(performance.now()<end){try{if(fn())return resolve(true)}catch(e){}await sleep(70)}let ok=false;try{ok=!!fn()}catch(e){}resolve(ok)})}
function actualOwner(k){if(window.AFDSpotifyState?.has?.(k))return'spotify';if(window.AFDYouTubeState?.isLoaded?.(k)||D()?.getElementById('ytDeck'+k))return'youtube';const v=deckVideo(k);if(window.AFDLocalDeckMeta?.[k]||(v&&(v.currentSrc||v.src)))return'local';return''}
function ownerOf(k){const actual=actualOwner(k);if(actual){if(!slots[k]||slots[k].type!==actual)slots[k]={type:actual,item:slots[k]?.item||null};return actual}return slots[k]?.type||''}
async function pauseSpotify(k,reset=false){const s=window.AFDSpotifyState;if(!s?.has?.(k))return false;try{if(reset&&s.stopNow)await Promise.resolve(s.stopNow(k));else if(s.pauseNow)await Promise.resolve(s.pauseNow(k));else if(reset){window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'stop'}}))}else if(s.pause)await Promise.resolve(s.pause(k));return true}catch(e){return false}}
function pauseYouTube(k,reset=false){const s=window.AFDYouTubeState;if(!(s?.isLoaded?.(k)||D()?.getElementById('ytDeck'+k)))return false;try{if(reset&&s?.stop)return s.stop(k)!==false;if(!reset&&s?.pause)return s.pause(k)!==false;window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:reset?'stop':'pause'}}));return true}catch(e){return false}}
async function clearSpotify(k){const s=window.AFDSpotifyState;try{if(s?.has?.(k))await Promise.race([pauseSpotify(k,true),sleep(900)])}catch(e){}try{s?.clear?.(k)}catch(e){}D()?.getElementById('afdSP105Deck'+k)?.remove()}
function clearYouTube(k){try{pauseYouTube(k,true)}catch(e){}try{window.AFDYouTubeState?.clear?.(k)}catch(e){}const d=D();d?.getElementById('ytDeck'+k)?.remove();const m=d?.getElementById('ytMaster'+k);if(m)m.style.display='none'}
function clearLocal(k){try{window.AFDWindowsLoadState?.cancel?.(k)}catch(e){}const v=deckVideo(k),m=deckMaster(k);if(v){try{v.pause();v.removeAttribute('src');v.load()}catch(e){}v.style.display='none'}if(m){try{m.pause();m.removeAttribute('src');m.load()}catch(e){}m.style.display='none'}if(window.AFDLocalDeckMeta)window.AFDLocalDeckMeta[k]=null}
async function clearDeck(k){await clearSpotify(k);clearYouTube(k);clearLocal(k);slots[k]=null;const t=D()?.getElementById('title'+k);if(t)t.textContent='Loading…'}
async function loadSpotifyOnly(k,x,my){const i=payload(x,'spotify');if(!i?.id&&!i?.uri){status('SPOTIFY ERROR • חסר מזהה שיר');return false}window.dispatchEvent(new CustomEvent('afd-spotify-load',{detail:{deck:k,item:i,afd215:true}}));const ok=await waitFor(()=>window.AFDSpotifyState?.has?.(k),5500);if(my!==seq[k])return false;if(ok){slots[k]={type:'spotify',item:i};status('SPOTIFY READY • '+(i.name||'Track')+' → DECK '+k+' • לחץ PLAY')}else status('SPOTIFY ERROR • השיר לא נשמר ב-DECK '+k);return ok}
async function loadYouTubeOnly(k,x,my){const i=payload(x,'youtube');if(!i?.id){status('YOUTUBE ERROR • חסר Video ID');return false}let ok=false;try{ok=(await window.AFDYouTubeState?.load?.(k,i))!==false}catch(e){status('YOUTUBE ERROR • '+(e?.message||e));return false}if(ok)ok=await waitFor(()=>window.AFDYouTubeState?.isLoaded?.(k)||!!D()?.getElementById('ytDeck'+k),7500);if(my!==seq[k])return false;if(ok){slots[k]={type:'youtube',item:i};status('YOUTUBE READY • '+(i.title||'Track')+' → DECK '+k+' • לחץ PLAY')}else status('YOUTUBE ERROR • השיר לא נשמר ב-DECK '+k);return ok}
async function loadLocalOnly(k,x,my){const i=payload(x,'local');let ok=false;try{if(typeof window.AFDWindowsLoadItem==='function')ok=!!(await window.AFDWindowsLoadItem(k,i));if(!ok&&i?.file&&typeof W()?.load==='function'){W().load(k,i.file);ok=await waitFor(()=>!!(deckVideo(k)?.currentSrc||deckVideo(k)?.src),3000)}}catch(e){status('LOCAL ERROR • '+(e?.message||e));return false}if(my!==seq[k])return false;if(ok){slots[k]={type:'local',item:i};status('LOCAL READY • '+nameOf(i)+' → DECK '+k)}else status('LOCAL ERROR • לא נטען ל-DECK '+k);return ok}
async function replaceDeck(k,x,forced=''){
 if(!['A','B'].includes(k)||!x)return false;const my=++seq[k],t=forced||typeOf(x);status('DECK '+k+' • מחליף ל-'+t.toUpperCase()+'…');await clearDeck(k);if(my!==seq[k])return false;
 if(t==='spotify')return loadSpotifyOnly(k,x,my);if(t==='youtube')return loadYouTubeOnly(k,x,my);return loadLocalOnly(k,x,my)
}
const loadDeck=(k,x)=>replaceDeck(k,x,'');
const loadSpotify=(k,x)=>replaceDeck(k,x,'spotify');
const loadYouTube=(k,x)=>replaceDeck(k,x,'youtube');
const loadLocal=(k,x)=>replaceDeck(k,x,'local');
async function startDeck(k){
 const own=ownerOf(k);if(!own){status('DECK '+k+' • אין שיר טעון');return false}
 if(own==='spotify'){
  if(window.AFDSpotifyState?.isPlaying?.(k))return true;
  try{if(window.AFDSpotifyState?.playNow)await Promise.resolve(window.AFDSpotifyState.playNow(k));else window.AFDSpotifyState?.play?.(k)}catch(e){status('SPOTIFY PLAY ERROR • '+(e?.message||e));return false}
  const ok=await waitFor(()=>!!window.AFDSpotifyState?.isPlaying?.(k),10000);if(!ok)status('SPOTIFY PLAY ERROR • הנגן לא התחיל. בדוק חיבור Spotify Premium');return ok
 }
 if(own==='youtube'){
  if(window.AFDYouTubeState?.isPlaying?.(k))return true;
  try{if(typeof window.AFDYouTubeState?.play==='function')window.AFDYouTubeState.play(k);else window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'play'}}))}catch(e){status('YOUTUBE PLAY ERROR • '+(e?.message||e));return false}
  const ok=await waitFor(()=>!!window.AFDYouTubeState?.isPlaying?.(k),6500);if(!ok){const t=window.AFDYouTubeState?.getTime?.(k)||{};status(t.blocked?'YOUTUBE • הסרטון חסום לניגון בתוך אפליקציה':'YOUTUBE PLAY ERROR • הסרטון לא התחיל')}return ok
 }
 const v=deckVideo(k),m=deckMaster(k);if(!v||(!v.currentSrc&&!v.src)){status('LOCAL PLAY ERROR • אין מקור ב-DECK '+k);return false}try{if(v.ended)v.currentTime=0;await v.play();if(m&&(m.currentSrc||m.src)&&m.style.display!=='none'){try{m.currentTime=v.currentTime;await m.play()}catch(e){}}return true}catch(e){status('LOCAL PLAY ERROR • '+(e?.message||e));return false}
}
async function toggleDeck(k){const own=ownerOf(k);if(!own)return false;if(own==='spotify'){if(window.AFDSpotifyState?.isPlaying?.(k)){await pauseSpotify(k,false);status('SPOTIFY PAUSE • DECK '+k);return true}return startDeck(k)}if(own==='youtube'){if(window.AFDYouTubeState?.isPlaying?.(k)){pauseYouTube(k,false);status('YOUTUBE PAUSE • DECK '+k);return true}return startDeck(k)}const v=deckVideo(k),m=deckMaster(k);if(!v)return false;if(!v.paused&&!v.ended){v.pause();try{m?.pause()}catch(e){}return true}return startDeck(k)}
async function cueDeck(k){const own=ownerOf(k);if(own==='spotify'){await pauseSpotify(k,true);status('SPOTIFY CUE • DECK '+k+' • 00:00');return true}if(own==='youtube'){pauseYouTube(k,true);status('YOUTUBE CUE • DECK '+k+' • 00:00');return true}if(own==='local'){const v=deckVideo(k),m=deckMaster(k);try{v?.pause();m?.pause();if(v)v.currentTime=0;if(m&&(m.currentSrc||m.src))m.currentTime=0}catch(e){}return true}return false}
function deckAct(t){const b=t?.closest?.('[data-act]');if(!b)return null;const k=b.dataset.d||(b.closest('.deckA')?'A':b.closest('.deckB')?'B':'');if(!['A','B'].includes(k))return null;return{k,act:b.dataset.act||''}}
function bindTransport(){const w=W();if(!w||!w.document||boundWindow===w)return;boundWindow=w;w.document.documentElement.dataset.afd215transport='1';w.addEventListener('pointerdown',e=>{const x=deckAct(e.target);if(!x||!['play','cue'].includes(x.act)||!ownerOf(x.k))return;e.stopPropagation();e.stopImmediatePropagation()},true);w.addEventListener('click',e=>{const x=deckAct(e.target);if(!x||!['play','cue'].includes(x.act)||!ownerOf(x.k))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(x.act==='play')toggleDeck(x.k);else cueDeck(x.k)},true)}
function spWrap(i){return i?{key:'sp215:'+(i.id||i.uri||Date.now()),name:i.name||'Spotify',folder:'Spotify',kind:'music',afdSpotifyItem:i}:null}
function ytWrap(i){return i?{key:'yt215:'+(i.id||i.videoId||Date.now()),name:i.title||'YouTube',folder:'YouTube',kind:'video',afdYouTubeItem:{id:i.id||i.videoId||'',title:i.title||'YouTube',channel:i.channel||'',thumb:i.thumb||''}}:null}
function onlineItem(row,kind){const i=Number(row?.dataset.i);if(!Number.isInteger(i))return null;if(kind==='youtube')return ytWrap((window.AFDYouTubeState?.getItems?.()||[])[i]);return spWrap((window.__afdSpotify196?.getItems?.()||[])[i])}
function addSide(x){if(!x)return false;const ok=C()?.addQueue?.(x);window.__afd212?.renderSide?.(true);return ok!==false}
function localPath(i){let p=String(i?.path||'');if(p)return p;try{return String(window.afdDesktopMedia?.getPath?.(i?.key||'')||'')}catch(e){return''}}
function serialize(x){const t=typeOf(x),i=payload(x,t);if(t==='spotify')return{t:'sp',n:nameOf(x),i};if(t==='youtube')return{t:'yt',n:nameOf(x),i};return{t:'lo',n:nameOf(x),p:localPath(i),k:String(i?.key||''),f:String(i?.folder||'Playlist'),d:String(i?.kind||'music')}}
async function saveSide(){const list=Array.isArray(C()?.queue)?C().queue:[],items=list.map(serialize).filter(x=>x.t!=='lo'||x.p);if(!items.length){status('PLAYLIST • אין שירים שניתנים לשמירה');return false}const saver=window.afdDesktopMedia?.savePlaylist;if(!saver){status('PLAYLIST SAVE ERROR • מנוע Save לא נטען');return false}status('PLAYLIST • פותח חלון שמירה...');try{const r=await saver({defaultName:'AFD Playlist',items});if(!r||r.canceled){status('PLAYLIST • השמירה בוטלה');return false}const key='afdSavedPlaylists212',reg=JSON.parse(localStorage.getItem(key)||'{}')||{};reg[r.name]={name:r.name,path:r.filePath,items:r.items||items,savedAt:Date.now()};localStorage.setItem(key,JSON.stringify(reg));window.__afd212?.renderPlaylist?.(true);status('PLAYLIST SAVED • '+r.name+' • '+items.length+' שירים');return true}catch(e){status('PLAYLIST SAVE ERROR • '+(e?.message||e));return false}}
function decorateOnline(){
 document.querySelectorAll('#afdYTInlineResults .afdYTListRow[data-i]').forEach(r=>{r.draggable=true;r.style.cursor='grab';if(!r.querySelector('[data-side215]')){const b=document.createElement('button');b.dataset.side215='youtube';b.textContent='＋SIDE';b.title='הוסף ל-Side View';r.appendChild(b)}});
 document.querySelectorAll('#afdSP196 [data-i]').forEach(r=>{r.draggable=true;r.style.cursor='grab';if(!r.querySelector('[data-side215]')){const b=document.createElement('button');b.dataset.side215='spotify';b.textContent='＋SIDE';(r.querySelector('.sp196acts')||r).appendChild(b)}})
}
function bindOnline(){if(document.documentElement.dataset.afd215online)return;document.documentElement.dataset.afd215online='1';document.addEventListener('click',e=>{
 const yr=e.target?.closest?.('#afdYTInlineResults .afdYTListRow[data-i]'),sr=e.target?.closest?.('#afdSP196 [data-i]');if(!yr&&!sr)return;const kind=yr?'youtube':'spotify',row=yr||sr,item=onlineItem(row,kind);if(!item)return;
 const side=e.target?.closest?.('[data-side215]');if(side){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();addSide(item);status(kind.toUpperCase()+' • נוסף ל-SIDE VIEW');return}
 const b=e.target?.closest?.('[data-d]');if(b&&['A','B'].includes(b.dataset.d)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();replaceDeck(b.dataset.d,item,kind)}
 },true);
 document.addEventListener('dragstart',e=>{const yr=e.target?.closest?.('#afdYTInlineResults .afdYTListRow[data-i]'),sr=e.target?.closest?.('#afdSP196 [data-i]');if(!yr&&!sr)return;const kind=yr?'youtube':'spotify';dragOnline=onlineItem(yr||sr,kind);if(!dragOnline)return;try{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-afd215-online',kind);e.dataTransfer.setData('text/plain',dragOnline.name)}catch(x){}},true);
 document.addEventListener('dragend',()=>setTimeout(()=>{dragOnline=null},100),true)
}
function bindDrop(){const w=W();if(!w||!w.document||w.document.documentElement.dataset.afd215drop)return;w.document.documentElement.dataset.afd215drop='1';w.addEventListener('dragover',e=>{if(dragOnline&&e.target?.closest?.('.deckA,.deckB,#afd212side')){e.preventDefault();try{e.dataTransfer.dropEffect='copy'}catch(x){}}},true);w.addEventListener('drop',e=>{if(!dragOnline)return;const deck=e.target?.closest?.('.deckA,.deckB'),side=e.target?.closest?.('#afd212side');if(!deck&&!side)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const x=dragOnline;dragOnline=null;if(deck)replaceDeck(deck.classList.contains('deckA')?'A':'B',x);else{addSide(x);status('ONLINE • נוסף ל-SIDE VIEW')}},true)}
function bindSources(){if(document.documentElement.dataset.afd215sources)return;document.documentElement.dataset.afd215sources='1';window.addEventListener('afd-spotify-load',e=>{const k=e.detail?.deck;if(['A','B'].includes(k)){slots[k]={type:'spotify',item:e.detail?.item||slots[k]?.item||null}}},true);window.addEventListener('afd-youtube-load',e=>{const k=e.detail?.deck;if(['A','B'].includes(k)){slots[k]={type:'youtube',item:{id:e.detail?.videoId||'',title:e.detail?.title||'YouTube'}}}},true);window.addEventListener('afd-local-load',e=>{const k=e.detail?.deck;if(['A','B'].includes(k)){slots[k]={type:'local',item:e.detail?.item||window.AFDLocalDeckMeta?.[k]||null}}},true)}
function css(){const d=D();if(!d?.head)return;let s=d.getElementById('afd215css');if(!s){s=d.createElement('style');s.id='afd215css';d.head.appendChild(s)}s.textContent=`#afdYTInlineResults [data-side215],#afdSP196 [data-side215]{min-width:54px!important;height:28px!important;font-size:8px!important;font-weight:900!important;border-radius:5px!important}.deck .transport{gap:8px!important;align-items:start!important;min-height:62px!important}.deck .transport button{height:54px!important;min-height:54px!important;font-size:12px!important;border-radius:7px!important;padding:0 8px!important}.deck .transport .sync,.deck .transport [data-act="sync"]{height:50px!important;min-height:50px!important;margin-top:6px!important;font-size:11px!important}`}
function refresh(){window.__afd215Active=true;bindSources();bindOnline();decorateOnline();bindTransport();bindDrop();css();for(const k of ['A','B']){const a=actualOwner(k);if(a&&(!slots[k]||slots[k].type!==a))slots[k]={type:a,item:slots[k]?.item||null}}}
const api={refresh,loadDeck,loadLocal,loadSpotify,loadYouTube,startDeck,toggleDeck,cueDeck,addSide,saveSide,getOwner:ownerOf,getSlot:k=>slots[k]};
window.__afdUnified215=api;window.__afdUnified214=api;window.__afdUnified213=api;window.__afdUnified212=api;window.__afdUnified211=api;window.__afd215=api;
F()?.addEventListener('load',()=>setTimeout(()=>{boundWindow=null;refresh()},700));refresh();setInterval(refresh,1000);
})();
