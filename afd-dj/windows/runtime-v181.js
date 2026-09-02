(()=>{
if(window.__afdWin181){window.__afdWin181.refresh();return;}
const frame=()=>document.getElementById('console');
let doc=null,W=null,ctx=null,nodes={},graphPromise=null,key={A:0,B:0},mix=.5,fadeOverride=null,busy=false,lastPublished=-1,workletLoaded=false;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const val=(id,def)=>{const e=doc?.getElementById(id);return e?+e.value:def};
const status=t=>{const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD HQ KEY/MIX 181]',t)};
function killOldCore(d){if(d?.documentElement)d.documentElement.dataset.afd156='1'}
async function addSoundTouchWorklet(){
 if(workletLoaded)return true;
 if(!ctx?.audioWorklet)return false;
 const source=String(window.__afdSoundTouchWorkletSource||'');
 if(!source){console.warn('AFD SoundTouch worklet source missing');return false}
 try{
  const blob=new W.Blob([source],{type:'application/javascript'}),url=W.URL.createObjectURL(blob);
  try{await ctx.audioWorklet.addModule(url)}finally{W.URL.revokeObjectURL(url)}
  workletLoaded=true;return true;
 }catch(e){console.warn('AFD SoundTouch worklet unavailable',e);return false}
}
function factors(k){if(fadeOverride)return fadeOverride[k];return k==='A'?mix:1-mix}
function applyVideoMix(){if(!doc)return;const a=String(clamp(mix,0,1)),b=String(clamp(1-mix,0,1));['masterA','ytMasterA'].forEach(id=>{const e=doc.getElementById(id);if(e)e.style.setProperty('opacity',a,'important')});['masterB','ytMasterB'].forEach(id=>{const e=doc.getElementById(id);if(e)e.style.setProperty('opacity',b,'important')})}
function publishCross(force=false){const p=Math.round(mix*1000)/10;if(!force&&p===lastPublished)return;lastPublished=p;try{window.dispatchEvent(new CustomEvent('afd-crossfader',{detail:{value:mix*100,a:mix,b:1-mix}}))}catch(e){}}
function setPitchParam(k){const n=nodes[k];if(!n?.pitch)return;const p=n.pitch.parameters.get('pitchSemitones');if(!p)return;try{p.setTargetAtTime(key[k],ctx.currentTime,.025)}catch(e){try{p.value=key[k]}catch(x){}}}
function apply(forcePublish=false){
 if(!doc)return;
 const master=clamp(val('afdMasterVolume',100)/100,0,1);
 ['A','B'].forEach(k=>{
  const v=doc.getElementById('vid'+k);if(!v)return;
  const deck=clamp(val('gain'+k,100)/100,0,1),level=clamp(master*deck*clamp(factors(k),0,1),0,1),n=nodes[k];
  try{v.preservesPitch=true;v.webkitPreservesPitch=true}catch(e){}
  v.muted=false;v.defaultMuted=false;
  if(n){v.volume=1;n.gain.gain.value=level;n.lo.gain.value=val('afdEqBass'+k,0);n.mid.gain.value=val('afdEqMid'+k,0);n.hi.gain.value=val('afdEqTreble'+k,0);setPitchParam(k)}else v.volume=level;
 });
 const r=doc.getElementById('afdMasterRead');if(r)r.textContent=Math.round(master*100)+'%';
 applyVideoMix();publishCross(forcePublish)
}
async function ensureGraph(){
 if(graphPromise)return graphPromise;
 graphPromise=(async()=>{
  if(ctx)return;
  const AC=W.AudioContext||W.webkitAudioContext;if(!AC)return;
  ctx=new AC({latencyHint:'interactive'});
  const hasPitch=await addSoundTouchWorklet();
  for(const k of ['A','B']){
   const v=doc.getElementById('vid'+k);if(!v)continue;
   try{
    const src=ctx.createMediaElementSource(v),lo=ctx.createBiquadFilter(),mid=ctx.createBiquadFilter(),hi=ctx.createBiquadFilter(),gain=ctx.createGain();
    lo.type='lowshelf';lo.frequency.value=250;mid.type='peaking';mid.frequency.value=1000;mid.Q.value=.8;hi.type='highshelf';hi.frequency.value=4000;
    src.connect(lo).connect(mid).connect(hi);
    let pitch=null;
    if(hasPitch){
      pitch=new W.AudioWorkletNode(ctx,'soundtouch-processor',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2]});
      hi.connect(pitch).connect(gain);
    }else hi.connect(gain);
    gain.connect(ctx.destination);nodes[k]={v,lo,mid,hi,pitch,gain};setPitchParam(k)
   }catch(e){console.warn('AFD HQ graph deck '+k,e)}
  }
  apply(true)
 })();
 try{await graphPromise}finally{graphPromise=null}
}
async function resume(){await ensureGraph();try{await ctx?.resume()}catch(e){}apply()}
function onlineSource(deck){return!!(doc?.getElementById('ytDeck'+deck)||doc?.getElementById('afdSP105Deck'+deck))}
function setTone(deck,n,announce=true){
 n=clamp(Math.round(Number(n)||0),-12,12);key[deck]=n;
 const read=doc?.getElementById('afdHQKeyRead'+deck);if(read)read.textContent=(n>0?'+':'')+n;
 resume().catch(()=>{});setPitchParam(deck);apply();
 if(announce)status('DECK '+deck+' • HQ KEY '+(n>0?'+':'')+n+' semitones')
}
function changeTone(deck,delta){if(onlineSource(deck)){status('HQ KEY • שינוי טון זמין לקבצים מקומיים בלבד');return}setTone(deck,key[deck]+delta)}
function makeKeyBox(deck){
 const c=doc.createElement('div');c.id='afdHQKey'+deck;c.className='afdHQKey181 afdHQKey'+deck;
 c.innerHTML='<small>DECK '+deck+'</small><b>HQ KEY</b><button data-k="1" title="העלה טון">＋</button><strong id="afdHQKeyRead'+deck+'">0</strong><button data-k="-1" title="הורד טון">−</button>';
 c.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();changeTone(deck,Number(b.dataset.k||0))}));
 c.querySelector('strong')?.addEventListener('click',()=>{if(!onlineSource(deck))setTone(deck,0)});
 return c
}
function addMasterToneUI(){
 const screen=doc?.querySelector('.masterScreen');if(!screen)return;
 let wrap=doc.getElementById('afdMasterKeyWrap181');
 if(!wrap){
  wrap=doc.createElement('div');wrap.id='afdMasterKeyWrap181';screen.parentElement.insertBefore(wrap,screen);
  const left=makeKeyBox('B'),right=makeKeyBox('A');wrap.appendChild(left);wrap.appendChild(screen);wrap.appendChild(right)
 }
 ['A','B'].forEach(k=>{const read=doc.getElementById('afdHQKeyRead'+k);if(read)read.textContent=(key[k]>0?'+':'')+key[k]})
}
function styleUI(){
 if(!doc?.head)return;let s=doc.getElementById('afdHQKeyStyle181');if(!s){s=doc.createElement('style');s.id='afdHQKeyStyle181';doc.head.appendChild(s)}
 s.textContent='#afdMasterKeyWrap181{display:grid!important;grid-template-columns:68px minmax(0,1fr) 68px!important;gap:8px!important;align-items:stretch!important;margin-top:7px!important}#afdMasterKeyWrap181>.masterScreen{margin-top:0!important;min-width:0!important}.afdHQKey181{height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:1px solid #645071;border-radius:7px;background:linear-gradient(#17121e,#080a0e 58%,#030406);box-shadow:inset 0 1px #ffffff2d,0 3px 7px #000;color:#fff;padding:6px}.afdHQKey181 small{font-size:7px;color:#9da8b5;font-weight:900}.afdHQKey181 b{font-size:8px;color:#d7b7ff;letter-spacing:.4px}.afdHQKey181 button{width:46px;height:42px!important;border:1px solid #87919d;border-radius:6px;background:linear-gradient(#424d59,#171c22);color:#fff;font-size:25px!important;font-weight:1000;line-height:1}.afdHQKey181 button:active{transform:translateY(1px);filter:brightness(1.25)}.afdHQKey181 strong{width:46px;height:38px;display:grid;place-items:center;border:1px solid #6a527e;border-radius:6px;background:#050609;color:#f2d9ff;font-size:14px;font-variant-numeric:tabular-nums;cursor:pointer}.afdKeyCtl176{display:none!important}@media(max-width:1100px){#afdMasterKeyWrap181{grid-template-columns:60px minmax(0,1fr) 60px!important;gap:5px!important}.afdHQKey181 button,.afdHQKey181 strong{width:40px}}'
}
function labelCross(){const c=doc?.getElementById('cross'),wrap=c?.closest('.cross');if(!c||!wrap)return;const labels=[...wrap.children].filter(x=>x!==c&&x.tagName!=='INPUT');if(labels.length>=2){labels[0].textContent='B';labels[labels.length-1].textContent='A'}c.title='שמאל: Deck B • ימין: Deck A'}
function bindMixer(){
 const cross=doc.getElementById('cross');if(cross&&!cross.dataset.afd181){cross.dataset.afd181='1';mix=clamp((+cross.value||0)/100,0,1);['input','change'].forEach(ev=>cross.addEventListener(ev,e=>{e.stopImmediatePropagation();fadeOverride=null;mix=clamp((+cross.value||0)/100,0,1);const vc=doc.getElementById('videoCross');if(vc)vc.value=cross.value;resume().then(()=>apply(true))},true))}
 ['afdMasterVolume','gainA','gainB','afdEqBassA','afdEqMidA','afdEqTrebleA','afdEqBassB','afdEqMidB','afdEqTrebleB'].forEach(id=>{const e=doc.getElementById(id);if(e&&!e.dataset.afd181){e.dataset.afd181='1';['input','change'].forEach(ev=>e.addEventListener(ev,x=>{x.stopImmediatePropagation();resume()},true))}});
 if(!doc.documentElement.dataset.afdResume181){doc.documentElement.dataset.afdResume181='1';doc.addEventListener('pointerdown',resume,{capture:true,passive:true})}
 ['A','B'].forEach(k=>{const v=doc.getElementById('vid'+k);if(v&&!v.dataset.afd181){v.dataset.afd181='1';v.addEventListener('play',()=>resume());v.addEventListener('loadedmetadata',()=>setTone(k,0,false))}});labelCross()
}
function sourcePlaying(k){const v=doc.getElementById('vid'+k),native=!!(v&&(v.currentSrc||v.src)&&!v.paused&&!v.ended),yt=!!window.AFDYouTubeState?.isPlaying?.(k),sp=!!window.AFDSpotifyState?.isPlaying?.(k);return native||yt||sp}
function startDeck(k){const v=doc.getElementById('vid'+k),root=doc.querySelector('.deck'+k),b=root?.querySelector('[data-act="play"],.transport .play');if(doc.getElementById('ytDeck'+k)||doc.getElementById('afdSP105Deck'+k)){b?.click();return}if(v?.src){v.play().catch(()=>b?.click())}else b?.click()}
function bindMixButton(){
 const old=doc.getElementById('afdMixBtn');if(!old)return;if(old.dataset.afd181)return;const b=old.cloneNode(true);old.replaceWith(b);b.dataset.afd181='1';
 b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(busy)return;resume();const pa=sourcePlaying('A'),pb=sourcePlaying('B'),from=pa&&!pb?'A':pb&&!pa?'B':mix>=.5?'A':'B',to=from==='A'?'B':'A';startDeck(to);busy=true;b.classList.add('on');const startA=from==='A'?1:0,startB=from==='B'?1:0,endA=to==='A'?1:0,endB=to==='B'?1:0,startCross=mix*100,endCross=to==='A'?100:0,t0=performance.now(),dur=2000;const tick=t=>{const p=Math.min(1,(t-t0)/dur),q=p*p*(3-2*p);fadeOverride={A:startA+(endA-startA)*q,B:startB+(endB-startB)*q};mix=clamp((startCross+(endCross-startCross)*q)/100,0,1);const c=doc.getElementById('cross');if(c)c.value=String(mix*100);const vc=doc.getElementById('videoCross');if(vc)vc.value=String(mix*100);apply(true);if(p<1)W.requestAnimationFrame(tick);else{fadeOverride=null;mix=to==='A'?1:0;apply(true);busy=false;b.classList.remove('on')}};W.requestAnimationFrame(tick)},true)
}
function install(){
 let d;try{d=frame()?.contentDocument}catch(e){return}if(!d?.documentElement)return;
 if(doc&&doc!==d){try{ctx?.close()}catch(e){}ctx=null;nodes={};graphPromise=null;lastPublished=-1;workletLoaded=false}
 doc=d;W=d.defaultView;killOldCore(d);styleUI();addMasterToneUI();bindMixer();bindMixButton();apply()
}
function refresh(){install()}
const api={refresh,setTone,changeTone,getTone:d=>key[d]||0};window.__afdWin181=api;window.__afdWin176=api;
frame()?.addEventListener('load',()=>setTimeout(install,80));install();setTimeout(install,350);setTimeout(install,1200);setInterval(()=>{install();apply()},1200);
})();