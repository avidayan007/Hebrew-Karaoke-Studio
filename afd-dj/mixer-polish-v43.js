(()=>{
  const frame=()=>document.getElementById('console');
  const getDoc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};

  function styleMixer(d){
    if(d.getElementById('afdMixerPolishV43')) return;
    const st=d.createElement('style');
    st.id='afdMixerPolishV43';
    st.textContent=`
      .eq{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:5px!important;align-items:stretch!important;padding:4px 2px!important}
      .eq>*:not(.afdEqSlider){display:none!important}
      .afdEqSlider{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:3px!important;min-width:0!important}
      .afdEqSlider b{writing-mode:horizontal-tb!important;transform:none!important;height:auto!important;font-size:6.5px!important;color:#b8c2ce!important;letter-spacing:.35px!important}
      .afdEqSlider small{font-size:6px!important;color:#8b96a3!important;min-height:10px!important}
      .afdEqSlider input[type=range],.fader input[type=range]{
        -webkit-appearance:none!important;appearance:none!important;
        writing-mode:vertical-lr!important;direction:rtl!important;
        background:transparent!important;padding:0!important;
      }
      .afdEqSlider input[type=range]{width:28px!important;height:166px!important;margin:0!important}
      .fader input[type=range]{width:36px!important;height:150px!important;margin:0!important}
      .afdEqSlider input[type=range]::-webkit-slider-runnable-track,
      .fader input[type=range]::-webkit-slider-runnable-track{
        width:7px!important;border-radius:6px!important;
        background:linear-gradient(90deg,#15191f,#777f89 45%,#22272e)!important;
        border:1px solid #090b0e!important;
        box-shadow:inset 0 0 3px #000,0 0 0 1px #515862!important;
      }
      .afdEqSlider input[type=range]::-webkit-slider-thumb,
      .fader input[type=range]::-webkit-slider-thumb{
        -webkit-appearance:none!important;appearance:none!important;
        width:30px!important;height:15px!important;margin-left:-12px!important;
        border-radius:3px!important;border:1px solid #d4d8dd!important;
        background:linear-gradient(#f0f2f4 0,#aeb4bb 25%,#535a63 52%,#d2d6db 57%,#5e6670 78%,#22272d 100%)!important;
        box-shadow:inset 0 1px #fff,0 2px 5px #000!important;
      }
      .fader{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:5px!important;margin-top:6px!important}
      .fader:before{content:'VOLUME';font-size:7px!important;font-weight:900!important;color:#c0cad5!important;letter-spacing:.6px!important}
      .deckA .afdEqSlider input[type=range],.channel:first-child .fader input[type=range]{accent-color:#9a5fff!important}
      .deckB .afdEqSlider input[type=range],.channel:last-child .fader input[type=range]{accent-color:#2aa9ff!important}
    `;
    d.head.appendChild(st);

    ['A','B'].forEach(deck=>{
      const panel=d.getElementById('vid'+deck)?.closest('.panel');
      const eq=panel?.querySelector('.eq');
      if(!eq) return;
      if(!d.getElementById('afdEqBass'+deck)){
        eq.innerHTML='';
        eq.insertAdjacentHTML('beforeend',
          '<label class="afdEqSlider"><b>BASS</b><input id="afdEqBass'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqBassTxt'+deck+'">0</small></label>'+ 
          '<label class="afdEqSlider"><b>MID</b><input id="afdEqMid'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqMidTxt'+deck+'">0</small></label>'+ 
          '<label class="afdEqSlider"><b>TREBLE</b><input id="afdEqTreble'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqTrebleTxt'+deck+'">0</small></label>'
        );
      } else {
        [...eq.children].forEach(ch=>{if(!ch.classList.contains('afdEqSlider'))ch.remove()});
      }
    });
  }

  function run(){const d=getDoc();if(d?.head)styleMixer(d)}
  if(frame()) frame().addEventListener('load',()=>setTimeout(run,80));
  setTimeout(run,150);setTimeout(run,650);setTimeout(run,1400);
})();