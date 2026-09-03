(()=>{
if(window.__afd212){window.__afd212.refresh();return}
window.__afd212Active=true;
window.__afd211Active=true;
const VERSION='__AFD_VERSION__';
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return F()?.contentWindow||null}catch(e){return null}};
const C=()=>window.__afdCore206;
const $=id=>document.getElementById(id);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const P='afdSavedPlaylists212';

let bw=null,playlist='',plSig='',sideSig='',dragItem=null,dragQ=-1;
let internal={A:false,B:false},owner={A:'',B:''},chain={A:Promise.resolve(),B:Promise.resolve()};
let lastClock={A:'',B:''};

const store=()=>{try{return JSON.parse(localStorage.getItem(P)||'{}')||{}}catch(e){return{}}};
const put=x=>{try{localStorage.setItem(P,JSON.stringify(x))}catch(e){}};
const q=()=>Array.isArray(C()?.queue)?C().queue:[];
const name=x=>String(x?.name||x?.afdHistoryItem?.name||x?.afdSpotifyItem?.name||x?.afdYouTubeItem?.title||'Track');
const status=t=>{const e=$('status');if(e)e.textContent=t;console.log('[AFD 212]',t)};
const fmt=n=>{n=Math.max(0,Math.floor(Number(n)||0));const h=Math.floor(n/3600),m=Math.floor((n%3600)/60),s=n%60;return(h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')};

function migrate(){
  if(localStorage.getItem('afdP212Migrated'))return;
  const n=store();
  for(const oldKey of ['afdSavedPlaylists211','afdSavedPlaylists210']){
    try{
      const old=JSON.parse(localStorage.getItem(oldKey)||'{}')||{};
      for(const [k,v] of Object.entries(old))if(!n[k]&&v)n[k]=v;
    }catch(e){}
  }
  put(n);localStorage.setItem('afdP212Migrated','1');
}
function typeOf(x){
  if(!x)return'';
  if(x.afdHistorySource==='Spotify'||x.afdSpotifyItem||x.spotifyItem||x.__source==='spotify')return'spotify';
  if(x.afdHistorySource==='YouTube'||x.afdYouTubeItem||x.youtubeItem)return'youtube';
  return'local';
}
function payload(x,t=typeOf(x)){
  if(t==='spotify')return x.afdHistoryItem||x.afdSpotifyItem||x.spotifyItem||x;
  if(t==='youtube'){const i=x.afdHistoryItem||x.afdYouTubeItem||x.youtubeItem||x;return{id:i.id||i.videoId||'',title:i.title||x.name||'YouTube',channel:i.channel||'',thumb:i.thumb||''}}
  if(x.afdHistorySource==='Local')return{...(x.afdHistoryItem||{}),path:x.afdHistoryItem?.path||x.path||'',key:x.afdHistoryItem?.key||x.key||'',name:x.afdHistoryItem?.name||x.name||'Track',folder:x.afdHistoryItem?.folder||x.folder||'Playlist',kind:x.afdHistoryItem?.kind||x.kind||'music'};
  return x;
}
function localPath(x){let p=String(x?.path||'');if(p)return p;try{return String(window.afdDesktopMedia?.getPath?.(x?.key||'')||'')}catch(e){return''}}
function serialize(x){const t=typeOf(x),i=payload(x,t);if(t==='spotify')return{t:'sp',n:name(x),i};if(t==='youtube')return{t:'yt',n:name(x),i};return{t:'lo',n:name(x),p:localPath(i),k:String(i?.key||''),f:String(i?.folder||'Playlist'),d:String(i?.kind||'music')}}
function deserialize(x){if(x?.t==='sp')return{key:'p212:sp:'+(x.i?.id||x.i?.uri||Math.random()),name:x.n||x.i?.name||'Spotify',folder:'Spotify',kind:'music',afdSpotifyItem:x.i};if(x?.t==='yt')return{key:'p212:yt:'+(x.i?.id||Math.random()),name:x.n||x.i?.title||'YouTube',folder:'YouTube',kind:'video',afdYouTubeItem:{id:x.i?.id||x.i?.videoId||'',title:x.i?.title||x.n||'YouTube',channel:x.i?.channel||'',thumb:x.i?.thumb||''}};if(x?.t==='lo')return{key:x.k||'p212:'+x.p,path:x.p||'',name:x.n||'Track',folder:x.f||'Playlist',kind:x.d||'music'};return null}

function deckVideo(k){return D()?.getElementById('vid'+k)||null}
function deckMaster(k){return D()?.getElementById('master'+k)||null}
function clearLocal(k){
  const v=deckVideo(k),m=deckMaster(k);
  if(v){try{v.pause();v.removeAttribute('src');v.load()}catch(e){}v.style.display='none'}
  if(m){try{m.pause();m.removeAttribute('src');m.load()}catch(e){}m.style.display='none'}
  if(window.AFDLocalDeckMeta)window.AFDLocalDeckMeta[k]=null;
}
async function clearSpotify(k,wait=true){
  const s=window.AFDSpotifyState;
  if(!s){D()?.getElementById('afdSP105Deck'+k)?.remove();return}
  const present=!!(s.has?.(k)||D()?.getElementById('afdSP105Deck'+k));
  if(present){
    try{
      if(wait&&s.stopNow)await Promise.race([Promise.resolve(s.stopNow(k)),sleep(1400)]);
      else if(s.pauseNow)Promise.resolve(s.pauseNow(k)).catch(()=>{});
      else s.pause?.(k);
    }catch(e){}
    try{s.clear?.(k)}catch(e){}
  }
  D()?.getElementById('afdSP105Deck'+k)?.remove();
}
function clearYouTube(k){
  const s=window.AFDYouTubeState;
  try{s?.stop?.(k)}catch(e){}
  try{s?.clear?.(k)}catch(e){}
  const d=D();d?.getElementById('ytDeck'+k)?.remove();
  const m=d?.getElementById('ytMaster'+k);if(m)m.style.display='none';
}
function resetNativeClock(k){
  const d=D();if(!d)return;
  const a=d.getElementById('time'+k),b=d.getElementById('remain'+k),r=d.getElementById('seek'+k);
  if(a)a.textContent='00:00';if(b)b.textContent='-00:00';if(r)r.value='0';
}
async function clearOthers(k,keep){
  if(keep!=='spotify')await clearSpotify(k,true);
  if(keep!=='youtube')clearYouTube(k);
  if(keep!=='local')clearLocal(k);
  resetNativeClock(k);
}
function waitFor(fn,ms=9000){return new Promise(async resolve=>{const end=performance.now()+ms;while(performance.now()<end){try{if(fn())return resolve(true)}catch(e){}await sleep(60)}let ok=false;try{ok=!!fn()}catch(e){}resolve(ok)})}

async function doSpotify(k,raw){
  const i=payload(raw,'spotify');if(!i?.id&&!i?.uri)return false;
  owner[k]='loading';
  await clearOthers(k,'spotify');
  internal[k]=true;
  try{window.dispatchEvent(new CustomEvent('afd-spotify-load',{detail:{deck:k,item:i,afd212:true}}))}
  finally{internal[k]=false}
  const ok=await waitFor(()=>window.AFDSpotifyState?.has?.(k),5000);
  if(ok){owner[k]='spotify';showClock(k,true);status('SPOTIFY • '+(i.name||'Track')+' → DECK '+k)}
  else{owner[k]='';showClock(k,false);status('SPOTIFY ERROR • השיר לא נטען ל-DECK '+k)}
  return ok;
}
async function doYouTube(k,raw){
  const i=payload(raw,'youtube');if(!i?.id)return false;
  owner[k]='loading';
  await clearOthers(k,'youtube');
  internal[k]=true;let ok=false;
  try{ok=(await window.AFDYouTubeState?.load?.(k,i))!==false}
  catch(e){status('YOUTUBE ERROR • '+(e?.message||e))}
  finally{internal[k]=false}
  if(ok&&await waitFor(()=>window.AFDYouTubeState?.isLoaded?.(k)||!!D()?.getElementById('ytDeck'+k),6000)){
    owner[k]='youtube';showClock(k,true);status('YOUTUBE • '+(i.title||'Track')+' → DECK '+k);return true
  }
  owner[k]='';showClock(k,false);return false;
}
async function doLocal(k,raw){
  const i=payload(raw,'local');
  owner[k]='loading';
  await clearOthers(k,'local');
  internal[k]=true;let ok=false;
  try{
    if(typeof window.AFDWindowsLoadItem==='function')ok=!!(await window.AFDWindowsLoadItem(k,i));
    if(!ok&&i?.file&&typeof W()?.load==='function'){W().load(k,i.file);ok=await waitFor(()=>!!(deckVideo(k)?.currentSrc||deckVideo(k)?.src),3000)}
  }catch(e){status('LOCAL ERROR • '+(e?.message||e))}
  finally{internal[k]=false}
  if(ok){
    await clearSpotify(k,false);clearYouTube(k);
    owner[k]='local';showClock(k,false);status('LOCAL • '+name(i)+' → DECK '+k)
  }else owner[k]='';
  return ok;
}
function serialLoad(k,fn){if(!['A','B'].includes(k))return Promise.resolve(false);chain[k]=chain[k].catch(()=>{}).then(fn);return chain[k]}
function loadDeck(k,x){const t=typeOf(x);return serialLoad(k,()=>t==='spotify'?doSpotify(k,x):t==='youtube'?doYouTube(k,x):doLocal(k,x))}
function loadLocal(k,x){return serialLoad(k,()=>doLocal(k,x))}
function loadSpotify(k,x){return serialLoad(k,()=>doSpotify(k,x))}
function loadYouTube(k,x){return serialLoad(k,()=>doYouTube(k,x))}

function inferOwner(k){
  if(window.AFDSpotifyState?.has?.(k))return'spotify';
  if(window.AFDYouTubeState?.isLoaded?.(k)||D()?.getElementById('ytDeck'+k))return'youtube';
  const v=deckVideo(k);
  if(window.AFDLocalDeckMeta?.[k]||(v&&(v.currentSrc||v.src)))return'local';
  return'';
}
async function externalOwner(k,t){
  if(internal[k])return;
  owner[k]=t;
  if(t==='local'){await clearSpotify(k,false);clearYouTube(k);showClock(k,false)}
  else if(t==='spotify'){clearYouTube(k);clearLocal(k);showClock(k,true)}
  else if(t==='youtube'){await clearSpotify(k,false);clearLocal(k);showClock(k,true)}
}
function bindSourceEvents(){
  if(document.documentElement.dataset.afd212sources)return;
  document.documentElement.dataset.afd212sources='1';
  window.addEventListener('afd-spotify-load',e=>{const k=e.detail?.deck;if(k&&!internal[k])externalOwner(k,'spotify')},true);
  window.addEventListener('afd-youtube-load',e=>{const k=e.detail?.deck;if(k&&!internal[k])externalOwner(k,'youtube')},true);
  window.addEventListener('afd-local-load',e=>{const k=e.detail?.deck;if(k&&!internal[k])externalOwner(k,'local')},true);
}

function clockHost(k){
  const d=D(),base=d?.getElementById('time'+k)?.closest('.time');if(!base)return null;
  base.style.position='relative';
  let h=d.getElementById('afdClock212'+k);
  if(!h){
    h=d.createElement('div');h.id='afdClock212'+k;h.className='afdClock212';h.dataset.deck=k;
    h.innerHTML='<div><b data-cur>00:00</b><small>ELAPSED</small></div><div><b data-rem>-00:00</b><small>REMAIN</small></div><input class="afdClockRange212" type="range" min="0" max="1000" value="0">';
    base.appendChild(h);
    const r=h.querySelector('input');
    r.addEventListener('change',e=>seekOnline(k,Number(e.target.value)||0),true);
  }
  return h;
}
function showClock(k,on){const h=clockHost(k);if(h)h.style.display=on?'grid':'none';if(!on)lastClock[k]=''}
function onlineTime(k){
  if(owner[k]==='spotify'){const t=window.AFDSpotifyState?.getTime?.(k)||{};return{cur:+t.current||0,dur:+t.duration||0}}
  if(owner[k]==='youtube'){const t=window.AFDYouTubeState?.getTime?.(k)||{};return{cur:+t.current||0,dur:+t.duration||0}}
  return null;
}
function paintClock(k){
  const t=onlineTime(k),h=clockHost(k);if(!h)return;
  if(!t){h.style.display='none';lastClock[k]='';return}
  h.style.display='grid';
  const sig=Math.floor(t.cur*4)+'|'+Math.floor(t.dur);
  if(sig===lastClock[k])return;lastClock[k]=sig;
  const a=h.querySelector('[data-cur]'),b=h.querySelector('[data-rem]'),r=h.querySelector('input');
  if(a)a.textContent=fmt(t.cur);if(b)b.textContent='-'+fmt(Math.max(0,t.dur-t.cur));if(r&&t.dur>0)r.value=String(Math.max(0,Math.min(1000,t.cur/t.dur*1000)));
}
function seekOnline(k,v){
  const t=onlineTime(k);if(!t||!t.dur)return;const sec=t.dur*Math.max(0,Math.min(1000,v))/1000;
  if(owner[k]==='spotify')try{window.AFDSpotifyState?.seekSeconds?.(k,sec)}catch(e){}
  if(owner[k]==='youtube')try{window.AFDYouTubeState?.seek?.(k,sec)}catch(e){}
}

async function localPlay(k){
  await clearSpotify(k,true);clearYouTube(k);owner[k]='local';showClock(k,false);
  const v=deckVideo(k);if(!v||(!v.currentSrc&&!v.src)){status('DECK '+k+' • אין שיר Local טעון');return false}
  const m=deckMaster(k);
  try{
    if(v.paused||v.ended){if(v.ended)v.currentTime=0;await v.play();if(m&&(m.currentSrc||m.src)&&m.style.display!=='none'){try{m.currentTime=v.currentTime;await m.play()}catch(e){}}}
    else{v.pause();try{m?.pause()}catch(e){}}
    return true;
  }catch(e){status('LOCAL PLAY ERROR • '+(e?.message||e));return false}
}
async function transport(k,act){
  let own=owner[k];if(!own||own==='loading'){own=inferOwner(k);if(own)owner[k]=own}
  if(!own)return false;
  if(own==='local'){
    if(act==='play')return localPlay(k);
    if(act==='cue'||act==='stop'){await clearSpotify(k,false);clearYouTube(k);const v=deckVideo(k),m=deckMaster(k);try{v?.pause();m?.pause();if(v)v.currentTime=0;if(m&&(m.currentSrc||m.src))m.currentTime=0}catch(e){}return true}
    return false;
  }
  if(own==='spotify'){
    if(act==='play'){try{window.AFDSpotifyState?.play?.(k);return true}catch(e){return false}}
    if(act==='cue'||act==='stop'){try{if(window.AFDSpotifyState?.stopNow)await window.AFDSpotifyState.stopNow(k);else window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'stop',afd212:true}}));return true}catch(e){return false}}
    return false;
  }
  if(own==='youtube'){
    if(act==='play'){try{return window.AFDYouTubeState?.play?.(k)!==false}catch(e){return false}}
    if(act==='cue'||act==='stop'){try{return window.AFDYouTubeState?.stop?.(k)!==false}catch(e){return false}}
  }
  return false;
}
function deckAct(t){
  const b=t?.closest?.('[data-act]');if(!b)return null;
  const k=b.dataset.d||(b.closest('.deckA')?'A':b.closest('.deckB')?'B':'');
  if(!['A','B'].includes(k))return null;
  return{k,act:b.dataset.act||''};
}
function bindTransport(){
  const w=W();if(!w||w.document.documentElement.dataset.afd212transport)return;
  w.document.documentElement.dataset.afd212transport='1';
  w.addEventListener('pointerdown',e=>{const x=deckAct(e.target);if(!x||!['play','cue'].includes(x.act))return;const own=owner[x.k]||inferOwner(x.k);if(!own)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()},true);
  w.addEventListener('click',e=>{const x=deckAct(e.target);if(!x||!['play','cue'].includes(x.act))return;const own=owner[x.k]||inferOwner(x.k);if(!own)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();transport(x.k,x.act)},true);
}

