(()=>{
 const frame=()=>document.getElementById('console');
 function apply(){
  const f=frame();if(!f)return;const vh=Math.max(640,window.innerHeight||800);
  const saved=+localStorage.getItem('afdConsoleHeightV60');
  const target=saved>400?saved:Math.max(535,Math.min(650,Math.round(vh*.62)));
  f.style.height=target+'px';f.style.minHeight=target+'px';f.style.display='block';f.style.overflow='hidden';f.style.position='relative';f.style.zIndex='2';
  try{const d=f.contentDocument;if(!d?.head)return;let s=d.getElementById('afdHalfLayoutV58');if(!s){s=d.createElement('style');s.id='afdHalfLayoutV58';d.head.appendChild(s)}s.textContent=`
   html,body{overflow:hidden!important;height:auto!important}.app{padding:4px!important;min-height:0!important}.top{height:36px!important}
   .console{grid-template-columns:minmax(0,1fr) minmax(0,1.07fr) minmax(0,1fr)!important;gap:4px!important;margin-top:4px!important;align-items:start!important}.panel{padding:4px!important;overflow:visible!important}
   .deck{display:flex!important;flex-direction:column!important;height:auto!important;min-height:0!important}.deckHead{grid-template-columns:34px 1fr 72px!important;gap:4px!important;flex:0 0 auto}.deckBadge{width:32px!important;height:32px!important;font-size:17px!important}.wave{height:28px!important;margin:3px 0 4px!important;flex:0 0 auto}
   .screenRow{height:auto!important;min-height:150px!important;gap:4px!important;align-items:stretch!important;flex:0 0 auto}.screen{height:150px!important;min-height:90px!important}.pads{margin:3px 0!important;flex:0 0 auto}.pad{height:18px!important}
   .lower{grid-template-columns:minmax(0,1fr) 66px 44px!important;gap:4px!important;align-items:center!important;position:relative!important;z-index:1!important;flex:0 0 auto!important;margin-top:4px!important}.transport button{height:32px!important}.jog{width:60px!important;height:60px!important}.jog:after{inset:17px!important;font-size:7px!important}.pitch input{height:60px!important}.time{margin-top:3px!important}.time b{font-size:11px!important}
   .center{gap:4px!important;display:flex!important;flex-direction:column!important;height:auto!important}.master{padding:4px!important;overflow:visible!important}.masterScreen{height:185px!important;min-height:110px!important;margin-top:3px!important;position:relative!important}.mixer{gap:4px!important;grid-template-columns:1fr 52px 1fr!important;min-height:0!important;height:auto!important;margin-bottom:10px!important;align-items:stretch!important}.channel{padding:4px!important;min-height:170px!important;height:auto!important}.vu{padding:4px!important;min-height:170px!important;height:auto!important}.vuCol{height:96px!important}
   .browser{display:none!important}
  `}catch(e){}
  const dock=document.querySelector('.dock'),view=document.querySelector('.view');
  if(dock){dock.style.marginTop='0';dock.style.position='relative';dock.style.zIndex='1';dock.style.clear='both';}
  if(view){view.style.height=Math.max(190,vh-target-155)+'px';view.style.position='relative';view.style.zIndex='1';}
 }
 window.addEventListener('resize',apply,{passive:true});frame()?.addEventListener('load',()=>setTimeout(apply,100));setTimeout(apply,180);setTimeout(apply,700);setTimeout(apply,1500);
})();