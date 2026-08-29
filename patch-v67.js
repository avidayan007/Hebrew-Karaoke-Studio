// Hebrew Karaoke Studio Web v1.67 — stable sync/title compatibility
(function(){
  const audioEl=document.getElementById('audio');
  const slide=document.getElementById('hksSongTitleSlide');
  if(!audioEl)return;

  function hideTitleIfLyricsAlreadyStarted(){
    try{
      if(!slide||!Array.isArray(words)||!words.length)return;
      const first=words.find(w=>w&&w.time!=null&&Number.isFinite(Number(w.time)));
      if(first && (Number(audioEl.currentTime)||0)+0.005>=Number(first.time)) slide.hidden=true;
    }catch(_){}
  }

  audioEl.addEventListener('pause',hideTitleIfLyricsAlreadyStarted);
  audioEl.addEventListener('play',hideTitleIfLyricsAlreadyStarted);
  audioEl.addEventListener('seeked',hideTitleIfLyricsAlreadyStarted);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.67';
})();
