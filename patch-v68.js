// Hebrew Karaoke Studio Web v1.68 — final display arbiter for title/lyrics after sync
(function(){
  const audio=document.getElementById('audio');
  const lyrics=document.getElementById('lyricsPreview');
  if(!audio||!lyrics)return;
  const timed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  function hasTiming(){try{return Array.isArray(words)&&words.some(timed)}catch(_){return false}}
  function firstTime(){try{const w=Array.isArray(words)?words.find(timed):null;return w?Number(w.time):null}catch(_){return null}}
  function hideTitle(){
    const slide=document.getElementById('hksSongTitleSlide');
    if(!slide)return;
    slide.classList.remove('hksTitleEnter','hksTitleExit');
    slide.hidden=true;
    slide.style.setProperty('display','none','important');
    slide.style.setProperty('visibility','hidden','important');
    slide.style.setProperty('opacity','0','important');
  }
  function showLyricsLayer(){
    lyrics.style.setProperty('display','block','important');
    lyrics.style.setProperty('visibility','visible','important');
    lyrics.style.setProperty('opacity','1','important');
    lyrics.setAttribute('aria-hidden','false');
    hideTitle();
  }
  function reconcile(){
    if(!hasTiming())return;
    const ft=firstTime();
    const now=Number(audio.currentTime)||0;
    if(ft!=null&&now+0.01>=ft){
      window.__hksSetSyncSessionStarted?.(true);
      try{window.__hksRenderLiveByTiming?.()}catch(_){}
      showLyricsLayer();
    }
  }
  ['syncBtn','syncBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(reconcile,10)));
  audio.addEventListener('timeupdate',reconcile);
  audio.addEventListener('play',()=>setTimeout(reconcile,0));
  audio.addEventListener('pause',()=>setTimeout(reconcile,0));
  audio.addEventListener('seeked',()=>setTimeout(reconcile,0));
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(reconcile,1100));
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.68';
})();