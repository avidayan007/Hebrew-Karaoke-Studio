(()=>{
 const fr=()=>document.getElementById('console'),D=()=>{try{return fr()?.contentDocument||null}catch(e){return null}};
 function install(){const d=D();if(!d||d.documentElement.dataset.afdMix136)return;const cross=d.getElementById('cross');if(!cross)return;d.documentElement.dataset.afdMix136='1';
  const media=k=>d.getElementById('vid'+k),playing=k=>{const v=media(k);return !!(v&&!v.paused&&!v.ended)};
  function start(k){const v=media(k),panel=v?.closest('.panel')||d.querySelector('.deck'+k),btn=panel?.querySelector('[data-act="play"]');if(v?.src&&v.paused){v.play().catch(()=>btn?.click());return}if(btn&&!playing(k))btn.click()}
  function set(v){cross.value=String(v);cross.dispatchEvent(new Event('input',{bubbles:true}));cross.dispatchEvent(new Event('change',{bubbles:true}));const vc=d.getElementById('videoCross');if(vc&&vc!==cross){vc.value=String(v);vc.dispatchEvent(new Event('input',{bubbles:true}));vc.dispatchEvent(new Event('change',{bubbles:true}))}}
  function currentSide(){if(playing('A')&&!playing('B'))return'A';if(playing('B')&&!playing('A'))return'B';return (+cross.value>=50)?'A':'B'}
  let busy=false;
  function go(){if(busy)return;const fromDeck=currentSide(),toDeck=fromDeck==='A'?'B':'A',from=+cross.value||0,to=toDeck==='A'?100:0;start(toDeck);busy=true;const b=d.getElementById('afdMixBtn');b?.classList.add('on');const t0=performance.now(),dur=6000;function tick(now){const t=Math.min(1,(now-t0)/dur),e=t*t*(3-2*t);set(from+(to-from)*e);if(t<1)requestAnimationFrame(tick);else{busy=false;b?.classList.remove('on')}}requestAnimationFrame(tick)}
  let old=d.getElementById('afdMixBtn');if(old){const n=old.cloneNode(true);old.replaceWith(n);n.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();go()}}
  d.defaultView.AFDDoMix136=go;
 }
 fr()?.addEventListener('load',()=>setTimeout(install,900));setTimeout(install,1100);setTimeout(install,2100);
})();