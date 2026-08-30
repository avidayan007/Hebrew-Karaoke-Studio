(()=>{
 const fr=()=>document.getElementById('console'),D=()=>{try{return fr()?.contentDocument||null}catch(e){return null}};
 function run(){const d=D();if(!d||d.documentElement.dataset.afdRow134)return;if(!d.querySelector('.deckA')||!d.querySelector('.deckB'))return;d.documentElement.dataset.afdRow134='1';
  let s=d.createElement('style');s.id='afdRow134Style';s.textContent=`
  .deck .jog,.deck .eq,.deck .knob,.deck .knobWrap{display:none!important}
  .deck .lower{display:block!important}.deck .lower>div:first-child{width:100%!important}.deck .lower>.pitch{display:none!important}
  .deck .transport{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:4px!important;margin-bottom:4px!important}.deck .transport button{height:34px!important;min-width:0!important;font-size:8px!important;padding:2px!important}
  .afdDeckMixer132{width:100%!important;margin:0!important;display:grid!important;grid-template-columns:repeat(5,minmax(38px,1fr)) 26px!important;gap:4px!important;align-items:end!important;justify-content:stretch!important;padding:5px!important;border:1px solid #3d454f!important;border-radius:5px!important;background:linear-gradient(#11161c,#05070a)!important}
  .afdStrip132{height:112px!important;min-width:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:2px!important;overflow:hidden!important}.afdStrip132 b{font-size:6px!important;line-height:9px!important;color:#cbd3dc!important}.afdStrip132 input{-webkit-appearance:none!important;appearance:none!important;writing-mode:horizontal-tb!important;direction:ltr!important;transform:rotate(-90deg)!important;width:84px!important;height:24px!important;margin:30px -24px 23px!important;background:transparent!important;touch-action:none!important}.afdStrip132 input::-webkit-slider-runnable-track{height:7px!important;border-radius:5px!important;background:linear-gradient(#7c8690,#171b21)!important;border:1px solid #050607!important}.afdStrip132 input::-webkit-slider-thumb{-webkit-appearance:none!important;width:16px!important;height:26px!important;margin-top:-10px!important;border-radius:3px!important;border:1px solid #e4e7ea!important;background:linear-gradient(90deg,#282d33,#dce1e5 45%,#606a73 56%,#eff1f3)!important}
  .afdVu132{height:99px!important;margin-bottom:3px!important;display:flex!important;flex-direction:column-reverse!important;gap:2px!important;padding:2px!important;border:1px solid #303740!important;background:#030405!important;border-radius:3px!important}.afdVu132 i{width:12px!important;height:4px!important}
  .deck .time{margin:4px 0!important}.deck .screenRow{height:205px!important}
  `;d.head.appendChild(s);
  ['A','B'].forEach(deck=>{const root=d.querySelector('.deck'+deck),tr=root?.querySelector('.transport'),holder=tr?.parentElement,box=root?.querySelector('.afdDeckMixer132');if(!root||!tr||!holder||!box)return;
   const sync=tr.querySelector('[data-act="sync"]'),pause=tr.querySelector('.afdPause109'),stop=tr.querySelector('.afdStop109');if(sync&&pause)sync.after(pause);if(pause&&stop)pause.after(stop);
   tr.insertAdjacentElement('afterend',box);
   [['LOW','afdEqBass'+deck],['MID','afdEqMid'+deck],['HIGH','afdEqTreble'+deck],['VOL','gain'+deck],['PITCH','pitch'+deck]].forEach(([label,id])=>{const input=d.getElementById(id);if(!input)return;let strip=input.closest('.afdStrip132');if(!strip){strip=d.createElement('div');strip.className='afdStrip132';const b=d.createElement('b');b.textContent=label;strip.append(b,input)}else{const b=strip.querySelector('b');if(b)b.textContent=label}box.appendChild(strip)});
   const vu=box.querySelector('.afdVu132');if(vu)box.appendChild(vu);
  });
 }
 fr()?.addEventListener('load',()=>setTimeout(run,850));setTimeout(run,1000);setTimeout(run,1900);
})();