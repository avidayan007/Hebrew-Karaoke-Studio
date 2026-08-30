(()=>{
 const fr=()=>document.getElementById('console'),D=()=>{try{return fr()?.contentDocument||null}catch(e){return null}};
 function run(){const d=D();if(!d||d.documentElement.dataset.afdRow133)return;const A=d.querySelector('.deckA'),B=d.querySelector('.deckB');if(!A||!B)return;d.documentElement.dataset.afdRow133='1';
 let s=d.createElement('style');s.id='afdRow133Style';s.textContent=`
 .deck .eq,.deck .knob,.deck .knobWrap,.deck .jog{display:none!important}.deck .screenRow{grid-template-columns:1fr!important;height:205px!important}.deck .screenRow>.side,.deck .screenRow>.eq{display:none!important}
 .deck .time{margin:4px 0 5px!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:2px 6px!important}.deck .time input{grid-column:1/-1!important;height:16px!important;margin:0!important}.deck .time b{font-size:11px!important}.deck .time small{font-size:6px!important}
 .afdDeckMixer132{margin-top:4px!important;display:grid!important;grid-template-columns:repeat(5,minmax(34px,1fr)) 25px!important;gap:4px!important;padding:4px!important;align-items:end!important}.afdStrip132{height:104px!important}.afdStrip132 input{width:78px!important;height:24px!important;margin:27px -22px 21px!important}.afdVu132{height:92px!important}.deck .lower{grid-template-columns:1fr!important;gap:3px!important}.deck .transport{grid-template-columns:repeat(5,1fr)!important}.deck .transport button{height:34px!important}.masterScreen{width:min(100%,365px)!important;aspect-ratio:4/3!important}
 `;d.head.appendChild(s);
 ['A','B'].forEach(deck=>{const root=d.querySelector('.deck'+deck),screen=root?.querySelector('.screenRow'),time=root?.querySelector('.time'),box=root?.querySelector('.afdDeckMixer132');if(screen&&time)screen.insertAdjacentElement('afterend',time);if(box){const wanted=['afdEqBass'+deck,'afdEqMid'+deck,'afdEqTreble'+deck,'gain'+deck,'pitch'+deck];wanted.forEach(id=>{const input=d.getElementById(id);let strip=input?.closest('.afdStrip132');if(strip)box.appendChild(strip)});const vu=box.querySelector('.afdVu132');if(vu)box.appendChild(vu)}});
 }
 fr()?.addEventListener('load',()=>setTimeout(run,700));setTimeout(run,900);setTimeout(run,1800);
})();