(()=>{
 const fr=()=>document.getElementById('console'),D=()=>{try{return fr()?.contentDocument||null}catch(e){return null}};
 function install(){const d=D();if(!d||d.documentElement.dataset.afdCompact132)return;
  const A=d.querySelector('.deckA'),B=d.querySelector('.deckB');if(!A||!B)return;d.documentElement.dataset.afdCompact132='1';
  let st=d.getElementById('afdCompact132Style');if(!st){st=d.createElement('style');st.id='afdCompact132Style';d.head.appendChild(st)}
  st.textContent=`
  .deck .jog{display:none!important}.deck .lower{grid-template-columns:1fr 72px!important;gap:6px!important;align-items:start!important}.deck .lower>.jog{display:none!important}
  .deck .transport{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:4px!important}.deck .transport button{height:38px!important;min-width:0!important;font-size:8px!important;padding:2px!important}
  .afdDeckMixer132{margin-top:6px;display:grid;grid-template-columns:repeat(5,38px) 28px;justify-content:center;gap:5px;align-items:end;padding:6px;border:1px solid #3e4650;border-radius:5px;background:linear-gradient(#11161d,#05070a)}
  .afdStrip132{height:126px;display:flex;flex-direction:column;align-items:center;gap:3px;overflow:hidden}.afdStrip132 b{font-size:6px;line-height:9px;color:#c8d0da}.afdStrip132 input{-webkit-appearance:none!important;appearance:none!important;writing-mode:horizontal-tb!important;direction:ltr!important;transform:rotate(-90deg)!important;width:92px!important;height:26px!important;margin:33px -27px 28px!important;background:transparent!important;touch-action:none!important}.afdStrip132 input::-webkit-slider-runnable-track{height:7px!important;border-radius:5px!important;background:linear-gradient(#78828c,#171c22)!important;border:1px solid #050608!important}.afdStrip132 input::-webkit-slider-thumb{-webkit-appearance:none!important;width:16px!important;height:26px!important;margin-top:-10px!important;border-radius:3px!important;border:1px solid #e2e6ea!important;background:linear-gradient(90deg,#282d33,#d8dde1 45%,#5e6871 55%,#eee)!important}
  .afdVu132{height:112px;display:flex;flex-direction:column-reverse;gap:2px;padding:2px;border:1px solid #303740;background:#030405;border-radius:3px}.afdVu132 i{width:12px;height:4px;background:#17351e;border-radius:1px}.afdVu132 i.on{background:#49ef6d;box-shadow:0 0 4px #49ef6d}.afdVu132 i.hot.on{background:#ffd05a;box-shadow:0 0 4px #ffd05a}
  .center .mixer{display:none!important}.masterScreen{width:min(100%,390px)!important;aspect-ratio:4/3!important;height:auto!important;margin-left:auto!important;margin-right:auto!important}
  `;
  ['A','B'].forEach(deck=>{const root=d.querySelector('.deck'+deck),tr=root?.querySelector('.transport');if(!root||!tr)return;
   const sync=tr.querySelector('[data-act="sync"]'),pause=tr.querySelector('.afdPause109'),stop=tr.querySelector('.afdStop109');if(sync&&pause)sync.after(pause);if(pause&&stop)pause.after(stop);
   let box=root.querySelector('.afdDeckMixer132');if(!box){box=d.createElement('div');box.className='afdDeckMixer132';const lower=root.querySelector('.lower');lower?.insertAdjacentElement('afterend',box)}
   const ids=[['LOW','afdEqBass'+deck],['MID','afdEqMid'+deck],['HIGH','afdEqTreble'+deck],['VOL','gain'+deck]];
   ids.forEach(([label,id])=>{const input=d.getElementById(id);if(!input)return;let strip=input.closest('.afdStrip132');if(!strip){strip=d.createElement('div');strip.className='afdStrip132';const lab=d.createElement('b');lab.textContent=label;strip.appendChild(lab);strip.appendChild(input)}box.appendChild(strip)});
   let pitch=d.getElementById('pitch'+deck);if(pitch){let strip=pitch.closest('.afdStrip132');if(!strip){strip=d.createElement('div');strip.className='afdStrip132';const lab=d.createElement('b');lab.textContent='PITCH';strip.append(lab,pitch)}box.appendChild(strip)}
   let vu=box.querySelector('.afdVu132');if(!vu){vu=d.createElement('div');vu.className='afdVu132';for(let i=0;i<18;i++){const q=d.createElement('i');if(i>13)q.className='hot';vu.appendChild(q)}box.appendChild(vu)}
   const media=d.getElementById('vid'+deck);const tick=()=>{if(!vu.isConnected)return;const active=media&&!media.paused?Math.floor(8+Math.random()*10):1;[...vu.children].forEach((x,i)=>x.classList.toggle('on',i<active));requestAnimationFrame(tick)};requestAnimationFrame(tick);
  });
 }
 fr()?.addEventListener('load',()=>setTimeout(install,500));setTimeout(install,700);setTimeout(install,1600);
})();