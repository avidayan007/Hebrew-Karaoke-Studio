(()=>{
  const frame=()=>document.getElementById('console');
  function apply(){
    const f=frame(); if(!f)return;
    /* Give the upper DJ console roughly half of the usable landscape height,
       and let the Workstation/library begin much higher. */
    const vh=Math.max(640,window.innerHeight||800);
    const target=Math.max(455,Math.min(590,Math.round(vh*.53)));
    f.style.height=target+'px';
    try{
      const d=f.contentDocument;if(!d?.head)return;
      let st=d.getElementById('afdHalfLayoutV45');
      if(!st){st=d.createElement('style');st.id='afdHalfLayoutV45';d.head.appendChild(st)}
      st.textContent=`
        .app{padding:5px!important}
        .top{height:38px!important}
        .console{grid-template-columns:minmax(0,1fr) minmax(0,1.06fr) minmax(0,1fr)!important;gap:5px!important;margin-top:5px!important}
        .panel{padding:5px!important}
        .deckHead{grid-template-columns:36px 1fr 76px!important;gap:5px!important}
        .deckBadge{width:34px!important;height:34px!important;font-size:18px!important}
        .wave{height:31px!important;margin:4px 0 5px!important}
        .screenRow{height:174px!important;grid-template-columns:42px minmax(0,1fr) 42px!important;gap:4px!important}
        .masterScreen{height:214px!important;margin-top:4px!important}
        .pads{margin:4px 0!important}.pad{height:19px!important}
        .lower{grid-template-columns:minmax(0,1fr) 74px 48px!important;gap:4px!important}
        .transport button{height:36px!important}
        .jog{width:68px!important;height:68px!important}
        .jog:after{inset:20px!important;font-size:8px!important}
        .pitch input{height:70px!important}
        .time{margin-top:3px!important}.time b{font-size:12px!important}
        .center{gap:5px!important}.master{padding:5px!important}
        .mixer{gap:5px!important;grid-template-columns:1fr 58px 1fr!important}
        .channel{padding:5px!important}.vu{padding:5px!important}.vuCol{height:112px!important}
        .fader{min-height:138px!important;margin-top:2px!important}
        .fader input[type=range]{width:108px!important;margin:36px -36px!important}
        .afdEqSlider input[type=range]{width:116px!important;margin:43px -43px!important}
        .browser{margin-top:5px!important}
        .browserTop{height:32px!important}
        .library{height:190px!important}
      `;
    }catch(e){}
  }
  window.addEventListener('resize',apply,{passive:true});
  frame()?.addEventListener('load',()=>setTimeout(apply,120));
  setTimeout(apply,180);setTimeout(apply,800);
})();