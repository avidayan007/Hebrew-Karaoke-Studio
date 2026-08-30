(()=>{
 const $=id=>document.getElementById(id), frame=()=>$('console');
 const HKEY='afdConsoleHeightV60', SKEY='afdScreenSizesV60';
 let sizes={};try{sizes=JSON.parse(localStorage.getItem(SKEY)||'{}')||{}}catch(e){sizes={}};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function saveSizes(){localStorage.setItem(SKEY,JSON.stringify(sizes))}
 function addParentDivider(){if(window.AFD_LAYOUT_LOCKED)return;
  const f=frame(),dock=document.querySelector('.dock');if(!f||!dock||document.getElementById('afdMainDivider'))return;
  const saved=+localStorage.getItem(HKEY);if(saved>400)f.style.height=saved+'px';dock.style.marginTop='0';
  const bar=document.createElement('div');bar.id='afdMainDivider';bar.title='גרור למעלה/למטה כדי לשנות את גובה החלק העליון';bar.innerHTML='<span>⋮⋮ גרור לגובה ⋮⋮</span>';
  const st=document.createElement('style');st.id='afdDividerStyle';st.textContent=`#afdMainDivider{height:12px;margin:0;background:linear-gradient(#252c35,#090c10);border-top:1px solid #66717d;border-bottom:1px solid #343c45;cursor:ns-resize;display:grid;place-items:center;position:relative;z-index:20;touch-action:none;user-select:none}#afdMainDivider span{font-size:8px;color:#9aa6b3;letter-spacing:2px;pointer-events:none}.dock{margin-top:0!important}`;document.head.appendChild(st);f.insertAdjacentElement('afterend',bar);
  let sy=0,sh=0,drag=false,lastH=0,raf=0;const move=e=>{if(!drag)return;lastH=clamp(sh+(e.clientY-sy),430,850);if(!raf)raf=requestAnimationFrame(()=>{raf=0;f.style.height=lastH+'px';f.style.minHeight=lastH+'px'});e.preventDefault?.()};const up=()=>{drag=false;if(lastH)localStorage.setItem(HKEY,String(Math.round(lastH)))};bar.addEventListener('pointerdown',e=>{drag=true;sy=e.clientY;sh=f.getBoundingClientRect().height;lastH=sh;bar.setPointerCapture?.(e.pointerId);e.preventDefault()});bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',up);bar.addEventListener('pointercancel',up)
 }
 function deckDoc(){try{return frame()?.contentDocument||null}catch(e){return null}}
 function fixCrossLabels(d){const cross=d.querySelector('.master .cross');if(!cross)return;const kids=[...cross.children];if(kids.length>=3){kids[0].textContent='B';kids[kids.length-1].textContent='A'}}
 function startDeck(d,deck){const m=d.getElementById('vid'+deck);if(m?.paused)m.play().catch(()=>{});else if(!m){const b=d.querySelector(`[data-act="play"][data-d="${deck}"]`);b?.click()}}
 function wireMix(d){const b=d.getElementById('afdMixBtn');if(!b||b.dataset.afd60)return;b.dataset.afd60='1';b.textContent='MIX B ↔ A';const cross=d.getElementById('cross'),video=d.getElementById('videoCross')||d.querySelector('.master .cross input[type=range]');b.onclick=()=>{if(b.dataset.mixing==='1')return;const from=+(cross?.value||50),to=from<50?100:0,target=to===100?'B':'A';startDeck(d,target);b.dataset.mixing='1';b.classList.add('on');const start=performance.now(),dur=6000;const tick=now=>{const t=Math.min(1,(now-start)/dur),v=from+(to-from)*t;if(cross){cross.value=v;cross.dispatchEvent(new Event('input',{bubbles:true}))}if(video&&video!==cross){video.value=v;video.dispatchEvent(new Event('input',{bubbles:true}))}if(t<1)requestAnimationFrame(tick);else{b.dataset.mixing='0';b.classList.remove('on')}};requestAnimationFrame(tick)}}
 function addScreenControls(d){if(window.AFD_LAYOUT_LOCKED)return;}
 function applyInner(){const d=deckDoc();if(!d)return;fixCrossLabels(d);wireMix(d);addScreenControls(d)}
 function run(){addParentDivider();applyInner()}
 frame()?.addEventListener('load',()=>{setTimeout(run,250);setTimeout(run,900)});setTimeout(run,500);setTimeout(run,1400);
})();