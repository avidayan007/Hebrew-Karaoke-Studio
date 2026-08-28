// Hebrew Karaoke Studio Web v1.43 — smooth flowing song-title intro
(function(){
  const slide=document.getElementById('hksSongTitleSlide');
  const frame=document.getElementById('hksSongTitleFrame');
  const text=document.getElementById('hksSongTitleText');
  if(!slide||!frame||!text)return;

  const style=document.createElement('style');
  style.textContent=`
    #hksSongTitleSlide{overflow:hidden}
    #hksSongTitleFrame{
      will-change:transform,opacity,filter;
      transform-origin:center center;
    }
    #hksSongTitleSlide.hksTitleEnter #hksSongTitleFrame{
      animation:hksTitleFlowIn 1.75s cubic-bezier(.16,.85,.28,1) both;
    }
    #hksSongTitleSlide.hksTitleExit #hksSongTitleFrame{
      animation:hksTitleFlowOut .58s ease-in both;
    }
    @keyframes hksTitleFlowIn{
      0%{opacity:0;transform:translateX(38%) scale(.94);filter:blur(8px)}
      42%{opacity:.72;filter:blur(2px)}
      64%{opacity:1;filter:blur(0)}
      84%{transform:translateX(-1.2%) scale(1.01)}
      100%{opacity:1;transform:translateX(0) scale(1);filter:blur(0)}
    }
    @keyframes hksTitleFlowOut{
      0%{opacity:1;transform:translateX(0) scale(1);filter:blur(0)}
      100%{opacity:0;transform:translateX(-8%) scale(.985);filter:blur(3px)}
    }
    @media (prefers-reduced-motion:reduce){
      #hksSongTitleSlide.hksTitleEnter #hksSongTitleFrame,
      #hksSongTitleSlide.hksTitleExit #hksSongTitleFrame{animation-duration:.18s!important}
    }
  `;
  document.head.appendChild(style);

  let wasVisible=!slide.hidden;
  let exitTimer=null;
  function restartEnter(){
    clearTimeout(exitTimer);
    slide.classList.remove('hksTitleExit','hksTitleEnter');
    void frame.offsetWidth;
    slide.classList.add('hksTitleEnter');
  }
  function animateExitThenHide(){
    clearTimeout(exitTimer);
    slide.hidden=false;
    slide.classList.remove('hksTitleEnter','hksTitleExit');
    void frame.offsetWidth;
    slide.classList.add('hksTitleExit');
    exitTimer=setTimeout(()=>{slide.hidden=true;slide.classList.remove('hksTitleExit')},580);
  }

  if(wasVisible)restartEnter();

  const obs=new MutationObserver(()=>{
    const visible=!slide.hidden;
    if(visible&&!wasVisible){restartEnter();wasVisible=true;return}
    if(!visible&&wasVisible){wasVisible=false;animateExitThenHide()}
  });
  obs.observe(slide,{attributes:true,attributeFilter:['hidden']});

  ['startBtn','startBtn2','resetBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{
    setTimeout(()=>{if(!slide.hidden)restartEnter()},20);
  }));

  try{
    const originalBuildAss=window.buildAss;
    if(typeof originalBuildAss==='function'&&!originalBuildAss.__hksTitle43){
      const wrapped=function(duration){
        let ass=originalBuildAss(duration);
        if(!ass.includes(',SongTitle,'))return ass;
        const mx=ass.match(/PlayResX:\s*(\d+)/i), my=ass.match(/PlayResY:\s*(\d+)/i);
        const w=mx?Number(mx[1]):1920, h=my?Number(my[1]):1080;
        const cx=Math.round(w/2), cy=Math.round(h/2), sx=Math.round(w*1.18);
        const fx=`{\\move(${sx},${cy},${cx},${cy},0,1600)\\fad(700,420)}`;
        ass=ass.replace(/(Dialogue:\s*2,[^\n]*?,SongTitle,[^\n]*?,,)(?!\{\\move)/,`$1${fx}`);
        return ass;
      };
      wrapped.__hksTitle43=true;
      window.buildAss=wrapped;
    }
  }catch(e){console.warn('[v43 title animation export]',e)}

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.43';
})();
