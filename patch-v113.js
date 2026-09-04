// Avi Karaoke Studio Web v1.113 — title until first synchronization (resync logic moved to v1.121)
(function(){
  const audio=document.getElementById('audio'),preview=document.getElementById('lyricsPreview');
  if(!audio)return;
  const timed=w=>w&&w.time!=null&&Number.isFinite(Number(w.time));

  function titleByTime(){
    const slide=document.getElementById('hksSongTitleSlide');if(!slide)return;
    const text=(window.__hksSongTitleState?.text||document.getElementById('hksSongTitleInput')?.value||'').trim();
    let first=Infinity;
    try{for(const w of words){if(timed(w)){first=Number(w.time);break}}}catch(_){}
    const show=!!text && Number(audio.currentTime)<first;
    slide.hidden=!show;
    if(preview)preview.style.visibility=show?'hidden':'';
  }

  audio.addEventListener('timeupdate',titleByTime);
  audio.addEventListener('seeked',titleByTime);
  audio.addEventListener('play',()=>setTimeout(titleByTime,0));
  ['syncBtn','syncBtn2','resetBtn','undoBtn','startBtn','startBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(titleByTime,0)));
  titleByTime();
  window.__hksRefreshSongTitle113=titleByTime;
})();