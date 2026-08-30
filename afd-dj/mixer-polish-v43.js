(()=>{
  const frame=()=>document.getElementById('console');
  const getDoc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};

  function ytCommand(d,deck,func,args=[]){
    const f=d.getElementById('ytDeck'+deck);if(!f)return;
    try{f.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'*')}catch(e){}
  }

  function applyYouTubeVolume(d){
    const cross=+(d.getElementById('cross')?.value||50)/100;
    const gainA=+(d.getElementById('gainA')?.value||100)/100;
    const gainB=+(d.getElementById('gainB')?.value||100)/100;
    ytCommand(d,'A','setVolume',[Math.max(0,Math.min(100,Math.round(Math.cos(cross*Math.PI/2)*100*gainA)))]);
    ytCommand(d,'B','setVolume',[Math.max(0,Math.min(100,Math.round(Math.sin(cross*Math.PI/2)*100*gainB)))]);
    const va=d.getElementById('afdVolReadA'),vb=d.getElementById('afdVolReadB');
    if(va)va.textContent=Math.round(gainA*100)+'%';if(vb)vb.textContent=Math.round(gainB*100)+'%';
  }

  function styleMixer(d){
    d.getElementById('afdMixerPolishV43')?.remove();d.getElementById('afdMixerPolishV44')?.remove();
    let st=d.getElementById('afdMixerPolishV46');
    if(!st){st=d.createElement('style');st.id='afdMixerPolishV46';d.head.appendChild(st)}
    st.textContent=`
      /* EQ no longer lives beside the deck screens */
      .screenRow>.eq{display:none!important}
      .screenRow{grid-template-columns:42px minmax(0,1fr)!important}

      /* Replace the three small mixer knobs with three real vertical faders */
      .mixer .chKnobs{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;align-items:start!important;min-height:116px!important}
      .mixer .chKnobs>.knob,.mixer .chKnobs>.knobWrap{display:none!important}
      .mixer .afdEqSlider{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:2px!important;min-width:0!important;height:116px!important;overflow:visible!important}
      .mixer .afdEqSlider b{font-size:6.5px!important;color:#bcc6d2!important;letter-spacing:.3px!important;line-height:1!important}
      .mixer .afdEqSlider small{font-size:6px!important;color:#8995a2!important;line-height:1!important}
      .mixer .afdEqSlider input[type=range],.mixer .fader input[type=range]{
        -webkit-appearance:none!important;appearance:none!important;writing-mode:horizontal-tb!important;direction:ltr!important;
        background:transparent!important;padding:0!important;touch-action:none!important;transform:rotate(-90deg)!important;transform-origin:center!important;
      }
      .mixer .afdEqSlider input[type=range]{width:82px!important;height:26px!important;margin:27px -27px!important}
      .mixer .fader input[type=range]{width:104px!important;height:34px!important;margin:36px -36px!important}
      .mixer .afdEqSlider input[type=range]::-webkit-slider-runnable-track,.mixer .fader input[type=range]::-webkit-slider-runnable-track{
        height:7px!important;border-radius:6px!important;background:linear-gradient(#747d87,#20252b)!important;border:1px solid #090b0e!important;box-shadow:inset 0 0 3px #000,0 0 0 1px #505861!important}
      .mixer .afdEqSlider input[type=range]::-webkit-slider-thumb,.mixer .fader input[type=range]::-webkit-slider-thumb{
        -webkit-appearance:none!important;appearance:none!important;width:18px!important;height:30px!important;margin-top:-12px!important;border-radius:4px!important;border:1px solid #d9dde2!important;
        background:linear-gradient(90deg,#252a31,#949ca5 18%,#eef0f2 38%,#6d7680 50%,#eef0f2 57%,#66707a 76%,#20252b)!important;box-shadow:inset 1px 0 #fff,0 2px 5px #000!important}
      .mixer .fader{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:3px!important;margin-top:4px!important;min-height:142px!important;overflow:visible!important}
      .mixer .fader:before{content:'VOLUME';font-size:7px!important;font-weight:900!important;color:#c3ccd6!important;letter-spacing:.5px!important}
      .afdVolRead{font-size:7px!important;color:#dce2e8!important;font-weight:900!important}
    `;

    const channels=[...d.querySelectorAll('.mixer .channel')];
    ['A','B'].forEach((deck,i)=>{
      const panel=d.getElementById('vid'+deck)?.closest('.panel');
      const sideEq=panel?.querySelector('.eq');
      const channel=channels[i]||null;
      const target=channel?.querySelector('.chKnobs');
      if(sideEq&&target){
        ['Bass','Mid','Treble'].forEach(k=>{
          const slider=d.getElementById('afdEq'+k+deck)?.closest('.afdEqSlider');
          if(slider)target.appendChild(slider);
        });
        sideEq.innerHTML='';
      }
      const gain=d.getElementById('gain'+deck),fader=gain?.closest('.fader');
      if(gain&&fader){
        gain.min='0';gain.max='100';gain.step='1';if(+gain.value<0||+gain.value>100)gain.value='100';
        let read=d.getElementById('afdVolRead'+deck);if(!read){read=d.createElement('div');read.id='afdVolRead'+deck;read.className='afdVolRead';fader.appendChild(read)}
        read.textContent=Math.round(+gain.value)+'%';
      }
    });

    if(!d.documentElement.dataset.afdVolumeV46){
      d.documentElement.dataset.afdVolumeV46='1';
      ['gainA','gainB','cross'].forEach(id=>d.getElementById(id)?.addEventListener('input',()=>applyYouTubeVolume(d),{passive:true}));
      d.addEventListener('pointerup',()=>applyYouTubeVolume(d),{passive:true});
      d.addEventListener('touchend',()=>applyYouTubeVolume(d),{passive:true});
    }
    applyYouTubeVolume(d);
  }

  function run(){const d=getDoc();if(d?.head)styleMixer(d)}
  frame()?.addEventListener('load',()=>setTimeout(run,120));
  setTimeout(run,220);setTimeout(run,800);setTimeout(run,1500);
})();