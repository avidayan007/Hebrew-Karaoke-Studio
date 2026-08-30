(()=>{
  const frame=()=>document.getElementById('console');
  function apply(){
    const f=frame();if(!f)return;
    const vh=Math.max(640,window.innerHeight||800);
    const target=Math.max(500,Math.min(620,Math.round(vh*.56)));
    f.style.height=target+'px';
    try{
      const d=f.contentDocument;if(!d?.head)return;
      let st=d.getElementById('afdHalfLayoutV45');if(!st){st=d.createElement('style');st.id='afdHalfLayoutV45';d.head.appendChild(st)}
      st.textContent=`
        .app{padding:5px!important}.top{height:40px!important}
        .console{grid-template-columns:minmax(0,1fr) minmax(0,1.07fr) minmax(0,1fr)!important;gap:5px!important;margin-top:5px!important}
        .panel{padding:5px!important}.deckHead{grid-template-columns:36px 1fr 78px!important;gap:5px!important}
        .deckBadge{width:34px!important;height:34px!important;font-size:18px!important}.wave{height:32px!important;margin:4px 0 5px!important}
        .screenRow{height:182px!important;gap:4px!important}.masterScreen{height:224px!important;margin-top:4px!important}
        .pads{margin:4px 0!important}.pad{height:20px!important}
        .lower{grid-template-columns:minmax(0,1fr) 76px 50px!important;gap:5px!important;align-items:center!important}
        .transport button{height:38px!important}.jog{width:70px!important;height:70px!important}.jog:after{inset:20px!important;font-size:8px!important}
        .pitch input{height:72px!important}.time{margin-top:4px!important}.time b{font-size:12px!important}
        .center{gap:5px!important}.master{padding:5px!important}.mixer{gap:5px!important;grid-template-columns:1fr 58px 1fr!important}
        .channel{padding:5px!important}.vu{padding:5px!important}.vuCol{height:118px!important}
        .browser{margin-top:5px!important}.browserTop{height:32px!important}.library{height:195px!important}
      `;
    }catch(e){}
  }
  window.addEventListener('resize',apply,{passive:true});
  frame()?.addEventListener('load',()=>setTimeout(apply,120));
  setTimeout(apply,180);setTimeout(apply,800);
})();