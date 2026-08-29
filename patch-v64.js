// Hebrew Karaoke Studio Web v1.64 — song title is fully removed once lyric slides begin
(function(){
  const audioEl=document.getElementById('audio');
  const lyricsEl=document.getElementById('lyricsPreview');
  if(!audioEl||!lyricsEl)return;

  const isTimed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  function firstTime(){
    try{const w=Array.isArray(words)?words.find(isTimed):null;return w?Number(w.time):null}catch(_){return null}
  }
  function hideTitleHard(){
    const slide=document.getElementById('hksSongTitleSlide');
    const frame=document.getElementById('hksSongTitleFrame');
    const text=document.getElementById('hksSongTitleText');
    [slide,frame,text].forEach(el=>{if(!el)return;el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('opacity','0','important')});
    if(slide)slide.hidden=true;
  }
  function restoreTitleLayer(){
    const slide=document.getElementById('hksSongTitleSlide');
    const frame=document.getElementById('hksSongTitleFrame');
    const text=document.getElementById('hksSongTitleText');
    [slide,frame,text].forEach(el=>{if(!el)return;el.style.removeProperty('display');el.style.removeProperty('visibility');el.style.removeProperty('opacity')});
  }
  function enforceTitleVsLyrics(){
    const ft=firstTime();
    const hasStarted=ft!=null && (Number(audioEl.currentTime)||0)+0.005>=ft && (!window.__hksSyncSessionStarted || window.__hksSyncSessionStarted());
    if(hasStarted)hideTitleHard();
    else restoreTitleLayer();
  }

  // Run after every renderer/event so older title animation patches cannot leave ghost text behind.
  audioEl.addEventListener('timeupdate',()=>setTimeout(enforceTitleVsLyrics,0));
  audioEl.addEventListener('seeked',()=>setTimeout(enforceTitleVsLyrics,0));
  audioEl.addEventListener('play',()=>setTimeout(enforceTitleVsLyrics,0));
  ['playBtn','syncBtn','syncBtn2','startBtn','startBtn2','resetBtn','loadProject'].forEach(id=>document.getElementById(id)?.addEventListener(id==='loadProject'?'change':'click',()=>setTimeout(enforceTitleVsLyrics,id==='loadProject'?1100:0)));
  const oldRender=window.updateLivePreview;
  if(typeof oldRender==='function')window.updateLivePreview=function(){oldRender();enforceTitleVsLyrics()};
  enforceTitleVsLyrics();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.64';
})();