async function saveSide(){
  const a=q().map(serialize).filter(x=>x.t!=='lo'||x.p);if(!a.length){status('PLAYLIST • SIDE VIEW ריק');return}
  const bridge=window.afdDesktopMedia;if(!bridge?.savePlaylist){status('PLAYLIST SAVE ERROR • Windows Save לא זמין');return}
  try{
    const r=await bridge.savePlaylist({defaultName:'AFD Playlist',items:a,tracks:a.filter(x=>x.t==='lo').map(x=>({path:x.p,name:x.n,folder:x.f,kind:x.d}))});
    if(!r||r.canceled)return;
    const reg=store(),n=String(r.name||'AFD Playlist');reg[n]={name:n,path:String(r.filePath||''),items:Array.isArray(r.items)?r.items:a,savedAt:Date.now()};put(reg);
    playlist='';plSig='';renderPlaylist(true);status('PLAYLIST SAVED • '+n+' • '+a.length+' שירים')
  }catch(e){status('PLAYLIST SAVE ERROR • '+(e?.message||e))}
}
async function playlistItems(n){
  const e=store()[n];if(!e)return[];
  let a=Array.isArray(e.items)?e.items:[];
  if(e.path&&window.afdDesktopMedia?.readPlaylist)try{const r=await window.afdDesktopMedia.readPlaylist(e.path);if(r?.items?.length)a=r.items}catch(x){}
  return a.map(deserialize).filter(Boolean);
}
function activePlaylist(){return!!D()?.querySelector('#afdFolders170 [data-cat="playlist"].active')}
function phost(){
  const d=D(),tracks=d?.querySelector('.browser .tracks');if(!tracks)return null;tracks.style.position='relative';
  let h=d.getElementById('afd212playlist');if(!h){h=d.createElement('div');h.id='afd212playlist';tracks.appendChild(h)}return h;
}
async function renderPlaylist(force=false){
  const d=D(),h=phost();if(!d||!h)return;const on=activePlaylist();h.style.display=on?'block':'none';if(!on)return;
  const reg=store(),sig=playlist+'|'+Object.keys(reg).sort().map(k=>k+':'+(reg[k]?.savedAt||0)).join('|');if(!force&&sig===plSig)return;plSig=sig;
  if(!playlist){
    const names=Object.keys(reg).sort((a,b)=>a.localeCompare(b));h.__items=[];
    h.innerHTML=names.length?'<div class="p212hint">PLAYLISTS • רק מה ששמרת עם SAVE</div>'+names.map(n=>'<div class="p212folder" data-pl="'+esc(n)+'"><b>♫ '+esc(n)+'</b><small>'+((reg[n]?.items?.length)||0)+' שירים</small><button>פתח</button></div>').join(''):'<div class="p212empty">אין פלייליסטים שמורים</div>';return
  }
  h.innerHTML='<div class="p212head"><button data-back>◀ פלייליסטים</button><b>'+esc(playlist)+'</b><button data-all>＋ הכל ל-SIDE</button></div><div class="p212empty">טוען…</div>';
  const a=await playlistItems(playlist);h.__items=a;
  h.innerHTML='<div class="p212head"><button data-back>◀ פלייליסטים</button><b>'+esc(playlist)+'</b><button data-all>＋ הכל ל-SIDE</button></div>'+(a.length?a.map((x,i)=>'<div class="p212row" draggable="true" data-i="'+i+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+esc(name(x))+'</b><small>'+esc(x.folder||'Playlist')+'</small><button data-d="A">A</button><button data-d="B">B</button><button data-side>＋SIDE</button></div>').join(''):'<div class="p212empty">הפלייליסט ריק</div>');
}
function shost(){
  const d=D(),s=d?.querySelector('.browser .sideview');if(!s)return null;s.style.position='relative';
  let h=d.getElementById('afd212side');if(!h){h=d.createElement('div');h.id='afd212side';s.appendChild(h)}return h;
}
function renderSide(force=false){
  const h=shost();if(!h)return;const a=q(),sig=a.map((x,i)=>x?._q206||x?.key||i).join('|')+'|'+(C()?.activeIndex??-1)+'|'+!!C()?.autoRunning;
  if(!force&&sig===sideSig)return;sideSig=sig;const active=C()?.activeIndex??-1;
  h.innerHTML='<div class="s212top"><b>SIDE VIEW</b><span>'+(C()?.autoRunning?'AUTO ON':'AUTO OFF')+'</span></div><div class="s212ctl"><button data-a="auto">▶ START AUTO</button><button data-a="next">NEXT / MIX</button><button data-a="stop">■ STOP AUTO</button><button data-a="save">💾 SAVE</button><button data-a="clear">CLEAR</button></div><div class="s212q">'+(a.length?a.map((x,i)=>'<div class="s212row '+(i===active?'playing':'')+'" draggable="true" data-i="'+i+'"><span>☰</span><b title="דאבל-קליק = MIX עכשיו">'+esc(name(x))+'</b><small>'+esc(typeOf(x).toUpperCase())+'</small><button data-up>▲</button><button data-down>▼</button><button data-rm>×</button></div>').join(''):'<div class="s212empty">Local / Spotify / YouTube • גרור או לחץ +SIDE</div>')+'</div>';
}
function freeDeck(){
  const playing=k=>{const v=deckVideo(k);return!!((v&&(v.currentSrc||v.src)&&!v.paused&&!v.ended)||window.AFDSpotifyState?.isPlaying?.(k)||window.AFDYouTubeState?.isPlaying?.(k))};
  const a=playing('A'),b=playing('B');if(a&&!b)return'B';if(b&&!a)return'A';if(!a&&!b)return'A';return Number(D()?.getElementById('cross')?.value??50)>=50?'B':'A';
}
function addSide(x){if(!x)return;C()?.addQueue?.(x);sideSig='';renderSide(true)}
function spQueueItem(i){if(!i)return null;return{key:'sp212:'+(i.id||i.uri||Date.now()),name:i.name||'Spotify',folder:'Spotify',kind:'music',afdSpotifyItem:i}}
function ytQueueItem(i){if(!i)return null;return{key:'yt212:'+(i.id||Date.now()),name:i.title||'YouTube',folder:'YouTube',kind:'video',afdYouTubeItem:{id:i.id||i.videoId||'',title:i.title||'YouTube',channel:i.channel||'',thumb:i.thumb||''}}}

