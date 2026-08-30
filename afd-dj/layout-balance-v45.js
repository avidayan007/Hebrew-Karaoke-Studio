(()=>{
  const frame=()=>document.getElementById('console');
  function apply(){
    const f=frame();if(!f)return;
    /* Upper iframe contains decks/master/mixer only. The duplicate browser inside ULTRA
       is hidden; Workstation below is the single library/online/automix/settings area. */
    const vh=Math.max(640,window.innerHeight||800);
    const target=Math.max(430,Math.min(535,Math.round(vh*.50)));
    f.style.height=target+'px';
    f.style.overflow='hidden';
    try{
      const d=f.contentDocument;if(!d?.head)return;
      let st=d.getElementById('afdHalfLayoutV45');if(!st){st=d.createElement('style');st.id='afdHalfLayoutV45';d.head.appendChild(st)}
      st.textContent=`
        html,body{overflow:hidden!important;height:auto!important}
        .app{padding:4px!important;min-height:0!important}
        .top{height:36px!important}
        .console{grid-template-columns:minmax(0,1fr) minmax(0,1.07fr) minmax(0,1fr)!important;gap:4px!important;margin-top:4px!important}
        .panel{padding:4px!important}
        .deckHead{grid-template-columns:34px 1fr 72px!important;gap:4px!important}
        .deckBadge{width:32px!important;height:32px!important;font-size:17px!important}
        .wave{height:28px!important;margin:3px 0 4px!important}
        .screenRow{height:150px!important;gap:4px!important}
        .masterScreen{height:185px!important;margin-top:3px!important}
        .pads{margin:3px 0!important}.pad{height:18px!important}
        .lower{grid-template-columns:minmax(0,1fr) 66px 44px!important;gap:4px!important;align-items:center!important}
        .transport button{height:32px!important}
        .jog{width:60px!important;height:60px!important}.jog:after{inset:17px!important;font-size:7px!important}
        .pitch input{height:60px!important}.time{margin-top:3px!important}.time b{font-size:11px!important}
        .center{gap:4px!important}.master{padding:4px!important}
        .mixer{gap:4px!important;grid-template-columns:1fr 52px 1fr!important}
        .channel{padding:4px!important}.vu{padding:4px!important}.vuCol{height:96px!important}
        /* There must be only one workspace. Hide ULTRA's duplicate library/browser. */
        .browser{display:none!important}
      `;
    }catch(e){}
    /* Workstation is the one and only workspace and uses the rest of the viewport. */
    const dock=document.querySelector('.dock');
    const view=document.querySelector('.view');
    if(dock){dock.style.marginTop='0';dock.style.position='relative';dock.style.zIndex='3'}
    if(view){const used=target+(dock?Math.max(120,dock.querySelector('.toolbar')?.offsetHeight||34)+Math.max(36,dock.querySelector('.tabs')?.offsetHeight||34)+75:160);view.style.height=Math.max(220,vh-used)+'px'}
  }
  window.addEventListener('resize',apply,{passive:true});
  frame()?.addEventListener('load',()=>setTimeout(apply,100));
  setTimeout(apply,160);setTimeout(apply,650);setTimeout(apply,1400);
})();