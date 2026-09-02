(()=>{
if(window.__afdWin182){window.__afdWin182.refresh();return;}
const frame=()=>document.getElementById('console');
let doc=null,W=null,ctx=null,nodes={},graphPromise=null,key={A:0,B:0},mix=.5,fadeOverride=null,busy=false,lastPublished=-1,signalsmithReady=false;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const val=(id,def)=>{const e=doc?.getElementById(id);return e?+e.value:def};
const status=t=>{const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD SIGNALSMITH KEY/MIX 182]',t)};
function killOldCore(d){if(d?.documentElement)d.documentElement.dataset.afd156='1'}
async function ensureSignalsmith(){
 if(signalsmithReady&&W?.SignalsmithStretch)return true;
 const source=String(window.__afdSignalsmithSource||'');
 if(!source){console.warn('AFD Signalsmith source missing');return false}
 try{
  if(!W.SignalsmithStretch){W.Function(source+'\n;window.SignalsmithStretch=SignalsmithStretch;')()}
  signalsmithReady=typeof W.SignalsmithStretch==='function';return signalsmithReady;
 }catch(e){console.warn('AFD Signalsmith load failed',e);return false}
}
function factors(k){if(fadeOverride)return fadeOverride[k];return k==='A'?mix:1-mix}
function applyVideoMix(){if(!doc)return;const a=String(clamp(mix,0,1)),b=String(clamp(1-mix,0,1));['masterA','ytMasterA'].forEach(id=>{const e=doc.getElementById(id);if(e)e.style.setProperty('opacity',a,'important')});['masterB','ytMasterB'].forEach(id=>{const e=doc.getElementById(id);if(e)e.style.setProperty('opacity',b,'important')})}
function publishCross(force=false){const p=Math.round(mix*1000)/10;if(!force&&p===lastPublished)return;lastPublished=p;try{window.dispatchEvent(new CustomEvent('afd-crossfader',{detail:{value:mix*100,a:mix,b:1-mix}}))}catch(e){}}
async function scheduleTone(k){const n=nodes[k];if(!n?.stretch)return;try{await n.stretch.schedule({semitones:key[k],tonalityHz:10000,formantCompensation:key[k]!==0,formantBaseHz:0})}catch(e){console.warn('AFD Signalsmith tone schedule '+k,e)}}
function apply(forcePublish=false){
 if(!doc)return;const master=clamp(val('afdMasterVolume',100)/100,0,1);
 ['A','B'].forEach(k=>{const v=doc.getElementById('vid'+k);if(!v)return;const deck=clamp(val('gain'+k,100)/100,0,1),level=clamp(master*deck*clamp(factors(k),0,1),0,1),n=nodes[k];try{v.preservesPitch=true;v.webkitPreservesPitch=true}catch(e){}v.muted=false;v.defaultMuted=false;if(n){v.volume=1;n.gain.gain.value=level;n.lo.gain.value=val('afdEqBass'+k,0);n.mid.gain.value=val('afdEqMid'+k,0);n.hi.gain.value=val('afdEqTreble'+k,0)}else v.volume=level});
 const r=doc.getElementById('afdMasterRead');if(r)r.textContent=Math.round(master*100)+'%';applyVideoMix();publishCross(forcePublish)
}
async function ensureGraph(){
 if(graphPromise)return graphPromise;
 graphPromise=(async()=>{
  if(ctx)return;
  const AC=W.AudioContext||W.webkitAudioContext;if(!AC)return;
  ctx=new AC({latencyHint:'interactive'});
  const hasSignalsmith=await ensureSignalsmith();
  for(const k of ['A','B']){
   const v=doc.getElementById('vid'+k);if(!v)continue;
   try{
    const src=ctx.createMediaElementSource(v),lo=ctx.createBiquadFilter(),mid=ctx.createBiquadFilter(),hi=ctx.createBiquadFilter(),gain=ctx.createGain();
    lo.type='lowshelf';lo.frequency.value=250;mid.type='peaking';mid.frequency.value=1000;mid.Q.value=.8;hi.type='highshelf';hi.frequency.value=4000;
    src.connect(lo).connect(mid).connect(hi);
    let stretch=null;
    if(hasSignalsmith){
      stretch=await W.SignalsmithStretch(ctx,{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2]});
      try{await stretch.configure({blockMs:180,intervalMs:45,splitComputation:true})}catch(e){}
      hi.connect(stretch).connect(gain);try{await stretch.start()}catch(e){}
    }else hi.connect(gain);
    gain.connect(ctx.destination);nodes[k]={v,lo,mid,hi,stretch,gain};await scheduleTone(k)
   }catch(e){console.warn('AFD Signalsmith graph deck '+k,e)}
  }
  apply(true)
 })();try{await graphPromise}finally{graphPromise=null}
}
async function resume(){await ensureGraph();try{await ctx?.resume()}catch(e){}apply()}
function onlineSource(deck){return!!(doc?.getElementById('ytDeck'+deck)||doc?.getElementById('afdSP105Deck'+deck))}
async function setTone(deck,n,announce=true){n=clamp(Math.round(Number(n)||0),-12,12);key[deck]=n;const read=doc?.getElementById('afdHQKeyRead'+deck);if(read)read.textContent=(n>0?'+':'')+n;await resume().catch(()=>{});await scheduleTone(deck);apply();if(announce)status('DECK '+deck+' • STUDIO KEY '+(n>0?'+':'')+n+' semitones')}
function changeTone(deck,delta){if(onlineSource(deck)){status('STUDIO KEY • שינוי טון זמין לקבצים מקומיים בלבד');return}setTone(deck,key[deck]+delta)}
function makeKeyBox(deck){const c=doc.createElement('div');c.id='afdHQKey'+deck;c.className='afdHQKey182 afdHQKey'+deck;c.innerHTML='<small>DECK '+deck+'</small><b>STUDIO KEY</b><button data-k="1" title="העלה טון">＋</button><strong id="afdHQKeyRead'+deck+'">0</strong><button data-k="-1" title="הורד טון">−</button>';c.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();changeTone(deck,Number(b.dataset.k||0))}));c.querySelector('strong')?.addEventListener('click',()=>{if(!onlineSource(deck))setTone(deck,0)});return c}
function addMasterToneUI(){const screen=doc?.querySelector('.masterScreen');if(!screen)return;let wrap=doc.getElementById('afdMasterKeyWrap182');if(!wrap){doc.getElementById('afdMasterKeyWrap181')?.replaceWith(screen);wrap=doc.createElement('div');wrap.id='afdMasterKeyWrap182';screen.parentElement.insertBefore(wrap,screen);wrap.appendChild(makeKeyBox('B'));wrap.appendChild(screen);wrap.appendChild(makeKeyBox('A'))}['A','B'].forEach(k=>{const read=doc.getElementById('afdHQKeyRead'+k);if(read)read.textContent=(key[k]>0?'+':'')+key[k]})}
function styleUI(){if(!doc?.head)return;let s=doc.getElementById('afdHQKeyStyle182');if(!s){s=doc.createElement('style');s.id='afdHQKeyStyle182';doc.head.appendChild(s)}s.textContent='#afdMasterKeyWrap182{display:grid!important;grid-template-columns:66px minmax(0,1fr) 66px!important;gap:9px!important;align-items:stretch!important;margin-top:7px!important}#afdMasterKeyWrap182>.masterScreen{margin-top:0!important;min-width:0!important}.afdHQKey182{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;border:1px solid #5e4b6c;border-radius:18px;background:linear-gradient(180deg,#191321,#080a0e 60%,#030406);box-shadow:inset 0 1px #ffffff2d,0 4px 10px #000;color:#fff;padding:7px 5px;overflow:hidden}.afdHQKey182 small{font-size:7px;color:#9da8b5;font-weight:900}.afdHQKey182 b{font-size:7px;color:#d7b7ff;letter-spacing:.3px;text-align:center}.afdHQKey182 button{width:48px;height:44px!important;border:1px solid #87919d;border-radius:16px!important;background:linear-gradient(#46515e,#171c22);color:#fff;font-size:25px!important;font-weight:1000;line-height:1;box-shadow:inset 0 1px #ffffff55,0 2px 5px #000}.afdHQKey182 button:hover{filter:brightness(1.12)}.afdHQKey182 button:active{transform:translateY(1px);filter:brightness(1.3)}.afdHQKey182 strong{width:48px;height:38px;display:grid;place-items:center;border:1px solid #6a527e;border-radius:14px;background:#050609;color:#f2d9ff;font-size:14px;font-variant-numeric:tabular-nums;cursor:pointer}.afdKeyCtl176,#afdMasterKeyWrap181>.afdHQKey181{display:none!important}@media(max-width:1100px){#afdMasterKeyWrap182{grid-template-columns:58px minmax(0,1fr) 58px!important;gap:5px!important}.afdHQKey182 button,.afdHQKey182 strong{width:42px}}'}
function labelCross(){const c=doc?.getElementById('cross'),wrap=c?.closest('.cross');if(!c||!wrap)return;const labels=[...wrap.children].filter(x=>x!==c&&x.tagName!=='INPUT');if(labels.length>=2){labels[0].textContent='B';labels[labels.length-1].textContent='A'}c.title='שמאל: Deck B • ימין: Deck A'}
function bindMixer(){const cross=doc.getElementById('cross');if(cross&&!cross.dataset.afd182){cross.dataset.afd182='1';mix=clamp((+cross.value||0)/100,0,1);['input','change'].forEach(ev=>cross.addEventListener(ev,e=>{e.stopImmediatePropagation();fadeOverride=null;mix=clamp((+cross.value||0)/100,0,1);const vc=doc.getElementById('videoCross');if(vc)vc.value=cross.value;resume().then(()=>apply(true))},true))}['afdMasterVolume','gainA','gainB','afdEqBassA','afdEqMidA','afdEqTrebleA','afdEqBassB','afdEqMidB','afdEqTrebleB'].forEach(id=>{const e=doc.getElementById(id);if(e&&!e.dataset.afd182){e.dataset.afd182='1';['input','change'].forEach(ev=>e.addEventListener(ev,x=>{x.stopImmediatePropagation();resume()},true))}});if(!doc.documentElement.dataset.afdResume182){doc.documentElement.dataset.afdResume182='1';doc.addEventListener('pointerdown',resume,{capture:true,passive:true})}['A','B'].forEach(k=>{const v=doc.getElementById('vid'+k);if(v&&!v.dataset.afd182){v.dataset.afd182='1';v.addEventListener('play',()=>resume());v.addEventListener('loadedmetadata',()=>setTone(k,0,false))}});labelCross()}
function sourcePlaying(k){const v=doc.getElementById('vid'+k),native=!!(v&&(v.currentSrc||v.src)&&!v.paused&&!v.ended),yt=!!window.AFDYouTubeState?.isPlaying?.(k),sp=!!window.AFDSpotifyState?.isPlaying?.(k);return native||yt||sp}
function startDeck(k){const v=doc.getElementById('vid'+k),root=doc.querySelector('.deck'+k),b=root?.querySelector('[data-act="play"],.transport .play');if(doc.getElementById('ytDeck'+k)||doc.getElementById('afdSP105Deck'+k)){b?.click();return}if(v?.src){v.play().catch(()=>b?.click())}else b?.click()}
function bindMixButton(){const old=doc.getElementById('afdMixBtn');if(!old)return;if(old.dataset.afd182)return;const b=old.cloneNode(true);old.replaceWith(b);b.dataset.afd182='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(busy)return;resume();const pa=sourcePlaying('A'),pb=sourcePlaying('B'),from=pa&&!pb?'A':pb&&!pa?'B':mix>=.5?'A':'B',to=from==='A'?'B':'A';startDeck(to);busy=true;b.classList.add('on');const startA=from==='A'?1:0,startB=from==='B'?1:0,endA=to==='A'?1:0,endB=to==='B'?1:0,startCross=mix*100,endCross=to==='A'?100:0,t0=performance.now(),dur=2000;const tick=t=>{const p=Math.min(1,(t-t0)/dur),q=p*p*(3-2*p);fadeOverride={A:startA+(endA-startA)*q,B:startB+(endB-startB)*q};mix=clamp((startCross+(endCross-startCross)*q)/100,0,1);const c=doc.getElementById('cross');if(c)c.value=String(mix*100);const vc=doc.getElementById('videoCross');if(vc)vc.value=String(mix*100);apply(true);if(p<1)W.requestAnimationFrame(tick);else{fadeOverride=null;mix=to==='A'?1:0;apply(true);busy=false;b.classList.remove('on')}};W.requestAnimationFrame(tick)},true)}
function install(){let d;try{d=frame()?.contentDocument}catch(e){return}if(!d?.documentElement)return;if(doc&&doc!==d){try{ctx?.close()}catch(e){}ctx=null;nodes={};graphPromise=null;lastPublished=-1;signalsmithReady=false}doc=d;W=d.defaultView;killOldCore(d);styleUI();addMasterToneUI();bindMixer();bindMixButton();apply()}
function refresh(){install()}
const api={refresh,setTone,changeTone,getTone:d=>key[d]||0};window.__afdWin182=api;window.__afdWin181=api;window.__afdWin176=api;
frame()?.addEventListener('load',()=>setTimeout(install,80));install();setTimeout(install,350);setTimeout(install,1200);setInterval(()=>{install();apply()},1200);
})();