function decorateOnline(){
  const sp=$('afdSP196'),spi=window.__afdSpotify196?.getItems?.()||[];
  sp?.querySelectorAll('[data-sp-side]').forEach(b=>b.remove());
  sp?.querySelectorAll('[data-i]').forEach(r=>{
    const i=Number(r.dataset.i),it=spi[i];if(!it)return;
    r.draggable=true;
    if(!r.querySelector('[data-side212]')){const b=document.createElement('button');b.dataset.side212='sp';b.textContent='＋SIDE';(r.querySelector('.sp196acts')||r).appendChild(b)}
  });
  const yt=$('afdYTInlineResults'),yti=window.AFDYouTubeState?.getItems?.()||[];
  yt?.querySelectorAll('.afdYTListRow[data-i]').forEach(r=>{
    const i=Number(r.dataset.i),it=yti[i];if(!it)return;
    r.draggable=true;
    if(!r.querySelector('[data-side212]')){const b=document.createElement('button');b.dataset.side212='yt';b.textContent='＋SIDE';r.appendChild(b)}
  });
}
function bindOuter(){
  if(document.documentElement.dataset.afd212outer)return;document.documentElement.dataset.afd212outer='1';
  document.addEventListener('click',e=>{
    const spRow=e.target?.closest?.('#afdSP196 [data-i]'),ytRow=e.target?.closest?.('#afdYTInlineResults .afdYTListRow[data-i]');
    if(spRow){
      const it=(window.__afdSpotify196?.getItems?.()||[])[+spRow.dataset.i];if(!it)return;
      if(e.target.closest('[data-side212]')){e.preventDefault();e.stopImmediatePropagation();addSide(spQueueItem(it));return}
      const b=e.target.closest('[data-d]');if(b){e.preventDefault();e.stopImmediatePropagation();loadDeck(b.dataset.d,spQueueItem(it));return}
    }
    if(ytRow){
      const it=(window.AFDYouTubeState?.getItems?.()||[])[+ytRow.dataset.i];if(!it)return;
      if(e.target.closest('[data-side212]')){e.preventDefault();e.stopImmediatePropagation();addSide(ytQueueItem(it));return}
      const b=e.target.closest('[data-d]');if(b){e.preventDefault();e.stopImmediatePropagation();loadDeck(b.dataset.d,ytQueueItem(it));return}
    }
  },true);
  document.addEventListener('dragstart',e=>{
    const sr=e.target?.closest?.('#afdSP196 [data-i]');if(sr){dragItem=spQueueItem((window.__afdSpotify196?.getItems?.()||[])[+sr.dataset.i]);return}
    const yr=e.target?.closest?.('#afdYTInlineResults .afdYTListRow[data-i]');if(yr){dragItem=ytQueueItem((window.AFDYouTubeState?.getItems?.()||[])[+yr.dataset.i]);return}
  },true);
  document.addEventListener('dragend',()=>{if(dragQ<0)dragItem=null},true);
}

