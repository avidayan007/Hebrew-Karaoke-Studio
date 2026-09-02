(()=>{
if(window.__afdWin186){window.__afdWin186.refresh();return;}
const frame=()=>document.getElementById('console');
const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return frame()?.contentWindow||null}catch(e){return null}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let busy=false,raf=0;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD SYNC/MIX 186]',t)}
function media(k){return D()?.getElementById('vid'+k)||null}
function hasYT(k){return!!D()?.getElementById('ytDeck'+k)}
function hasSP(k){return!!D()?.getElementById('afdSP105Deck'+k)}
function hasSource(k){const v=media(k);return!!((v&&(v.currentSrc||v.src))||hasYT(k)||hasSP(k))}
function isPlaying(k){const v=media(k),native=!!(v&&(v.currentSrc||v.src)&&!v.paused&&!v.ended);return native||!!window.AFDYouTubeState?.isPlaying?.(k)||!!window.AFDSpotifyState?.isPlaying?.(k)}
function cross(){return D()?.getElementById('cross')||null}
function setCross(v,finish=false){const d=D(),c=d?.getElementById('cross'),vc=d?.getElementById('videoCross');v=clamp(Number(v)||0,0,100);if(c){c.value=String(v);c.dispatchEvent(new Event('input',{bubbles:true}));if(finish)c.dispatchEvent(new Event('change',{bubbles:true}))}if(vc&&vc!==c){vc.value=String(v);vc.dispatchEvent(new Event('input',{bubbles:true}));if(finish)vc.dispatchEvent(new Event('change',{bubbles:true}))}}
function baseBpm(k){const e=D()?.getElementById('bpm'+k);const b=Number(e?.dataset?.afdBaseBpm||0);return Number.isFinite(b)&&b>20?b:0}
function effectiveBpm(k){const b=baseBpm(k),v=media(k);return b&&v?b*(Number(v.playbackRate)||1):b}
function paintBpm(k){const d=D(),e=d?.getElementById('bpm'+k),b=baseBpm(k);if(!e||!b)return;const n=effectiveBpm(k);if(n>20)e.textContent=n.toFixed(1)}
function clearFakeBpm(k){const e=D()?.getElementById('bpm'+k);if(!e)return;if(!e.dataset.afdBaseBpm){const n=parseFloat(e.textContent);if(!Number.isFinite(n)||Math.abs(n-128)<.01)e.textContent='—'}}
function resetBpm(k){const e=D()?.getElementById('bpm'+k);if(!e)return;delete e.dataset.afdBaseBpm;e.textContent='—'}
async function waitPlaying(k,ms=6500){const end=performance.now()+ms;while(performance.now()<end){if(isPlaying(k))return true;await sleep(70)}return isPlaying(k)}
async function startTarget(k){if(isPlaying(k))return true;const d=D(),v=media(k);if(!hasYT(k)&&!hasSP(k)&&v&&(v.currentSrc||v.src)){try{await v.play()}catch(e){}if(await waitPlaying(k,1200))return true}const b=d?.querySelector('.deck'+k+' [data-act="play"],.deck'+k+' .transport .play');if(!b)return false;try{b.click()}catch(e){}return waitPlaying(k,6500)}
function activeFrom(){const c=Number(cross()?.value??50);const ap=isPlaying('A'),bp=isPlaying('B');if(ap&&!bp)return'A';if(bp&&!ap)return'B';return c>=50?'A':'B'}
function cancelMix(){busy=false;if(raf){try{W()?.cancelAnimationFrame(raf)}catch(e){}raf=0}D()?.getElementById('afdMixBtn')?.classList.remove('on')}
async function doMix(){
 if(busy)return;const d=D(),w=W();if(!d||!w)return;const from=activeFrom(),to=from==='A'?'B':'A';if(!hasSource(to)){status('MIX • אין שיר ב-DECK '+to);return}
 busy=true;const btn=d.getElementById('afdMixBtn');btn?.classList.add('on');
 const startPoint=from==='A'?100:0,target=to==='A'?100:0;setCross(startPoint,true);status('MIX • מפעיל DECK '+to+' בשקט לפני ה-FADE...');
 const ok=await startTarget(to);if(!ok){busy=false;btn?.classList.remove('on');setCross(startPoint,true);status('MIX • DECK '+to+' לא התחיל לנגן • המעבר בוטל');return}
 await sleep(160);if(!busy)return;const t0=performance.now(),dur=4000;
 await new Promise(resolve=>{const tick=t=>{if(!busy)return resolve();const p=Math.min(1,(t-t0)/dur),q=p*p*(3-2*p),x=startPoint+(target-startPoint)*q;setCross(x,false);if(p<1)raf=w.requestAnimationFrame(tick);else{raf=0;setCross(target,true);resolve()}};raf=w.requestAnimationFrame(tick)});
 if(!busy)return;busy=false;btn?.classList.remove('on');status('MIX • '+from+' → '+to+' הושלם • DECK '+from+' ממשיך לנגן בשקט')
}
async function doSync(k){
 const master=k==='A'?'B':'A',api=window.__afdWin184;if(!hasSource(k)||!hasSource(master)){status('SYNC • צריך שיר בשני הדקים');return}if(hasYT(k)||hasYT(master)||hasSP(k)||hasSP(master)){status('SYNC BEAT • זמין כרגע לקבצים מקומיים');return}if(!api?.syncDeck){status('SYNC • מנוע ניתוח הביט עדיין נטען');return}
 status('SYNC • מנתח ומיישר DECK '+k+' ל-DECK '+master+'...');try{await api.syncDeck(k);paintBpm(k);paintBpm(master);const a=effectiveBpm(k),b=effectiveBpm(master);if(a>20&&b>20)status('SYNC • DECK '+k+' = '+a.toFixed(1)+' BPM • נעול ל-DECK '+master+' = '+b.toFixed(1)+' BPM');else status('SYNC • DECK '+k+' מיושר ל-DECK '+master)}catch(e){status('SYNC ERROR • '+(e?.message||e))}
}
function ownSync(k){const d=D(),root=d?.querySelector('.deck'+k),old=root?.querySelector('.transport .sync,.transport [data-act="sync"],.afdSync148');if(!old)return;if(old.dataset.afd186==='1')return;const b=old.cloneNode(true);b.dataset.afd186='1';b.dataset.afd184sync='1';b.dataset.afd126='1';b.dataset.afdSync127='1';b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();doSync(k)},true);old.replaceWith(b)}
function ownMix(){const d=D(),old=d?.getElementById('afdMixBtn');if(!old||old.dataset.afd186==='1')return;const b=old.cloneNode(true);b.dataset.afd186='1';b.dataset.afd184v2='1';b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();doMix()},true);old.replaceWith(b)}
function bindBpm(){const d=D();if(!d||d.documentElement.dataset.afdBpm186)return;d.documentElement.dataset.afdBpm186='1';['A','B'].forEach(k=>{const v=d.getElementById('vid'+k);v?.addEventListener('ratechange',()=>paintBpm(k));v?.addEventListener('loadedmetadata',()=>{if(!baseBpm(k))clearFakeBpm(k)})});}
function refresh(){clearFakeBpm('A');clearFakeBpm('B');ownSync('A');ownSync('B');ownMix();bindBpm();paintBpm('A');paintBpm('B')}
window.addEventListener('afd-local-load',e=>{const k=e.detail?.deck;if(k==='A'||k==='B')resetBpm(k)});
window.addEventListener('afd-deck-eject',e=>{const k=e.detail?.deck;if(k==='A'||k==='B')resetBpm(k)});
window.__afdWin186={refresh,doMix,doSync,cancelMix,effectiveBpm};
frame()?.addEventListener('load',()=>setTimeout(refresh,250));refresh();setTimeout(refresh,700);setInterval(refresh,500);
})();