// Hebrew Karaoke Studio Web v1.65 — permanently lock song title hidden after lyrics begin, until restart/reset
(function(){
  const audioEl=document.getElementById('audio');
  if(!audioEl)return;

  const style=document.createElement('style');
  style.id='hksTitleLock65';
  style.textContent=`
    body.hksTitleFinished #hksSongTitleSlide,
    body.hksTitleFinished #hksSongTitleFrame,
    body.hksTitleFinished #hksSongTitleText{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
      animation:none!important;
      transition:none!important;
      filter:none!important;
    }
  `;
  document.head.appendChild(style);

  const isTimed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  function firstTime(){
    try{const w=Array.isArray(words)?words.find(isTimed):null;return w?Number(w.time):null}catch(_){return null}
  }
  function killTitleNow(){
    document.body.classList.add('hksTitleFinished');
    const slide=document.getElementById('hksSongTitleSlide');
    if(slide){
      slide.hidden=true;
      slide.classList.remove('hksTitleEnter','hksTitleExit');
    }
  }
  function allowTitleAgain(){
    document.body.classList.remove('hksTitleFinished');
    const slide=document.getElementById('hksSongTitleSlide');
    const frame=document.getElementById('hksSongTitleFrame');
    [slide,frame].forEach(el=>el?.classList.remove('hksTitleExit'));
  }
  function checkLatch(){
    if(document.body.classList.contains('hksTitleFinished')){killTitleNow();return}
    const ft=firstTime();
    if(ft!=null&&(Number(audioEl.currentTime)||0)+0.005>=ft){killTitleNow()}
  }

  // Stop/pause must never re-enable the title after lyrics have started.
  audioEl.addEventListener('timeupdate',checkLatch);
  audioEl.addEventListener('play',checkLatch);
  audioEl.addEventListener('pause',()=>{if(document.body.classList.contains('hksTitleFinished'))killTitleNow()});
  audioEl.addEventListener('seeked',checkLatch);
  document.getElementById('stopBtn')?.addEventListener('click',()=>setTimeout(()=>{if(document.body.classList.contains('hksTitleFinished'))killTitleNow();else checkLatch()},0));
  document.getElementById('syncStopBtn')?.addEventListener('click',()=>setTimeout(()=>{if(document.body.classList.contains('hksTitleFinished'))killTitleNow();else checkLatch()},0));

  // Only an explicit restart/reset may allow the intro title again.
  ['startBtn','startBtn2','resetBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(allowTitleAgain,0)));
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(()=>{allowTitleAgain();checkLatch()},1100));
  document.getElementById('hksNewProjectBtn')?.addEventListener('click',()=>setTimeout(allowTitleAgain,0));

  // Older title observers can mutate hidden/classes; this guard immediately restores the lock.
  const slide=document.getElementById('hksSongTitleSlide');
  if(slide){
    const mo=new MutationObserver(()=>{if(document.body.classList.contains('hksTitleFinished'))killTitleNow()});
    mo.observe(slide,{attributes:true,attributeFilter:['hidden','class','style']});
  }

  const oldRender=window.updateLivePreview;
  if(typeof oldRender==='function')window.updateLivePreview=function(){oldRender();checkLatch()};
  checkLatch();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.65';
})();