function bindInner(){
  const w=W(),d=D();if(!w||!d||bw===w)return;bw=w;
  bindTransport();
  w.addEventListener('click',e=>{
    const t=e.target,side=t?.closest?.('#afd212side');
    if(side){
      const a=t.closest?.('[data-a]');
      if(a){e.preventDefault();e.stopImmediatePropagation();const x=a.dataset.a;if(x==='auto')C()?.startAuto?.();else if(x==='next')C()?.startNext?.();else if(x==='stop')C()?.stopAuto?.();else if(x==='save')saveSide();else if(x==='clear')C()?.clearQueue?.();setTimeout(()=>renderSide(true),40);return}
      const r=t.closest?.('.s212row');
      if(r){const i=+r.dataset.i;if(t.closest?.('[data-up]'))C()?.moveQueue?.(i,Math.max(0,i-1));else if(t.closest?.('[data-down]'))C()?.moveQueue?.(i,Math.min(q().length-1,i+1));else if(t.closest?.('[data-rm]'))C()?.removeQueue?.(i);setTimeout(()=>renderSide(true),30);return}
    }
    const h=t?.closest?.('#afd212playlist');
    if(h){
      const f=t.closest?.('.p212folder');if(f){playlist=f.dataset.pl;plSig='';renderPlaylist(true);return}
      if(t.closest?.('[data-back]')){playlist='';plSig='';renderPlaylist(true);return}
      if(t.closest?.('[data-all]')){for(const x of h.__items||[])C()?.addQueue?.(x,false);renderSide(true);return}
      const r=t.closest?.('.p212row');if(r){const x=(h.__items||[])[+r.dataset.i],b=t.closest('[data-d]');if(b)loadDeck(b.dataset.d,x);else if(t.closest('[data-side]'))addSide(x);return}
    }
  },true);
  w.addEventListener('dblclick',e=>{
    const r=e.target?.closest?.('#afd212side .s212row');
    if(r&&!e.target.closest('button')){e.preventDefault();e.stopImmediatePropagation();C()?.playIndex?.(+r.dataset.i,{mix:true});return}
    const p=e.target?.closest?.('#afd212playlist .p212row');
    if(p&&!e.target.closest('button')){const h=d.getElementById('afd212playlist'),x=(h?.__items||[])[+p.dataset.i];if(x)loadDeck(freeDeck(),x)}
  },true);
  w.addEventListener('dragstart',e=>{
    const sr=e.target?.closest?.('#afd212side .s212row');if(sr){dragQ=+sr.dataset.i;dragItem=q()[dragQ];try{e.dataTransfer.setData('application/x-afd212-q',String(dragQ))}catch(x){}return}
    const pr=e.target?.closest?.('#afd212playlist .p212row');if(pr){dragItem=(d.getElementById('afd212playlist')?.__items||[])[+pr.dataset.i];return}
    const old=e.target?.closest?.('#afd208content .row208');if(old){dragItem=(d.getElementById('afd208content')?.__items||[])[+old.dataset.i];return}
    const lr=e.target?.closest?.('.afdLocalRow170');if(lr){dragItem=(window.__afdWin170?.items||[]).find(x=>String(x.key)===String(lr.dataset.key))||null}
  },true);
  w.addEventListener('dragover',e=>{if(dragItem&&e.target?.closest?.('#afd212side,.deckA,.deckB'))e.preventDefault()},true);
  w.addEventListener('drop',e=>{
    if(!dragItem)return;const deck=e.target?.closest?.('.deckA,.deckB'),side=e.target?.closest?.('#afd212side');if(!deck&&!side)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(deck)loadDeck(deck.classList.contains('deckA')?'A':'B',dragItem);
    else if(dragQ>=0){const row=e.target.closest?.('.s212row');C()?.moveQueue?.(dragQ,row?+row.dataset.i:Math.max(0,q().length-1))}
    else addSide(dragItem);
    dragItem=null;dragQ=-1;setTimeout(()=>renderSide(true),30)
  },true);
  w.addEventListener('dragend',()=>{dragItem=null;dragQ=-1},true);
  d.addEventListener('click',e=>{const b=e.target?.closest?.('#afdFolders170 [data-cat="playlist"]');if(b){playlist='';plSig='';setTimeout(()=>renderPlaylist(true),40)}},true);
}
function css(){
  const d=D();if(!d?.head)return;let s=d.getElementById('afd212css');if(!s){s=d.createElement('style');s.id='afd212css';d.head.appendChild(s)}
  s.textContent=`.sideview>#afd208side,.sideview>#afd211side{display:none!important}.sideview>#afdQueue170,.sideview>.afdSideTabs170,.sideview>.afdAutoCtl170,.sideview>h4{visibility:hidden!important;pointer-events:none!important}#afd212side{position:absolute;inset:0;z-index:600;background:#080b10;display:flex;flex-direction:column;gap:4px;padding:4px}.s212top{display:flex;justify-content:space-between;font-size:8px}.s212ctl{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px}.s212ctl button{height:25px!important;font-size:7px!important}.s212q{flex:1;min-height:0;overflow:auto;border:1px dashed #414b57}.s212row{display:grid;grid-template-columns:18px minmax(0,1fr) 50px 22px 22px 22px;gap:3px;align-items:center;padding:6px;border-bottom:1px solid #20262d;cursor:grab}.s212row.playing{background:#33234f}.s212row b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.s212row small{font-size:6px;color:#8fa0af}.s212row button{height:21px!important;padding:0!important;font-size:7px!important}.s212empty{padding:18px;text-align:center;color:#8793a0}#afd212playlist{position:absolute;inset:0;z-index:620;background:#070a0e;overflow:auto}.p212hint,.p212head{position:sticky;top:0;z-index:3;padding:8px;background:#171d25;border-bottom:1px solid #343c47}.p212head{display:grid;grid-template-columns:100px 1fr 120px;gap:5px;align-items:center}.p212head b{text-align:center}.p212folder{display:grid;grid-template-columns:1fr 110px 55px;gap:6px;align-items:center;padding:9px;border-bottom:1px solid #20262d}.p212row{display:grid;grid-template-columns:28px minmax(130px,1fr) 120px 32px 32px 52px;gap:4px;align-items:center;padding:6px;border-bottom:1px solid #20262d;cursor:grab}.p212row b,.p212folder b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.p212row small,.p212folder small{font-size:8px;color:#9aa6b2}.p212row button,.p212folder button,.p212head button{height:25px!important;font-size:7px!important}.p212empty{padding:22px;text-align:center;color:#8995a2}.time{position:relative!important}.afdClock212{position:absolute!important;inset:0!important;z-index:100!important;background:#080b10!important;display:none;grid-template-columns:1fr 1fr;gap:6px;direction:ltr;align-items:start}.afdClock212 b{font-size:15px;font-variant-numeric:tabular-nums}.afdClock212 small{display:block;font-size:6px;color:#8993a0}.afdClock212 input{grid-column:1/-1;width:100%;accent-color:#995cff}.sp196acts{grid-template-columns:1fr 1fr 1fr!important}.sp196row{grid-template-columns:54px minmax(0,1fr) 48px 48px 58px!important}#afdSP196 [data-side212],#afdYTInlineResults [data-side212]{height:28px!important;color:#fff;border:1px solid #59636e;border-radius:4px;background:#151b22;font-size:8px;padding:0 5px}`;
}
function refresh(){
  window.__afd212Active=true;window.__afd211Active=true;
  migrate();bindSourceEvents();bindOuter();bindInner();css();renderSide();renderPlaylist();decorateOnline();
  for(const k of ['A','B']){if(!owner[k]||owner[k]==='loading'){const x=inferOwner(k);if(x)owner[k]=x}showClock(k,owner[k]==='spotify'||owner[k]==='youtube')}
  try{window.__afdWin184?.refresh?.()}catch(e){}
}

const unified={loadDeck,loadLocal,loadSpotify,loadYouTube};
window.__afdUnified212=unified;
window.__afdUnified211=unified;
window.__afd212={refresh,saveSide,renderSide,renderPlaylist,loadDeck,getOwner:k=>owner[k]};
F()?.addEventListener('load',()=>setTimeout(()=>{bw=null;refresh()},650));
refresh();
setInterval(refresh,1100);
setInterval(()=>{paintClock('A');paintClock('B')},200);
})();
