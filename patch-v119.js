// Avi Karaoke Studio Web v1.119 — restore synchronization after accidental reset (keeps v1.116 layout)
(function(){
  const resetBtn=document.getElementById('resetBtn');
  const audio=document.getElementById('audio');
  const ta=document.getElementById('lyricsText');
  if(!resetBtn||!audio||!ta)return;
  const KEY='hksLastSyncBeforeReset119';

  let restoreBtn=document.getElementById('hksRestoreSync119');
  if(!restoreBtn){
    restoreBtn=document.createElement('button');
    restoreBtn.type='button';
    restoreBtn.id='hksRestoreSync119';
    restoreBtn.className='gbtn gold';
    restoreBtn.textContent='↩ החזר סנכרון אחרון';
    restoreBtn.title='אם לחצת איפוס בטעות — החזר את מצב הסנכרון שהיה רגע לפני האיפוס';
    resetBtn.parentElement?.insertBefore(restoreBtn,resetBtn.nextSibling);
  }

  const style=document.createElement('style');
  style.textContent=`
    #hksRestoreSync119{min-height:38px!important;height:38px!important;padding:4px 9px!important;font-size:11px!important;font-weight:900!important;border-color:#c58b28!important;background:linear-gradient(180deg,#8a5a0d,#4e3005)!important;color:#fff5d5!important}
    #hksRestoreSync119:disabled{opacity:.42!important;filter:grayscale(.5);cursor:not-allowed!important}
  `;
  document.head.appendChild(style);

  const clone=v=>{try{return structuredClone(v)}catch(_){return JSON.parse(JSON.stringify(v))}};
  const isTimed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  function currentLyrics(){return ta.value.replace(/\r/g,'')}
  function readSnapshot(){
    try{const s=JSON.parse(localStorage.getItem(KEY)||'null');return s&&Array.isArray(s.words)?s:null}catch(_){return null}
  }
  function updateButton(){
    const s=readSnapshot();
    restoreBtn.disabled=!(s&&s.lyrics===currentLyrics()&&s.words.some(isTimed));
  }
  function saveSnapshot(){
    try{
      if(!Array.isArray(words)||!words.some(isTimed))return; // never overwrite a good backup with an already-reset empty state
      const snap={
        lyrics:currentLyrics(),
        words:clone(words),
        current:Number(current)||0,
        audioTime:Number(audio.currentTime)||0,
        savedAt:Date.now()
      };
      localStorage.setItem(KEY,JSON.stringify(snap));
      updateButton();
    }catch(e){console.warn('[v119 snapshot]',e)}
  }

  // Capture BEFORE any existing reset handler runs. Works for mouse/touch and keyboard activation.
  resetBtn.addEventListener('pointerdown',saveSnapshot,true);
  resetBtn.addEventListener('click',saveSnapshot,true);

  function restore(){
    const s=readSnapshot();
    if(!s||s.lyrics!==currentLyrics()||!s.words.some(isTimed)){
      updateButton();
      try{setStatus('אין סנכרון קודם מתאים שאפשר להחזיר.')}catch(_){}
      return;
    }
    try{
      words=clone(s.words);
      current=Math.max(0,Math.min(Number(s.current)||0,words.length));
      if(Number.isFinite(Number(s.audioTime)))audio.currentTime=Math.max(0,Number(s.audioTime)||0);
      try{window.__hksSetSyncSessionStarted?.(true)}catch(_){}
      try{window.__hksForceLyricsVisible59?.()}catch(_){}
      try{renderWords()}catch(_){}
      try{updateSyncPreview()}catch(_){}
      try{updateLivePreview()}catch(_){}
      try{window.__hksDrawSyncWave?.()}catch(_){}
      try{window.__hksPaintFinal112?.()}catch(_){}
      setTimeout(()=>{
        try{renderWords();updateSyncPreview();window.__hksDrawSyncWave?.();window.__hksPaintFinal112?.()}catch(_){}
      },80);
      try{setStatus(`הסנכרון האחרון הוחזר — ${words.filter(isTimed).length} מילים מסונכרנות שוחזרו.`)}catch(_){}
    }catch(e){
      console.error('[v119 restore]',e);
      try{setStatus('לא הצלחתי להחזיר את הסנכרון האחרון.')}catch(_){}
    }
  }
  restoreBtn.addEventListener('click',restore);
  ta.addEventListener('input',updateButton);
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(updateButton,250));
  updateButton();

  window.__hksSaveSyncBeforeReset119=saveSnapshot;
  window.__hksRestoreSync119=restore;
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.119';
})();