// Hebrew Karaoke Studio Web v1.59 — start playback opens a fresh sync display session; lyrics appear only after Sync is pressed
(function(){
  const audioEl=document.getElementById('audio');
  const lyricsPreview=document.getElementById('lyricsPreview');
  if(!audioEl||!lyricsPreview)return;

  let syncSessionStarted=false;

  function titleText(){return (window.__hksSongTitleState?.text||'').trim()}
  function showTitleOnly(){
    lyricsPreview.innerHTML='';
    lyricsPreview.style.setProperty('visibility','hidden','important');
    lyricsPreview.style.setProperty('opacity','0','important');
    lyricsPreview.setAttribute('aria-hidden','true');
    const slide=document.getElementById('hksSongTitleSlide');
    if(slide&&titleText()){
      slide.hidden=false;
      slide.style.setProperty('display','flex','important');
      slide.style.setProperty('visibility','visible','important');
      slide.style.setProperty('opacity','1','important');
    }
  }
  function showLyrics(){
    lyricsPreview.style.setProperty('visibility','visible','important');
    lyricsPreview.style.setProperty('opacity','1','important');
    lyricsPreview.setAttribute('aria-hidden','false');
    const slide=document.getElementById('hksSongTitleSlide');
    if(slide)slide.hidden=true;
  }
  function enforce(){
    if(syncSessionStarted)showLyrics();
    else showTitleOnly();
  }

  function beginFreshSyncSession(){
    syncSessionStarted=false;
    try{current=0;renderWords()}catch(_){}
    try{audioEl.currentTime=0}catch(_){}
    showTitleOnly();
    try{window.__hksDrawSyncWave?.()}catch(_){}
    try{setStatus('התחלת ניגון — עדיין לא התחיל סנכרון. לחץ ◆ סנכרן במילה הראשונה.')}catch(_){}
  }

  // Start = playback from zero only. It never reveals lyrics and never counts as a sync action.
  ['startBtn','startBtn2'].forEach(id=>{
    document.getElementById(id)?.addEventListener('click',()=>setTimeout(beginFreshSyncSession,0));
  });

  // Only an explicit Sync action starts the karaoke lyrics display for this session.
  function afterSync(){
    try{
      const first=Array.isArray(words)?words[0]:null;
      if(first&&first.time!=null&&Number.isFinite(Number(first.time))){
        syncSessionStarted=true;
        showLyrics();
        updateSyncPreview();
        updateLivePreview();
      }
    }catch(_){}
  }
  ['syncBtn','syncBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(afterSync,0)));
  document.addEventListener('keydown',e=>{
    if(e.code==='Space'&&document.activeElement?.tagName!=='TEXTAREA'&&document.activeElement?.tagName!=='INPUT')setTimeout(afterSync,0);
  });

  // Reset returns to title-only state as well.
  document.getElementById('resetBtn')?.addEventListener('click',()=>setTimeout(()=>{syncSessionStarted=false;showTitleOnly()},0));

  // Old code may keep writing lyrics on timeupdate. Block it until Sync has actually been pressed in this session.
  audioEl.addEventListener('play',enforce);
  audioEl.addEventListener('seeking',enforce);
  audioEl.addEventListener('timeupdate',()=>{if(!syncSessionStarted)showTitleOnly()});
  const mo=new MutationObserver(()=>{if(!syncSessionStarted&&lyricsPreview.innerHTML)showTitleOnly()});
  mo.observe(lyricsPreview,{childList:true,subtree:true,characterData:true});

  window.__hksSyncSessionStarted=()=>syncSessionStarted;
  window.__hksBeginFreshSyncSession=beginFreshSyncSession;
  window.__hksRefreshIntroVisibility=enforce;
  enforce();

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.59';
})();
