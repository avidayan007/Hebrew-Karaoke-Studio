// Avi Karaoke Studio Web v1.124 — reliable final-result playback after full synchronization
(function(){
  const audio=document.getElementById('audio');
  const playBtn=document.getElementById('playBtn');
  if(!audio||!playBtn)return;

  const timed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  function fullySynced(){
    try{return Array.isArray(words)&&words.length>0&&words.every(timed)}catch(_){return false}
  }

  function refreshLabel(){
    try{playBtn.textContent=fullySynced()?'▶ נגן תוצאה':'▶ נגן'}catch(_){}
  }

  // Run before the original play handler. When synchronization is complete,
  // the main Play button always starts a clean final-result preview from 00:00.
  playBtn.addEventListener('click',()=>{
    if(!fullySynced())return;
    try{
      window.__hksResync121?.cancel?.();
      window.__hksSetSyncSessionStarted?.(true);
      audio.currentTime=0;
      try{window.__hksRefreshSongTitle113?.()}catch(_){}
      try{window.__hksPaintFinal112?.()}catch(_){}
      setTimeout(()=>{
        try{
          if(audio.paused)audio.play().catch(()=>{});
          window.__hksRefreshSongTitle113?.();
          window.__hksPaintFinal112?.();
          setStatus('ניגון התוצאה הסופית מההתחלה');
        }catch(_){}
      },0);
    }catch(e){console.error('[v124 final play]',e)}
  },true);

  ['syncBtn','syncBtn2','undoBtn','resetBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(refreshLabel,0)));
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(refreshLabel,900));
  audio.addEventListener('ended',()=>{
    if(!fullySynced())return;
    try{setStatus('ניגון התוצאה הסתיים — לחץ ▶ נגן תוצאה כדי לראות שוב מההתחלה')}catch(_){}
  });

  refreshLabel();
  window.__hksFinalPlayback124={fullySynced,playFromStart(){if(!fullySynced())return false;audio.currentTime=0;window.__hksSetSyncSessionStarted?.(true);audio.play().catch(()=>{});return true}};
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.124';
})();