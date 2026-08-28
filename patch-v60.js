// Hebrew Karaoke Studio Web v1.60 — hard reset clears every saved word timing
(function(){
  const resetBtn=document.getElementById('resetBtn');
  const audioEl=document.getElementById('audio');
  const lyricsPreview=document.getElementById('lyricsPreview');
  if(!resetBtn)return;

  function hardResetAllTimings(){
    try{
      if(Array.isArray(words)){
        words.forEach(w=>{
          if(!w)return;
          w.time=null;
          if('start' in w)w.start=null;
          if('end' in w)w.end=null;
          if('timestamp' in w)w.timestamp=null;
        });
      }
      current=0;
      if(audioEl)audioEl.currentTime=0;
      try{renderWords()}catch(_){}
      if(lyricsPreview){
        lyricsPreview.innerHTML='';
        lyricsPreview.style.setProperty('visibility','hidden','important');
        lyricsPreview.style.setProperty('opacity','0','important');
      }
      try{window.__hksBeginFreshSyncSession?.()}catch(_){}
      try{window.__hksDrawSyncWave?.()}catch(_){}
      try{setStatus('האיפוס הושלם — כל זמני הסנכרון נמחקו. המילה הראשונה תחכה ללחיצה על ◆ סנכרן.')}catch(_){}
    }catch(e){console.warn('[v60 hard reset]',e)}
  }

  resetBtn.addEventListener('click',()=>setTimeout(hardResetAllTimings,0));
  window.__hksHardResetAllTimings=hardResetAllTimings;
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.60';
})();
