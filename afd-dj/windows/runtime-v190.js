(()=>{
if(window.__afdWin190){window.__afdWin190.refresh();return;}
const frame=()=>document.getElementById('console');
const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const mod=(n,m)=>((n%m)+m)%m;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const info={A:null,B:null},locks={A:null,B:null},jobs={A:0,B:0};
let programmaticPitch=false,phaseBusy={A:false,B:false};
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD BPM/SYNC 190]',t)}
function media(k){return D()?.getElementById('vid'+k)||null}
function meta(k){return window.AFDLocalDeckMeta?.[k]||null}
function online(k){const d=D();return!!(d?.getElementById('ytDeck'+k)||d?.getElementById('afdSP105Deck'+k))}
function identity(k){const m=meta(k),v=media(k);return String(m?.path||m?.key||m?.name||v?.currentSrc||v?.src||'')}
function bpmEl(k){const d=D();if(!d)return null;let e=d.getElementById('bpm'+k);if(!e){e=d.querySelector('.deck'+k+' .bpm strong');if(e)e.id='bpm'+k}return e||null}
function rawBase(k){return Number(info[k]?.bpm||bpmEl(k)?.dataset?.afdDetectedBpm||bpmEl(k)?.dataset?.afdBaseBpm||0)||0}
function gridBase(k){return locks[k]?.normalizedBase||rawBase(k)}
function effective(k){const b=gridBase(k),v=media(k);return b>20&&v?b*(Number(v.playbackRate)||1):b}
function paint(k){const e=bpmEl(k),v=media(k);if(!e||!v)return;const b=gridBase(k);if(!(b>20))return;const n=b*(Number(v.playbackRate)||1);e.dataset.afdBaseBpm=String(b);e.dataset.afdEffectiveBpm=String(n);if(info[k]?.bpm)e.dataset.afdDetectedBpm=String(info[k].bpm);if(locks[k])e.dataset.afdSyncLocked='190';else delete e.dataset.afdSyncLocked;e.textContent=n.toFixed(1)}
function setAnalyzing(k){const e=bpmEl(k);if(e){e.textContent='…';delete e.dataset.afdBaseBpm;delete e.dataset.afdEffectiveBpm;delete e.dataset.afdSyncLocked}}
function clearLock(k,restore=true){locks[k]=null;const e=bpmEl(k);if(e){delete e.dataset.afdSyncLocked;if(restore&&info[k]?.bpm)e.dataset.afdBaseBpm=String(info[k].bpm)}paint(k)}
function bestNormalizedBase(base,leader){let best={base,ratio:leader/base,score:Infinity,m:1};for(const m of [.25,.5,1,2,4]){const b=base*m,r=leader/b;if(r<.5||r>2)continue;const score=Math.abs(Math.log(r));if(score<best.score)best={base:b,ratio:r,score,m}}return best}
async function analyze(k,force=false){
 if(online(k))return null;const m=meta(k),bridge=window.afdDesktopMedia,id=identity(k);if(!m||!bridge||!id)return null;if(!force&&info[k]?.id===id&&info[k]?.bpm>20){paint(k);return info[k]}
 const token=++jobs[k];clearLock(k,false);setAnalyzing(k);status('BPM • מנתח DECK '+k+' ברקע...');
 try{const r=m.path?await bridge.analyzeBpmPath?.(m):await bridge.analyzeBpm?.(m);if(token!==jobs[k]||identity(k)!==id)return null;const bpm=Number(r?.bpm||0),offset=Number(r?.offset||0);if(!(bpm>20&&bpm<260))throw Error('BPM detection failed');info[k]={id,bpm,offset:Number.isFinite(offset)?offset:0,confidence:Number(r?.confidence||0),source:r?.source||'beatroot'};const e=bpmEl(k);if(e){e.dataset.afdDetectedBpm=String(bpm);e.dataset.afdBaseBpm=String(bpm);e.dataset.afdBeatOffset=String(info[k].offset)}paint(k);status('BPM • DECK '+k+' = '+effective(k).toFixed(1)+' BPM');return info[k]}catch(e){if(token===jobs[k]){const be=bpmEl(k);if(be)be.textContent='—';status('BPM ERROR • DECK '+k+' • '+(e?.message||e))}return null}
}
async function ensureAnalyzed(k){return info[k]?.id===identity(k)&&info[k]?.bpm>20?info[k]:analyze(k)}
function phaseFraction(k){const v=media(k),i=info[k],b=gridBase(k);if(!v||!i||!(b>20))return 0;const p=60/b;return mod((Number(v.currentTime)||0)-i.offset,p)/p}
async function alignPhase(k,leader){if(phaseBusy[k])return;const tv=media(k),mv=media(leader),ti=info[k];if(!tv||!mv||!ti||!info[leader])return;phaseBusy[k]=true;try{const tb=gridBase(k),period=60/tb,phase=phaseFraction(leader),base=ti.offset+phase*period,cur=Number(tv.currentTime)||0,n=Math.round((cur-base)/period),pos=base+n*period;if(Number.isFinite(tv.duration)&&tv.duration>0){const dest=clamp(pos,0,Math.max(0,tv.duration-.03));if(Math.abs(dest-cur)>.006){const old=tv.volume;try{tv.volume=0}catch(e){}try{tv.currentTime=dest}catch(e){}await sleep(55);try{tv.volume=old}catch(e){}}}}finally{phaseBusy[k]=false}}
function updateVisiblePitch(k,rate){const d=D(),p=d?.getElementById('pitch'+k),ui=d?.querySelector('#afdPitchInline'+k+' input'),read=d?.getElementById('afdPitchInlineRead'+k),pct=(rate-1)*100;programmaticPitch=true;try{for(const x of [p,ui])if(x){if(Number(x.min)>-50)x.min='-50';if(Number(x.max)<50)x.max='50';x.value=String(pct)}if(read)read.textContent=(pct>0?'+':'')+pct.toFixed(1)+'%'}finally{setTimeout(()=>programmaticPitch=false,0)}}
async function syncDeck(k){
 const leader=k==='A'?'B':'A';if(online(k)||online(leader)){status('SYNC • זמין לקבצים מקומיים');return}if(!media(k)||!media(leader)){status('SYNC • צריך שיר בשני הדקים');return}
 status('SYNC • מכין התאמה מדויקת DECK '+k+' → DECK '+leader+'...');const [ti,li]=await Promise.all([ensureAnalyzed(k),ensureAnalyzed(leader)]);if(!ti||!li){status('SYNC • לא ניתן לסנכרן בלי BPM תקין בשני הדקים');return}
 clearLock(leader,true);const leaderEff=rawBase(leader)*(Number(media(leader).playbackRate)||1),norm=bestNormalizedBase(ti.bpm,leaderEff),rate=leaderEff/norm.base;if(!(rate>=.5&&rate<=2)){status('SYNC • פער המהירות גדול מדי');return}
 locks[k]={leader,normalizedBase:norm.base,multiplier:norm.m};const tv=media(k);try{tv.preservesPitch=true;tv.webkitPreservesPitch=true}catch(e){}tv.playbackRate=rate;updateVisiblePitch(k,rate);paint(leader);paint(k);await alignPhase(k,leader);status('SYNC • DECK '+k+' = '+effective(k).toFixed(1)+' BPM • נעול ל-DECK '+leader+' = '+effective(leader).toFixed(1)+' BPM')
}
function follow(){for(const k of ['A','B']){const lock=locks[k];if(!lock)continue;const leader=lock.leader,tv=media(k),lv=media(leader);if(!tv||!lv||!info[k]||!info[leader])continue;const leaderEff=gridBase(leader)*(Number(lv.playbackRate)||1),rate=leaderEff/lock.normalizedBase;if(rate>=.5&&rate<=2&&Math.abs((Number(tv.playbackRate)||1)-rate)>.00005){try{tv.preservesPitch=true;tv.webkitPreservesPitch=true}catch(e){}tv.playbackRate=rate;updateVisiblePitch(k,rate)}paint(leader);paint(k)}}
function bindPlay(k){const v=media(k);if(!v||v.dataset.afd190play)return;v.dataset.afd190play='1';v.addEventListener('play',()=>{const l=locks[k];if(l)setTimeout(()=>alignPhase(k,l.leader),20)});v.addEventListener('ratechange',()=>{paint(k);for(const f of ['A','B'])if(locks[f]?.leader===k)follow()})}
function bindPitch(k){const d=D(),p=d?.getElementById('pitch'+k);if(!p||p.dataset.afd190pitch)return;p.dataset.afd190pitch='1';p.min='-50';p.max='50';p.addEventListener('input',()=>{if(!programmaticPitch&&locks[k])clearLock(k,true);paint(k)},true);p.addEventListener('change',()=>paint(k),true)}
function ownSync(k){const d=D(),root=d?.querySelector('.deck'+k),old=root?.querySelector('.transport .sync,.transport [data-act="sync"],.afdSync148,.afdSync175');if(!old)return;if(old.dataset.afd190==='1')return;const b=old.cloneNode(true);b.textContent='SYNC';b.classList.add('afdSync190');Object.assign(b.dataset,{afd190:'1',afd188:'1',afd186:'1',afd184sync:'1',afd126:'1',afdSync127:'1'});b.onclick=null;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();syncDeck(k)},true);old.replaceWith(b)}
function style(){const d=D();if(!d?.head)return;let s=d.getElementById('afdSyncLayout190');if(!s){s=d.createElement('style');s.id='afdSyncLayout190';d.head.appendChild(s)}s.textContent=`
.transport{direction:ltr!important;grid-template-columns:minmax(56px,1.05fr) minmax(46px,.82fr) minmax(46px,.82fr) minmax(44px,.72fr) minmax(78px,1.25fr) minmax(96px,1.55fr)!important;gap:4px!important}.transport>*{grid-row:1!important}.transport>.afdSync190,.transport>.afdSync175{grid-column:5!important;min-width:78px!important;height:48px!important;min-height:48px!important;font-size:11px!important;font-weight:1000!important;border-color:#8a67bd!important;background:linear-gradient(#7045a6,#28183f 64%,#0f0919)!important;box-shadow:inset 0 1px #ffffff55,0 3px #000!important}.transport>.afdPitchInline175{grid-column:6!important;min-width:96px!important;height:48px!important}.afdPitchInline175 input{min-width:74px!important}@media(max-width:1000px){.transport{grid-template-columns:minmax(50px,1fr) minmax(42px,.8fr) minmax(42px,.8fr) minmax(40px,.7fr) minmax(70px,1.2fr) minmax(84px,1.45fr)!important}.transport>.afdSync190,.transport>.afdSync175{min-width:70px!important;font-size:10px!important}.transport>.afdPitchInline175{min-width:84px!important}}
`}
function refresh(){style();for(const k of ['A','B']){ownSync(k);bindPlay(k);bindPitch(k);paint(k)}follow()}
window.addEventListener('afd-local-load',e=>{const k=e.detail?.deck;if(k!=='A'&&k!=='B')return;jobs[k]++;info[k]=null;clearLock(k,false);setTimeout(()=>analyze(k),180)});
window.addEventListener('afd-deck-eject',e=>{const k=e.detail?.deck;if(k!=='A'&&k!=='B')return;jobs[k]++;info[k]=null;clearLock(k,false);const e2=bpmEl(k);if(e2)e2.textContent='—'});
window.__afdWin190={refresh,syncDeck,analyze,effective,clearLock,getInfo:k=>info[k]};
frame()?.addEventListener('load',()=>setTimeout(refresh,250));refresh();setTimeout(refresh,700);setInterval(refresh,220);
})();