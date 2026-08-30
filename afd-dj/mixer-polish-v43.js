(()=>{
 const frame=()=>document.getElementById('console');
 const doc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
 function ytFrame(d,deck){return d.getElementById('ytDeck'+deck)}
 function ytCmd(d,deck,func,args=[]){const f=ytFrame(d,deck);if(!f)return false;try{f.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'*');return true}catch(e){return false}}
 function mix(d){
   const x=Math.max(0,Math.min(1,+(d.getElementById('cross')?.value||50)/100));
   const ga=Math.max(0,Math.min(1,+(d.getElementById('gainA')?.value||100)/100));
   const gb=Math.max(0,Math.min(1,+(d.getElementById('gainB')?.value||100)/100));
   // AFD layout: LEFT = Deck B, RIGHT = Deck A.
   const vb=gb*Math.cos(x*Math.PI/2),va=ga*Math.sin(x*Math.PI/2);
   const a=Math.round(100*va),b=Math.round(100*vb);
   ytCmd(d,'A','setVolume',[a]);ytCmd(d,'B','setVolume',[b]);
   const ma=d.getElementById('vidA'),mb=d.getElementById('vidB');
   if(ma){ma.volume=Math.max(0,Math.min(1,va));ma.muted=false}
   if(mb){mb.volume=Math.max(0,Math.min(1,vb));mb.muted=false}
   d.querySelectorAll('.masterScreen video').forEach(v=>v.muted=true);
   const ra=d.getElementById('afdVolReadA'),rb=d.getElementById('afdVolReadB');if(ra)ra.textContent=Math.round(ga*100)+'%';if(rb)rb.textContent=Math.round(gb*100)+'%';
 }
 function wireTransport(d){
   if(d.documentElement.dataset.afdYTTransport48)return;d.documentElement.dataset.afdYTTransport48='1';
   d.addEventListener('click',e=>{
     const b=e.target.closest?.('[data-act]');if(!b)return;const deck=(b.dataset.d||'').toUpperCase(),act=(b.dataset.act||'').toLowerCase();if(!['A','B'].includes(deck)||!ytFrame(d,deck))return;
     if(act==='play'){e.preventDefault();e.stopImmediatePropagation();const state=b.dataset.afdPlaying==='1';ytCmd(d,deck,state?'pauseVideo':'playVideo');b.dataset.afdPlaying=state?'0':'1';b.classList.toggle('active',!state)}
     if(act==='cue'){ytCmd(d,deck,'pauseVideo');ytCmd(d,deck,'seekTo',[0,true]);b.dataset.afdPlaying='0'}
   },true);
 }
 function style(d){
   ['afdMixerPolishV43','afdMixerPolishV44','afdMixerPolishV46','afdMixerPolishV48','afdMixerPolishV52','afdMixerPolishV53'].forEach(id=>d.getElementById(id)?.remove());
   const s=d.createElement('style');s.id='afdMixerPolishV53';s.textContent=`
    .screenRow>.eq{display:none!important}.screenRow{grid-template-columns:42px minmax(0,1fr)!important}
    .mixer .chKnobs{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:4px!important;min-height:92px!important;align-items:start!important}
    .mixer .chKnobs>.knob,.mixer .chKnobs>.knobWrap{display:none!important}
    .mixer .afdEqSlider{height:92px!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:1px!important;overflow:hidden!important}
    .mixer .afdEqSlider b{font-size:6px!important;line-height:9px!important;color:#c3ccd6!important}.mixer .afdEqSlider small{font-size:6px!important;line-height:8px!important;color:#8c98a5!important}
    .mixer .afdEqSlider input,.mixer .fader input{-webkit-appearance:none!important;appearance:none!important;writing-mode:horizontal-tb!important;direction:ltr!important;transform:rotate(-90deg)!important;transform-origin:center!important;background:transparent!important;padding:0!important;touch-action:none!important}
    .mixer .afdEqSlider input{width:66px!important;height:24px!important;margin:21px -21px!important}
    .mixer .fader{height:132px!important;min-height:132px!important;margin:2px 0 0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:2px!important;overflow:hidden!important}
    .mixer .fader:before{content:'VOLUME';font-size:7px!important;font-weight:900!important;color:#d0d7df!important;line-height:10px!important}
    .mixer .fader input{width:104px!important;height:30px!important;margin:37px -37px 35px!important}
    .mixer .afdEqSlider input::-webkit-slider-runnable-track,.mixer .fader input::-webkit-slider-runnable-track{height:7px!important;border-radius:5px!important;background:linear-gradient(#7d8791,#1e2329)!important;border:1px solid #080a0d!important}
    .mixer .afdEqSlider input::-webkit-slider-thumb,.mixer .fader input::-webkit-slider-thumb{-webkit-appearance:none!important;width:17px!important;height:28px!important;margin-top:-11px!important;border-radius:3px!important;border:1px solid #dce1e6!important;background:linear-gradient(90deg,#252a30,#a8afb7 25%,#f0f2f4 45%,#626b74 55%,#e7eaed 70%,#22272d)!important;box-shadow:0 2px 4px #000!important}
    .afdVolRead{font-size:7px!important;font-weight:900!important;color:#e2e7ec!important;line-height:9px!important}
    .mixer .channel{overflow:hidden!important;min-height:246px!important}
   `;d.head.appendChild(s);
   const mixer=d.querySelector('.mixer'),channels=[...d.querySelectorAll('.mixer .channel')],vu=mixer?.querySelector('.vu');
   ['A','B'].forEach((deck,i)=>{
     const panel=d.getElementById('vid'+deck)?.closest('.panel'),side=panel?.querySelector('.eq'),target=channels[i]?.querySelector('.chKnobs');
     if(side&&target){['Bass','Mid','Treble'].forEach(k=>{const el=d.getElementById('afdEq'+k+deck)?.closest('.afdEqSlider');if(el)target.appendChild(el)});side.innerHTML=''}
     const g=d.getElementById('gain'+deck),f=g?.closest('.fader');if(g&&f){g.min=0;g.max=100;g.step=1;if(!Number.isFinite(+g.value)||+g.value<0||+g.value>100)g.value=100;let r=d.getElementById('afdVolRead'+deck);if(!r){r=d.createElement('div');r.id='afdVolRead'+deck;r.className='afdVolRead';f.appendChild(r)}g.addEventListener('input',()=>mix(d),{passive:true});g.addEventListener('change',()=>mix(d),{passive:true})}
     const m=d.getElementById('vid'+deck);if(m&&!m.dataset.afdVol61){m.dataset.afdVol61='1';m.addEventListener('loadedmetadata',()=>mix(d),{passive:true});m.addEventListener('play',()=>mix(d),{passive:true})}
   });
   if(mixer&&vu&&channels.length>=2){mixer.insertBefore(channels[1],vu);mixer.insertBefore(channels[0],vu.nextSibling)}
   const cross=d.getElementById('cross');if(cross&&!cross.dataset.afdMix53){cross.dataset.afdMix53='1';cross.addEventListener('input',()=>mix(d),{passive:true});cross.addEventListener('change',()=>mix(d),{passive:true})}
   wireTransport(d);mix(d);
 }
 function run(){const d=doc();if(d?.head)style(d)}
 frame()?.addEventListener('load',()=>setTimeout(run,120));setTimeout(run,220);setTimeout(run,800);setTimeout(run,1600);
})();