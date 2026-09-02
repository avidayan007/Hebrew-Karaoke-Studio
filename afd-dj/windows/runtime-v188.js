(()=>{
if(window.__afdWin188){window.__afdWin188.refresh();return;}
const frame=()=>document.getElementById('console');
const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return frame()?.contentWindow||null}catch(e){return null}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let mixBusy=false,mixRaf=0;
const syncLock={A:null,B:null};
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD FINAL SYNC/MIX 188]',t)}
function media(k){return D()?.getElementById('vid'+k)||null}
function hasYT(k){return!!D()?.getElementById('ytDeck'+k)}
function hasSP(k){return!!D()?.getElementById('afdSP105Deck'+k)}
function hasSource(k){const v=media(k);return!!((v&&(v.currentSrc||v.src))||hasYT(k)||hasSP(k))}
function isPlaying(k){const v=media(k),native=!!(v&&(v.currentSrc||v.src)&&!v.paused&&!v.ended);return native||!!window.AFDYouTubeState?.isPlaying?.(k)||!!window.AFDSpotifyState?.isPlaying?.(k)}
function cross(){return D()?.getElementById('cross')||null}
function setCross(v,finish=false){const d=D(),c=d?.getElementById('cross'),vc=d?.getElementById('videoCross');v=clamp(Number(v)||0,0,100);if(c){c.value=String(v);c.dispatchEvent(new Event('input',{bubbles:true}));if(finish)c.dispatchEvent(new Event('change',{bubbles:true}))}if(vc&&vc!==c){vc.value=String(v);vc.dispatchEvent(new Event('input',{bubbles:true}));if(finish)vc.dispatchEvent(new Event('change',{bubbles:true}))}}
function shownBpm(k){const e=D()?.getElementById('bpm'+k),n=parseFloat(e?.textContent||'');return Number.isFinite(n)&&n>20?n:0}
function baseBpm(k){const e=D()?.getElementById('bpm'+k),v=media(k),rate=Number(v?.playbackRate)||1;let b=Number(e?.dataset?.afdBaseBpm||0);if(!(b>20)){const s=shownBpm(k);if(s>20)b=s/rate}return Number.isFinite(b)&&b>20?b:0}
function effectiveBpm(k){const lock=syncLock[k];if(lock?.effective>20)return lock.effective;const b=baseBpm(k),v=media(k);return b&&v?b*(Number(v.playbackRate)||1):b}
function paintLocked(k){const lock=syncLock[k],e=D()?.getElementById('bpm'+k),v=media(k);if(!lock||!e||!v)return;const live=lock.base*(Number(v.playbackRate)||1);lock.effective=live;e.dataset.afdBaseBpm=String(lock.base);e.dataset.afdSyncLocked='1';e.dataset.afdEffectiveBpm=String(live);e.textContent=live.toFixed(1)}
function clearLock(k){syncLock[k]=null;const e=D()?.getElementById('bpm'+k);if(e){delete e.dataset.afdSyncLocked}}
async function waitPlaying(k,ms=7000){const end=performance.now()+ms;while(performance.now()<end){if(isPlaying(k))return true;await sleep(75)}return isPlaying(k)}
async function startTarget(k){if(isPlaying(k))return true;const d=D(),v=media(k);if(!hasYT(k)&&!hasSP(k)&&v&&(v.currentSrc||v.src)){try{await v.play()}catch(e){}if(await waitPlaying(k,1600))return true}const b=d?.querySelector('.deck'+k+' [data-act="play"],.deck'+k+' .transport .play,.deck'+k+' .afdPlay175');if(!b)return false;try{b.click()}catch(e){}return waitPlaying(k,7000)}
function activeFrom(){const c=Number(cross()?.value??50),ap=isPlaying('A'),bp=isPlaying('B');if(ap&&!bp)return'A';if(bp&&!ap)return'B';return c>=50?'A':'B'}
function cancelMix(){mixBusy=false;if(mixRaf){try{W()?.cancelAnimationFrame(mixRaf)}catch(e){}mixRaf=0}D()?.getElementById('afdMixBtn')?.classList.remove('on')}
async function doMix(){
 if(mixBusy)return;const d=D(),w=W();if(!d||!w)return;const from=activeFrom(),to=from==='A'?'B':'A';if(!hasSource(to)){status('MIX • אין שיר ב-DECK '+to);return}
 mixBusy=true;const btn=d.getElementById('afdMixBtn');btn?.classList.add('on');const startPoint=from==='A'?100:0,target=to==='A'?100:0;
 setCross(startPoint,true);status('MIX • מפעיל DECK '+to+' בשקט...');
 const ok=await startTarget(to);if(!ok){mixBusy=false;btn?.classList.remove('on');setCross(startPoint,true);status('MIX • DECK '+to+' לא התחיל לנגן • המעבר בוטל');return}
 if(!isPlaying(from)&&hasSource(from)){const fv=media(from);try{await fv?.play?.()}catch(e){}}
 await sleep(260);if(!mixBusy)return;const t0=performance.now(),dur=4800;
 await new Promise(resolve=>{const tick=t=>{if(!mixBusy)return resolve();if(!isPlaying(to)){status('MIX • DECK '+to+' נעצר בזמן המעבר • מנסה להמשיך');startTarget(to).catch(()=>{})}const p=Math.min(1,(t-t0)/dur),q=p*p*(3-2*p),x=startPoint+(target-startPoint)*q;setCross(x,false);if(p<1)mixRaf=w.requestAnimationFrame(tick);else{mixRaf=0;setCross(target,true);resolve()}};mixRaf=w.requestAnimationFrame(tick)});
 if(!mixBusy)return;mixBusy=false;btn?.classList.remove('on');status('MIX • '+from+' → '+to+' הושלם • DECK '+from+' ממשיך לנגן בשקט')
}
async function doSync(k){
 const master=k==='A'?'B':'A',api=window.__afdWin184;if(!hasSource(k)||!hasSource(master)){status('SYNC • צריך שיר בשני הדקים');return}if(hasYT(k)||hasYT(master)||hasSP(k)||hasSP(master)){status('SYNC BEAT • זמין כרגע לקבצים מקומיים');return}if(!api?.syncDeck){status('SYNC • מנוע ניתוח הביט עדיין נטען');return}
 clearLock(k);status('SYNC • מנתח ומיישר DECK '+k+' ל-DECK '+master+'...');try{await api.syncDeck(k);const v=media(k),b=baseBpm(k),mEff=baseBpm(master)*(Number(media(master)?.playbackRate)||1);if(b>20&&v){const eff=b*(Number(v.playbackRate)||1);syncLock[k]={base:b,effective:eff,master,rate:Number(v.playbackRate)||1};paintLocked(k);const p=D()?.getElementById('pitch'+k);if(p){const pct=(Number(v.playbackRate)-1)*100;p.value=String(pct);p.dispatchEvent(new Event('input',{bubbles:true}))}status('SYNC • DECK '+k+' = '+eff.toFixed(1)+' BPM • DECK '+master+' = '+(mEff>20?mEff.toFixed(1):'—')+' BPM')}else status('SYNC • DECK '+k+' מיושר ל-DECK '+master)}catch(e){clearLock(k);status('SYNC ERROR • '+(e?.message||e))}
}
function ownSync(k){const d=D(),root=d?.querySelector('.deck'+k),old=root?.querySelector('.transport .sync,.transport [data-act="sync"],.afdSync148,.afdSync175');if(!old)return;if(old.dataset.afd188==='1')return;const b=old.cloneNode(true);b.dataset.afd188='1';b.dataset.afd186='1';b.dataset.afd184sync='1';b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();doSync(k)},true);old.replaceWith(b)}
function ownMix(){const d=D(),old=d?.getElementById('afdMixBtn');if(!old||old.dataset.afd188==='1')return;const b=old.cloneNode(true);b.dataset.afd188='1';b.dataset.afd186='1';b.dataset.afd184v2='1';b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();doMix()},true);old.replaceWith(b)}
function refresh(){ownSync('A');ownSync('B');ownMix();paintLocked('A');paintLocked('B')}
window.addEventListener('afd-local-load',e=>{const k=e.detail?.deck;if(k==='A'||k==='B')clearLock(k)});window.addEventListener('afd-deck-eject',e=>{const k=e.detail?.deck;if(k==='A'||k==='B')clearLock(k)});
window.__afdWin188={refresh,doMix,doSync,cancelMix,effectiveBpm,clearLock};
frame()?.addEventListener('load',()=>setTimeout(refresh,300));refresh();setTimeout(refresh,900);setInterval(refresh,220);
})();