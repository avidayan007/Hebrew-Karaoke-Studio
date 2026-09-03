(()=>{
if(window.__afd220){window.__afd220.refresh();return}
window.__afd220Active=true;
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let patchedApi=null,boundDoc=null;
const seeking={A:{on:false,v:0},B:{on:false,v:0}};
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 220]',t)}
function owner(k){try{return window.__afd215?.getOwner?.(k)||window.__afdUnified215?.getOwner?.(k)||''}catch(e){return''}}
async function reliableYouTubeStart(k){
 const y=window.AFDYouTubeState;
 if(!y){status('YOUTUBE PLAY ERROR • מנוע YouTube לא זמין');return false}
 if(y.isPlaying?.(k))return true;
 const end=performance.now()+10500;let attempt=0,lastErr='';
 while(performance.now()<end){
  attempt++;
  try{if(typeof y.play==='function')await Promise.resolve(y.play(k));else window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'play'}}))}catch(e){lastErr=String(e?.message||e||'')}
  const until=performance.now()+720;
  while(performance.now()<until){if(y.isPlaying?.(k)){status('YOUTUBE PLAY • DECK '+k+' • התחיל');return true}const t=y.getTime?.(k)||{};if(t.blocked){status('YOUTUBE • הסרטון חסום לניגון בתוך האפליקציה');return false}await sleep(80)}
  await sleep(Math.min(480,120+attempt*35));
 }
 status('YOUTUBE PLAY ERROR • הסרטון נטען אבל לא התחיל'+(lastErr?' • '+lastErr:''));return false
}
function patchStartDeck(){
 const api=window.__afd215||window.__afdUnified215;if(!api||api===patchedApi||typeof api.startDeck!=='function')return;
 const old=api.startDeck.bind(api);api.startDeck=async k=>owner(k)==='youtube'?reliableYouTubeStart(k):old(k);patchedApi=api;
 status('AFD 1.5.20 • YouTube Mix Play ready')
}
function installSpotifySeek(){
 const s=window.AFDSpotifyState;if(!s||typeof s.seekSeconds==='function')return;
 s.seekSeconds=(k,sec)=>{
  const d=D(),r=d?.getElementById('seek'+k),t=s.getTime?.(k)||{},dur=Number(t.duration)||0;
  if(!r||dur<=0)return false;
  const value=clamp((Number(sec)||0)/dur*1000,0,1000);r.value=String(value);
  r.dispatchEvent(new Event('change',{bubbles:true,cancelable:true}));return true
 }
}
function seekOnline(k,v){
 const own=owner(k);v=clamp(Number(v)||0,0,1000);
 if(own==='spotify'){
  const s=window.AFDSpotifyState,t=s?.getTime?.(k)||{},dur=Number(t.duration)||0;if(!dur)return false;
  return s.seekSeconds?.(k,dur*v/1000)!==false
 }
 if(own==='youtube'){
  const y=window.AFDYouTubeState,t=y?.getTime?.(k)||{},dur=Number(t.duration)||0;if(!dur)return false;
  try{return y.seek?.(k,dur*v/1000)!==false}catch(e){return false}
 }
 return false
}
function bindSeek(){
 const d=D();if(!d||boundDoc===d)return;boundDoc=d;
 const rangeFor=e=>e.target?.closest?.('.afdClockRange212');
 const deckFor=r=>r?.closest?.('.afdClock212')?.dataset.deck||r?.parentElement?.dataset.deck||'';
 d.addEventListener('pointerdown',e=>{const r=rangeFor(e),k=deckFor(r);if(!r||!seeking[k])return;seeking[k].on=true;seeking[k].v=Number(r.value)||0},true);
 d.addEventListener('input',e=>{const r=rangeFor(e),k=deckFor(r);if(!r||!seeking[k])return;seeking[k].on=true;seeking[k].v=Number(r.value)||0;e.stopImmediatePropagation()},true);
 const finish=e=>{const r=rangeFor(e),k=deckFor(r);if(!r||!seeking[k])return;seeking[k].v=Number(r.value)||0;seekOnline(k,seeking[k].v);seeking[k].on=false;e.stopImmediatePropagation()};
 d.addEventListener('change',finish,true);d.addEventListener('pointerup',finish,true);
}
function holdSeekThumb(){const d=D();if(!d)return;for(const k of ['A','B'])if(seeking[k].on){const r=d.querySelector('#afdClock212'+k+' .afdClockRange212');if(r)r.value=String(seeking[k].v)}}
function refresh(){window.__afd220Active=true;patchStartDeck();installSpotifySeek();bindSeek();holdSeekThumb()}
window.__afd220={refresh,reliableYouTubeStart,seekOnline};F()?.addEventListener('load',()=>setTimeout(()=>{boundDoc=null;refresh()},700));refresh();setInterval(refresh,220);})();
