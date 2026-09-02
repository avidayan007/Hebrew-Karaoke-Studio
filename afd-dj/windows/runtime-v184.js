(()=>{
if(window.__afdWin184){window.__afdWin184.refresh();return;}
const frame=()=>document.getElementById('console');
let doc=null,W=null,ctx=null,mix=.5,mixBusy=false,mixRaf=0,lastPublished=-1,signalsmithReady=false;
const key={A:0,B:0},nodes={A:null,B:null},serial={A:0,B:0};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const val=(id,def)=>{const e=doc?.getElementById(id);return e?+e.value:def};
const status=t=>{const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD BUFFER HQ 184]',t)};
function killOld(d){if(d?.documentElement)d.documentElement.dataset.afd156='1'}
async function ensureSignalsmith(){
 if(signalsmithReady&&W?.SignalsmithStretch)return true;
 const source=String(window.__afdSignalsmithSource||'');if(!source)return false;
 try{if(!W.SignalsmithStretch)W.Function(source+'\n;window.SignalsmithStretch=SignalsmithStretch;')();signalsmithReady=typeof W.SignalsmithStretch==='function';return signalsmithReady}catch(e){console.warn('Signalsmith load',e);return false}
}
function factor(k){const x=clamp(mix,0,1);return k==='A'?Math.sin(x*Math.PI/2):Math.cos(x*Math.PI/2)}
function applyVideo(){if(!doc)return;const a=String(clamp(mix,0,1)),b=String(1-clamp(mix,0,1));['masterA','ytMasterA'].forEach(id=>{const e=doc.getElementById(id);if(e)e.style.setProperty('opacity',a,'important')});['masterB','ytMasterB'].forEach(id=>{const e=doc.getElementById(id);if(e)e.style.setProperty('opacity',b,'important')})}
function publish(force=false){const p=Math.round(mix*1000)/10;if(!force&&p===lastPublished)return;lastPublished=p;try{window.dispatchEvent(new CustomEvent('afd-crossfader',{detail:{value:mix*100,a:factor('A'),b:factor('B')}}))}catch(e){}}
function apply(force=false){
 if(!doc)return;const master=clamp(val('afdMasterVolume',100)/100,0,1);
 for(const k of ['A','B']){const n=nodes[k],v=doc.getElementById('vid'+k);if(!v)continue;const deck=clamp(val('gain'+k,100)/100,0,1),level=master*deck*factor(k);try{v.preservesPitch=true;v.webkitPreservesPitch=true}catch(e){}if(n){n.deckGain.gain.value=clamp(level,0,1);n.lo.gain.value=val('afdEqBass'+k,0);n.mid.gain.value=val('afdEqMid'+k,0);n.hi.gain.value=val('afdEqTreble'+k,0)}else v.volume=clamp(level,0,1)}
 const r=doc.getElementById('afdMasterRead');if(r)r.textContent=Math.round(master*100)+'%';applyVideo();publish(force)
}
async function ensureGraph(){
 if(ctx)return;const AC=W?.AudioContext||W?.webkitAudioContext;if(!AC)return;ctx=new AC({latencyHint:'playback'});await ensureSignalsmith();
 for(const k of ['A','B']){const v=doc.getElementById('vid'+k);if(!v)continue;try{
  const src=ctx.createMediaElementSource(v),nativeGate=ctx.createGain(),processedGate=ctx.createGain(),lo=ctx.createBiquadFilter(),mid=ctx.createBiquadFilter(),hi=ctx.createBiquadFilter(),deckGain=ctx.createGain();
  lo.type='lowshelf';lo.frequency.value=250;mid.type='peaking';mid.frequency.value=1000;mid.Q.value=.8;hi.type='highshelf';hi.frequency.value=4000;
  nativeGate.gain.value=1;processedGate.gain.value=0;src.connect(nativeGate).connect(lo);processedGate.connect(lo);lo.connect(mid).connect(hi).connect(deckGain).connect(ctx.destination);
  nodes[k]={v,src,nativeGate,processedGate,lo,mid,hi,deckGain,stretch:null,bufferId:'',loading:null,processed:false};bindMedia(k,nodes[k]);
 }catch(e){console.warn('AFD graph '+k,e)}}apply(true)
}
async function resume(){await ensureGraph();try{await ctx?.resume()}catch(e){}apply()}
function metaFor(k){return window.AFDLocalDeckMeta?.[k]||null}
function online(k){return!!(doc?.getElementById('ytDeck'+k)||doc?.getElementById('afdSP105Deck'+k))}
function mediaIdentity(k){const n=nodes[k],m=metaFor(k);return String(m?.path||m?.key||m?.name||n?.v?.currentSrc||n?.v?.src||'')}
async function fetchDecoded(k){
 const n=nodes[k],v=n?.v;if(!n||!v)throw Error('Deck audio not ready');let ab=null,lastErr=null;
 const direct=String(v.currentSrc||v.src||'');if(direct){try{const r=await fetch(direct);if(!r.ok)throw Error('HTTP '+r.status);ab=await r.arrayBuffer();const b=await ctx.decodeAudioData(ab.slice(0));return b}catch(e){lastErr=e}}
 const meta=metaFor(k),bridge=window.afdDesktopMedia;if(!meta||!bridge)throw(lastErr||Error('Audio source unavailable'));
 try{const res=meta.path?await bridge.prepareKeyPath(meta):await bridge.prepareKey(meta);if(!res?.url)throw Error('HQ audio preparation failed');const r=await fetch(res.url);if(!r.ok)throw Error('HQ audio fetch '+r.status);ab=await r.arrayBuffer();return await ctx.decodeAudioData(ab.slice(0))}catch(e){throw e}
}
async function disposeStretch(k){const n=nodes[k];if(!n?.stretch)return;try{await n.stretch.stop?.()}catch(e){}try{n.stretch.disconnect()}catch(e){}try{await n.stretch.dropBuffers?.()}catch(e){}n.stretch=null;n.bufferId='';n.processed=false;n.processedGate.gain.value=0;n.nativeGate.gain.value=1}
async function prepareBuffer(k){
 await resume();const n=nodes[k];if(!n)throw Error('Deck graph unavailable');const id=mediaIdentity(k);if(!id)throw Error('No local track in Deck '+k);if(n.stretch&&n.bufferId===id)return n.stretch;if(n.loading)return n.loading;
 const my=++serial[k];n.loading=(async()=>{status('DECK '+k+' • מכין HQ KEY בזיכרון...');const audio=await fetchDecoded(k);if(my!==serial[k])throw Error('Cancelled');await disposeStretch(k);if(typeof W.SignalsmithStretch!=='function')throw Error('Signalsmith engine unavailable');const stretch=await W.SignalsmithStretch(ctx);try{await stretch.configure({blockMs:220,intervalMs:55,splitComputation:true})}catch(e){}const arrays=[];for(let c=0;c<Math.min(2,audio.numberOfChannels);c++)arrays.push(new Float32Array(audio.getChannelData(c)));if(arrays.length===1)arrays.push(new Float32Array(arrays[0]));await stretch.addBuffers(arrays,arrays.map(a=>a.buffer));try{stretch.setUpdateInterval?.(.1)}catch(e){}stretch.connect(n.processedGate);n.stretch=stretch;n.bufferId=id;status('DECK '+k+' • HQ KEY READY');return stretch})();
 try{return await n.loading}finally{n.loading=null}
}
function gate(k,processed){const n=nodes[k];if(!n||!ctx)return;n.processed=processed;const t=ctx.currentTime;n.nativeGate.gain.cancelScheduledValues(t);n.processedGate.gain.cancelScheduledValues(t);n.nativeGate.gain.setTargetAtTime(processed?0:1,t,.012);n.processedGate.gain.setTargetAtTime(processed?1:0,t,.012)}
async function stopProcessed(k){const n=nodes[k];if(!n?.stretch)return;try{await n.stretch.schedule({output:ctx.currentTime+.01,active:false},true)}catch(e){try{await n.stretch.stop?.(ctx.currentTime+.01)}catch(x){}}}
async function startProcessed(k){
 const n=nodes[k],v=n?.v;if(!n?.stretch||!v||key[k]===0)return;const latency=Math.max(.03,Number(n.stretch.latency?.()||.12));const when=ctx.currentTime+latency;const input=Math.max(0,Number(v.currentTime)||0),rate=Math.max(.25,Math.min(4,Number(v.playbackRate)||1));
 try{await n.stretch.schedule({output:when,active:true,input,rate,semitones:key[k],tonalityHz:12000,formantCompensation:true,formantBaseHz:0},true);gate(k,true)}catch(e){console.warn('Signalsmith start '+k,e)}
}
async function setTone(k,n,announce=true){
 n=clamp(Math.round(Number(n)||0),-12,12);key[k]=n;const read=doc?.getElementById('afdDeckKeyRead'+k);if(read)read.textContent=(n>0?'+':'')+n;if(online(k)){if(announce)status('KEY • זמין לקבצים מקומיים בלבד');return false}
 await resume();if(n===0){await stopProcessed(k);gate(k,false);if(announce)status('DECK '+k+' • KEY 0');return true}
 try{const st=await prepareBuffer(k);if(!st)return false;if(nodes[k]?.v&&!nodes[k].v.paused)await startProcessed(k);else gate(k,true);if(announce)status('DECK '+k+' • HQ KEY '+(n>0?'+':'')+n);return true}catch(e){gate(k,false);status('HQ KEY ERROR • '+(e?.message||e));return false}
}
function changeTone(k,d){setTone(k,key[k]+d)}
function bindMedia(k,n){const v=n.v;if(v.dataset.afd184)return;v.dataset.afd184='1';v.addEventListener('play',()=>{resume();if(key[k]!==0)prepareBuffer(k).then(()=>startProcessed(k)).catch(e=>status('HQ KEY ERROR • '+e.message))});v.addEventListener('pause',()=>{if(key[k]!==0)stopProcessed(k)});v.addEventListener('seeked',()=>{if(key[k]!==0&&!v.paused)startProcessed(k)});v.addEventListener('ratechange',()=>{if(key[k]!==0&&!v.paused)startProcessed(k)});v.addEventListener('ended',()=>stopProcessed(k));v.addEventListener('loadedmetadata',()=>{serial[k]++;disposeStretch(k);key[k]=0;const r=doc?.getElementById('afdDeckKeyRead'+k);if(r)r.textContent='0'})}
function cleanupOldKey(){for(const id of ['afdMasterKeyWrap182','afdMasterKeyWrap181']){const wrap=doc?.getElementById(id);if(wrap){const s=wrap.querySelector('.masterScreen');if(s&&wrap.parentElement)wrap.parentElement.insertBefore(s,wrap);wrap.remove()}}doc?.querySelectorAll('.afdKeyCtl176,.afdHQKey181,.afdHQKey182').forEach(e=>e.remove())}
function makeKey(k){const b=doc.createElement('div');b.id='afdDeckKey'+k;b.className='afdDeckKey184';b.innerHTML='<small>KEY '+k+'</small><button data-d="1">＋</button><strong id="afdDeckKeyRead'+k+'">0</strong><button data-d="-1">−</button>';b.querySelectorAll('button').forEach(x=>x.onclick=e=>{e.preventDefault();e.stopPropagation();changeTone(k,+x.dataset.d)});b.querySelector('strong').onclick=()=>setTone(k,0);return b}
function addKeyUI(k){const root=doc?.querySelector('.deck'+k),row=root?.querySelector('.screenRow'),screen=row?.querySelector('.screen');if(!row||!screen)return;let b=doc.getElementById('afdDeckKey'+k);if(!b)b=makeKey(k);if(k==='A'){if(b.nextSibling!==screen)row.insertBefore(b,screen);row.classList.add('afdKeyRowA184')}else{if(screen.nextSibling!==b)row.insertBefore(b,screen.nextSibling);row.classList.add('afdKeyRowB184')}const r=doc.getElementById('afdDeckKeyRead'+k);if(r)r.textContent=(key[k]>0?'+':'')+key[k]}
function styleUI(){if(!doc?.head)return;let s=doc.getElementById('afdKeyStyle184');if(!s){s=doc.createElement('style');s.id='afdKeyStyle184';doc.head.appendChild(s)}s.textContent='.deckA .screenRow.afdKeyRowA184{grid-template-columns:48px 34px minmax(0,1fr) 48px!important}.deckB .screenRow.afdKeyRowB184{grid-template-columns:48px minmax(0,1fr) 34px 48px!important}.afdDeckKey184{width:34px;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:6px;border:1px solid #5c6571;border-radius:12px;background:linear-gradient(#171c23,#07090d);box-shadow:inset 0 1px #ffffff22,0 2px 5px #000;color:#fff}.afdDeckKey184 small{font-size:6px;font-weight:900;color:#c8d0da}.afdDeckKey184 button{width:27px;height:29px!important;padding:0!important;border:1px solid #7d8793;border-radius:11px!important;background:linear-gradient(#3b4651,#14191f);color:#fff;font-size:18px!important;font-weight:1000;line-height:1}.afdDeckKey184 strong{width:27px;height:27px;display:grid;place-items:center;border:1px solid #68547c;border-radius:10px;background:#050609;color:#efd8ff;font-size:10px;cursor:pointer}.deckB .afdDeckKey184 strong{color:#ccefff;border-color:#426b82}';}
function labelCross(){const c=doc?.getElementById('cross'),wrap=c?.closest('.cross');if(!c||!wrap)return;const labels=[...wrap.children].filter(x=>x!==c&&x.tagName!=='INPUT');if(labels.length>=2){labels[0].textContent='B';labels[labels.length-1].textContent='A'}c.title='שמאל Deck B • ימין Deck A'}
function hasSource(k){const v=doc?.getElementById('vid'+k);return!!((v&&(v.currentSrc||v.src))||doc?.getElementById('ytDeck'+k)||doc?.getElementById('afdSP105Deck'+k))}
function playing(k){const v=doc?.getElementById('vid'+k);return!!((v&&(v.currentSrc||v.src)&&!v.paused&&!v.ended)||window.AFDYouTubeState?.isPlaying?.(k)||window.AFDSpotifyState?.isPlaying?.(k))}
function startDeck(k){if(playing(k))return true;const root=doc?.querySelector('.deck'+k),b=root?.querySelector('[data-act="play"]');if(!b)return false;b.click();return true}
function cancelMix(){if(mixRaf){try{W.cancelAnimationFrame(mixRaf)}catch(e){}mixRaf=0}mixBusy=false;doc?.getElementById('afdMixBtn')?.classList.remove('on')}
function startMix(){
 if(mixBusy)return;const from=mix>=.5?'A':'B',to=from==='A'?'B':'A',target=to==='A'?1:0;if(!hasSource(to)){status('MIX • אין שיר ב-DECK '+to);return}if(!playing(to))startDeck(to);const start=clamp(mix,0,1);mixBusy=true;const btn=doc.getElementById('afdMixBtn');btn?.classList.add('on');const t0=performance.now(),dur=2200;
 const tick=t=>{if(!mixBusy)return;const p=Math.min(1,(t-t0)/dur),q=p*p*(3-2*p);mix=start+(target-start)*q;const c=doc.getElementById('cross');if(c)c.value=String(mix*100);const vc=doc.getElementById('videoCross');if(vc)vc.value=String(mix*100);apply(true);if(p<1)mixRaf=W.requestAnimationFrame(tick);else{mix=target;apply(true);mixRaf=0;mixBusy=false;btn?.classList.remove('on');status('MIX • DECK '+to+' ACTIVE • DECK '+from+' ממשיך בשקט')}};mixRaf=W.requestAnimationFrame(tick)
}
function bindMix(){const c=doc?.getElementById('cross');if(c&&!c.dataset.afd184){c.dataset.afd184='1';mix=clamp((+c.value||0)/100,0,1);['input','change'].forEach(ev=>c.addEventListener(ev,e=>{e.stopImmediatePropagation();cancelMix();mix=clamp((+c.value||0)/100,0,1);const vc=doc.getElementById('videoCross');if(vc)vc.value=c.value;resume().then(()=>apply(true))},true))}if(doc&&!doc.documentElement.dataset.afdMixCapture184){doc.documentElement.dataset.afdMixCapture184='1';doc.addEventListener('click',e=>{const b=e.target?.closest?.('#afdMixBtn');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();startMix()},true)}labelCross()}
function bindControls(){['afdMasterVolume','gainA','gainB','afdEqBassA','afdEqMidA','afdEqTrebleA','afdEqBassB','afdEqMidB','afdEqTrebleB'].forEach(id=>{const e=doc?.getElementById(id);if(e&&!e.dataset.afd184){e.dataset.afd184='1';['input','change'].forEach(ev=>e.addEventListener(ev,x=>{x.stopImmediatePropagation();resume()},true))}});if(doc&&!doc.documentElement.dataset.afdResume184){doc.documentElement.dataset.afdResume184='1';doc.addEventListener('pointerdown',()=>resume(),{capture:true,passive:true})}}
function drift(){if(!ctx)return;for(const k of ['A','B']){const n=nodes[k],v=n?.v;if(key[k]===0||!n?.processed||!n?.stretch||!v||v.paused)continue;const it=Number(n.stretch.inputTime);if(Number.isFinite(it)&&Math.abs(it-v.currentTime)>.55)startProcessed(k)}}
function install(){let d;try{d=frame()?.contentDocument}catch(e){return}if(!d?.documentElement)return;if(doc&&doc!==d){try{ctx?.close()}catch(e){}ctx=null;nodes.A=nodes.B=null;signalsmithReady=false;lastPublished=-1}doc=d;W=d.defaultView;killOld(d);cleanupOldKey();styleUI();addKeyUI('A');addKeyUI('B');bindMix();bindControls();apply()}
function refresh(){install()}
const api={refresh,setTone,changeTone,getTone:k=>key[k]||0,startMix};window.__afdWin184=api;window.__afdWin182=api;window.__afdWin181=api;window.__afdWin176=api;
window.addEventListener('afd-local-load',e=>{const k=e.detail?.deck;if(!['A','B'].includes(k))return;serial[k]++;key[k]=0;if(nodes[k])disposeStretch(k);const r=doc?.getElementById('afdDeckKeyRead'+k);if(r)r.textContent='0'});
frame()?.addEventListener('load',()=>setTimeout(install,80));install();setTimeout(install,350);setTimeout(install,1200);setInterval(()=>{install();apply();drift()},900);
})();