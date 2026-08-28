// Hebrew Karaoke Studio Web v1.55 — true sync reset + hide lyrics until first word is synced
(function(){
  const lyricsPreview=document.getElementById('lyricsPreview');
  const resetBtn=document.getElementById('resetBtn');
  if(!lyricsPreview)return;

  function hasFirstSync(){
    try{return Array.isArray(words)&&words.length>0&&Number.isFinite(Number(words[0]?.time))}catch(_){return false}
  }

  function refreshIntroVisibility(){
    const showLyrics=hasFirstSync();
    lyricsPreview.style.setProperty('visibility',showLyrics?'visible':'hidden','important');
    lyricsPreview.style.setProperty('opacity',showLyrics?'1':'0','important');
    lyricsPreview.setAttribute('aria-hidden',showLyrics?'false':'true');

    // Keep the song title visible while no karaoke word has been synchronized yet.
    const slide=document.getElementById('hksSongTitleSlide');
    const title=(window.__hksSongTitleState?.text||'').trim();
    if(slide&&title){
      if(showLyrics){ slide.hidden=true; }
      else{
        slide.hidden=false;
        slide.style.setProperty('display','flex','important');
        slide.style.setProperty('opacity','1','important');
      }
    }
  }

  function hardResetSync(){
    try{
      if(Array.isArray(words)){
        words.forEach(w=>{w.time=null});
      }
      current=0;
      try{audio.currentTime=0}catch(_){}
      renderWords();
      // Do not call updateSyncPreview here: it would put the first lyric lines into the live preview.
      lyricsPreview.innerHTML='';
      refreshIntroVisibility();
      try{setStatus('הסנכרון אופס — כל המילים ממתינות לסנכרון מחדש')}catch(_){}
    }catch(e){console.warn('[v55 hard reset]',e)}
  }

  // Run after the older reset handler too, so this state is always final.
  resetBtn?.addEventListener('click',()=>setTimeout(hardResetSync,0));

  // Once the first word gets synchronized, reveal the lyrics. Undo/reset can hide them again.
  ['syncBtn','syncBtn2','undoBtn','startBtn','startBtn2'].forEach(id=>{
    document.getElementById(id)?.addEventListener('click',()=>setTimeout(refreshIntroVisibility,0));
  });
  document.addEventListener('keydown',e=>{
    if(e.code==='Space')setTimeout(refreshIntroVisibility,0);
  });
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(refreshIntroVisibility,650));

  // Initial state: if word 1 has no valid time, show only the song title.
  setTimeout(refreshIntroVisibility,0);

  window.__hksHardResetSync=hardResetSync;
  window.__hksRefreshIntroVisibility=refreshIntroVisibility;
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.55';
})();
