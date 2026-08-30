(()=>{
  const frame=()=>document.getElementById('console');
  const getDoc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};

  function ytCommand(d,deck,func,args=[]){
    const f=d.getElementById('ytDeck'+deck);
    if(!f) return;
    try{f.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'*')}catch(e){}
  }

  function applyYouTubeVolume(d){
    const cross=+(d.getElementById('cross')?.value||50)/100;
    const gainA=+(d.getElementById('gainA')?.value||100)/100;
    const gainB=+(d.getElementById('gainB')?.value||100)/100;
    const volA=Math.max(0,Math.min(100,Math.round(Math.cos(cross*Math.PI/2)*100*gainA)));
    const volB=Math.max(0,Math.min(100,Math.round(Math.sin(cross*Math.PI/2)*100*gainB)));
    ytCommand(d,'A','setVolume',[volA]);
    ytCommand(d,'B','setVolume',[volB]);
    const va=d.getElementById('afdVolReadA'),vb=d.getElementById('afdVolReadB');
    if(va)va.textContent=Math.round(gainA*100)+'%';
    if(vb)vb.textContent=Math.round(gainB*100)+'%';
  }

  function styleMixer(d){
    let old=d.getElementById('afdMixerPolishV43');
    if(old) old.remove();
    const st=d.createElement('style');
    st.id='afdMixerPolishV44';
    st.textContent=`
      .eq{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:5px!important;align-items:stretch!important;padding:4px 2px!important}
      .eq>*:not(.afdEqSlider){display:none!important}
      .afdEqSlider{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:3px!important;min-width:0!important}
      .afdEqSlider b{font-size:6.5px!important;color:#b8c2ce!important;letter-spacing:.35px!important}
      .afdEqSlider small{font-size:6px!important;color:#8b96a3!important;min-height:10px!important}
      .afdEqSlider input[type=range],.fader input[type=range]{
        -webkit-appearance:none!important;appearance:none!important;
        writing-mode:horizontal-tb!important;direction:ltr!important;
        background:transparent!important;padding:0!important;
        touch-action:none!important;
        transform:rotate(-90deg)!important;
        transform-origin:center center!important;
      }
      .afdEqSlider input[type=range]{width:166px!important;height:30px!important;margin:68px -68px!important}
      .fader input[type=range]{width:150px!important;height:38px!important;margin:56px -56px!important}
      .afdEqSlider input[type=range]::-webkit-slider-runnable-track,
      .fader input[type=range]::-webkit-slider-runnable-track{
        height:8px!important;border-radius:6px!important;
        background:linear-gradient(#767f89,#20252b)!important;
        border:1px solid #090b0e!important;
        box-shadow:inset 0 0 3px #000,0 0 0 1px #515862!important;
      }
      .afdEqSlider input[type=range]::-webkit-slider-thumb,
      .fader input[type=range]::-webkit-slider-thumb{
        -webkit-appearance:none!important;appearance:none!important;
        width:18px!important;height:32px!important;margin-top:-13px!important;
        border-radius:4px!important;border:1px solid #d9dde2!important;
        background:linear-gradient(90deg,#252a31 0,#89919a 16%,#e9ecef 34%,#707983 48%,#f3f5f7 54%,#707983 70%,#22272d 100%)!important;
        box-shadow:inset 1px 0 #fff,0 2px 6px #000!important;
      }
      .fader{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:4px!important;margin-top:6px!important;min-height:190px!important;overflow:visible!important}
      .fader:before{content:'VOLUME';font-size:7px!important;font-weight:900!important;color:#c0cad5!important;letter-spacing:.6px!important}
      .afdVolRead{font-size:7px;color:#d8dee6;font-weight:900;margin-top:2px}
      .deckA .afdEqSlider input[type=range],.channel:first-child .fader input[type=range]{accent-color:#9a5fff!important}
      .deckB .afdEqSlider input[type=range],.channel:last-child .fader input[type=range]{accent-color:#2aa9ff!important}
    `;
    d.head.appendChild(st);

    ['A','B'].forEach(deck=>{
      const panel=d.getElementById('vid'+deck)?.closest('.panel');
      const eq=panel?.querySelector('.eq');
      if(eq){
        eq.innerHTML='';
        eq.insertAdjacentHTML('beforeend',
          '<label class="afdEqSlider"><b>BASS</b><input id="afdEqBass'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqBassTxt'+deck+'">0</small></label>'+ 
          '<label class="afdEqSlider"><b>MID</b><input id="afdEqMid'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqMidTxt'+deck+'">0</small></label>'+ 
          '<label class="afdEqSlider"><b>TREBLE</b><input id="afdEqTreble'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqTrebleTxt'+deck+'">0</small></label>'
        );
      }
      const gain=d.getElementById('gain'+deck);
      const fader=gain?.closest('.fader');
      if(gain&&fader){
        gain.min='0'; gain.max='100'; gain.step='1';
        if(+gain.value<0||+gain.value>100) gain.value='100';
        let read=d.getElementById('afdVolRead'+deck);
        if(!read){read=d.createElement('div');read.id='afdVolRead'+deck;read.className='afdVolRead';fader.appendChild(read)}
        read.textContent=Math.round(+gain.value)+'%';
      }
    });

    if(!d.documentElement.dataset.afdVolumeV44){
      d.documentElement.dataset.afdVolumeV44='1';
      ['gainA','gainB','cross'].forEach(id=>d.getElementById(id)?.addEventListener('input',()=>applyYouTubeVolume(d),{passive:true}));
      d.addEventListener('pointerup',()=>applyYouTubeVolume(d),{passive:true});
      d.addEventListener('touchend',()=>applyYouTubeVolume(d),{passive:true});
    }
    applyYouTubeVolume(d);
  }

  function run(){const d=getDoc();if(d?.head)styleMixer(d)}
  if(frame()) frame().addEventListener('load',()=>setTimeout(run,100));
  setTimeout(run,180);setTimeout(run,700);setTimeout(run,1500);
})();