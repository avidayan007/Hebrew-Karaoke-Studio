(()=>{
if(window.__afd223){window.__afd223.refresh();return}
window.__afd223Active=true;
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let busy=false;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 223]',t)}
function ytLoaded(k){const d=D();try{return!!window.AFDYouTubeState?.isLoaded?.(k)||!!d?.getElementById('ytDeck'+k)||!!d?.querySelector?.('#ytMaster'+k+' iframe')}catch(e){return false}}
function ytPlaying(k){try{return!!window.AFDYouTubeState?.isPlaying?.(k)}catch(e){return false}}
function deckTitle(k){return String(D()?.getElementById('title'+k)?.textContent||'').trim()}
function itemTitle(x){return String(x?.name||x?.afdYouTubeItem?.title||x?.youtubeItem?.title||x?.afdHistoryItem?.title||'YouTube').trim()}
function sameTitle(a,b){const n=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();const x=n(a),y=n(b);return!!x&&!!y&&(x===y||x.includes(y)||y.includes(x))}
async function findLoadedDeck(title,before){
 const end=performance.now()+12500;
 while(performance.now()<end){
  for(const k of ['A','B']){
   if(!ytLoaded(k))continue;
   const changed=!before[k].loaded||deckTitle(k)!==before[k].title;
   if(changed||sameTitle(deckTitle(k),title))return k
  }
  await sleep(55)
 }
 return''
}
async function kickYouTube(k){
 const direct=window.__afd222;
 if(direct?.reliableYouTubeStart){const ok=await direct.reliableYouTubeStart(k);if(ok)return true}
 const y=window.AFDYouTubeState;
 const end=performance.now()+8000;
 while(performance.now()<end){
  try{if(y?.isPlaying?.(k))return true;if(direct?.directPlay)direct.directPlay(k);else y?.play?.(k)}catch(e){}
  await sleep(180)
 }
 return ytPlaying(k)
}
async function playSideYouTube(i,x){
 if(busy){status('YOUTUBE • המיקס הקודם עדיין בתהליך');return false}
 const core=window.__afdCore206;if(!core?.playIndex){status('YOUTUBE MIX ERROR • מנוע Side View לא זמין');return false}
 busy=true;
 try{
  const title=itemTitle(x),before={A:{loaded:ytLoaded('A'),title:deckTitle('A')},B:{loaded:ytLoaded('B'),title:deckTitle('B')}};
  status('SIDE VIEW • YOUTUBE • טוען ומפעיל '+title+'…');
  const oldFlow=Promise.resolve(core.playIndex(i,{mix:true})).catch(e=>{console.error('[AFD 223] playIndex',e);return false});
  const deck=await findLoadedDeck(title,before);
  if(!deck){status('YOUTUBE MIX ERROR • השיר לא הגיע לדק');await oldFlow;return false}
  status('SIDE VIEW • YOUTUBE • DECK '+deck+' READY • מפעיל PLAY…');
  const started=await kickYouTube(deck);
  if(!started){status('YOUTUBE MIX ERROR • השיר נטען אבל PLAY לא התחיל');await oldFlow;return false}
  status('SIDE VIEW • YOUTUBE • PLAY התחיל ב-DECK '+deck+' • ממשיך MIX…');
  const ok=await oldFlow;
  if(ok!==false)status('SIDE VIEW • YOUTUBE • AUTO PLAY / MIX OK • DECK '+deck);
  return ok!==false
 }finally{busy=false}
}
function refresh(){window.__afd223Active=true;window.__afd223Ready=!!window.__afdCore206&&!!window.__afd222}
window.__afd223={refresh,playSideYouTube,kickYouTube,findLoadedDeck};
F()?.addEventListener('load',()=>setTimeout(refresh,600));refresh();setInterval(refresh,500);
})();
