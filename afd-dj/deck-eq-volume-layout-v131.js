(()=>{
 const frame=()=>document.getElementById('console');
 const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
 function install(){
  const d=D();if(!d?.head)return;
  if(!d.getElementById('afdDeckStrip131Style')){
   const s=d.createElement('style');s.id='afdDeckStrip131Style';s.textContent=`
    .afdDeckStrip131{margin-top:7px;padding:7px;border:1px solid #424a54;border-radius:6px;background:linear-gradient(#11161c,#07090d);box-shadow:inset 0 1px #ffffff18;display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;min-height:0!important;overflow:visible!important}
    .afdDeckStrip131 h4{grid-column:1/-1;margin:0 0 2px!important;font-size:8px!important;line-height:10px!important;text-align:left!important;color:#aeb8c4!important;letter-spacing:.5px}
    .afdDeckStrip131 .chKnobs{display:grid!important;grid-template-columns:1fr!important;gap:3px!important;min-height:0!important}
    .afdDeckStrip131 .afdEqSlider{height:auto!important;min-height:0!important;display:grid!important;grid-template-columns:34px 1fr 30px!important;align-items:center!important;gap:3px!important;overflow:visible!important}
    .afdDeckStrip131 .afdEqSlider b{font-size:6px!important;line-height:9px!important;color:#c8d0da!important;text-transform:uppercase}
    .afdDeckStrip131 .afdEqSlider small{font-size:6px!important;line-height:9px!important;color:#8e99a6!important;text-align:right!important}
    .afdDeckStrip131 .afdEqSlider input,.afdDeckStrip131 .fader input{-webkit-appearance:none!important;appearance:none!important;writing-mode:horizontal-tb!important;direction:ltr!important;transform:none!important;width:100%!important;height:18px!important;margin:0!important;background:transparent!important;touch-action:none!important}
    .afdDeckStrip131 .afdEqSlider input::-webkit-slider-runnable-track,.afdDeckStrip131 .fader input::-webkit-slider-runnable-track{height:5px!important;border-radius:4px!important;background:linear-gradient(#747e88,#1b2026)!important;border:1px solid #07090b!important}
    .afdDeckStrip131 .afdEqSlider input::-webkit-slider-thumb,.afdDeckStrip131 .fader input::-webkit-slider-thumb{-webkit-appearance:none!important;width:13px!important;height:19px!important;margin-top:-8px!important;border-radius:3px!important;border:1px solid #dce2e7!important;background:linear-gradient(90deg,#24292f,#d7dde2 48%,#555e67 53%,#eceff1 72%,#20252a)!important;box-shadow:0 1px 3px #000!important}
    .afdDeckStrip131 .fader{height:auto!important;min-height:0!important;margin:0!important;display:grid!important;grid-template-columns:42px 1fr 32px!important;align-items:center!important;gap:4px!important;overflow:visible!important}
    .afdDeckStrip131 .fader:before{content:'VOLUME';font-size:6px!important;font-weight:900!important;color:#d5dbe1!important;line-height:9px!important}
    .afdDeckStrip131 .afdVolRead{font-size:6px!important;font-weight:900!important;color:#e5e9ed!important;line-height:9px!important;text-align:right!important}
    .deckA .afdDeckStrip131{border-color:#704ba5!important;box-shadow:inset 0 1px #ffffff18,0 0 10px #7543b833!important}
    .deckB .afdDeckStrip131{border-color:#286d95!important;box-shadow:inset 0 1px #ffffff18,0 0 10px #238fd033!important}
    .center .mixer>.channel{display:none!important}
   `;d.head.appendChild(s)
  }
  ['A','B'].forEach(deck=>{
   const gain=d.getElementById('gain'+deck),channel=gain?.closest('.channel');
   const panel=d.querySelector('.deck'+deck)||d.getElementById('vid'+deck)?.closest('.panel');
   const transport=panel?.querySelector('.transport');
   if(!channel||!panel||!transport)return;
   channel.classList.add('afdDeckStrip131');
   channel.dataset.afdDeck=deck;
   const host=transport.parentElement;
   if(host&&channel.parentElement!==host)transport.insertAdjacentElement('afterend',channel);
   const h=channel.querySelector('h4');if(h)h.textContent='DECK '+deck+' • EQ / VOLUME';
  });
 }
 frame()?.addEventListener('load',()=>{setTimeout(install,250);setTimeout(install,900)});
 setTimeout(install,500);setInterval(install,1800);
})();