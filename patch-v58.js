// Hebrew Karaoke Studio Web v1.58 — title-only intro until first real sync
(function(){
  const lyricsPreview=document.getElementById('lyricsPreview');
  const audioEl=document.getElementById('audio');
  if(!lyricsPreview||!audioEl)return;

  const isTimed=w=>!!w && w.time!=null && Number.isFinite(Number(w.time));
  const hasFirstSync=()=>{try{return Array.isArray(words)&&words.length>0&&isTimed(words[0])}catch(_){return false}};

  function forceTitleOnly(){
    const showLyrics=hasFirstSync();
    const slide=document.getElementById('hksSongTitleSlide');
    const title=(window.__hksSongTitleState?.text||'').trim();
    if(!showLyrics){
      lyricsPreview.innerHTML='';
      lyricsPreview.style.setProperty('visibility','hidden','important');
      lyricsPreview.style.setProperty('opacity','0','important');
      lyricsPreview.setAttribute('aria-hidden','true');
      if(slide&&title){
        slide.hidden=false;
        slide.style.setProperty('display','flex','important');
        slide.style.setProperty('visibility','visible','important');
        slide.style.setProperty('opacity','1','important');
      }
    }else{
      lyricsPreview.style.setProperty('visibility','visible','important');
      lyricsPreview.style.setProperty('opacity','1','important');
      lyricsPreview.setAttribute('aria-hidden','false');
    }
  }

  // Stop the old preview functions from writing lyrics before word 1 really has a time.
  try{
    const oldSyncPreview=updateSyncPreview;
    window.updateSyncPreview=function(){
      if(!hasFirstSync()){forceTitleOnly();return}
      oldSyncPreview();
    };
  }catch(_){}
  try{
    const oldLivePreview=updateLivePreview;
    window.updateLivePreview=function(){
      if(!hasFirstSync()){forceTitleOnly();return}
      oldLivePreview();
    };
  }catch(_){}

  // Enforce the state after playback starts, seeks, resets, undo and project loading.
  ['startBtn','startBtn2','playBtn','resetBtn','undoBtn'].forEach(id=>{
    document.getElementById(id)?.addEventListener('click',()=>setTimeout(forceTitleOnly,0));
  });
  ['syncBtn','syncBtn2'].forEach(id=>{
    document.getElementById(id)?.addEventListener('click',()=>setTimeout(forceTitleOnly,0));
  });
  audioEl.addEventListener('play',forceTitleOnly);
  audioEl.addEventListener('seeking',forceTitleOnly);
  audioEl.addEventListener('timeupdate',()=>{if(!hasFirstSync())forceTitleOnly()});
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(forceTitleOnly,700));

  // If any older patch writes lyric HTML while still unsynced, erase it immediately.
  const mo=new MutationObserver(()=>{if(!hasFirstSync()&&lyricsPreview.innerHTML)forceTitleOnly()});
  mo.observe(lyricsPreview,{childList:true,subtree:true,characterData:true});

  window.__hksRefreshIntroVisibility=forceTitleOnly;
  forceTitleOnly();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.58';
})();
