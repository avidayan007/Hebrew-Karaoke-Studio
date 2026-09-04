// Avi Karaoke Studio Web v1.110 — one authoritative waveform re-sync flow
(function(){
  const wave=document.getElementById('wave'),audio=document.getElementById('audio'),list=document.getElementById('wordList');
  if(!wave||!audio||!list)return;
  let armed=false;

  function applyCursor(){
    try{
      if(!Array.isArray(words)||!words.length)return;
      const t=Number(audio.currentTime)||0;
      let last=-1;
      // Find the LAST already-synchronized word at/before the cursor.
      for(let i=0;i<words.length;i++){
        const wt=Number(words[i]?.time);
        if(Number.isFinite(wt)&&wt<=t)last=i;
      }
      // If cursor is before the first synchronized word, restart from word 0.
      const next=Math.max(0,Math.min(last+1,words.length-1));
      // Preserve synchronization BEFORE cursor. Reset everything that must be re-synchronized AFTER it.
      for(let i=next;i<words.length;i++)words[i].time=null;
      current=next;
      armed=true;
      // This is the source mirrored by the detached synchronization window (v104).
      renderWords();
      updateSyncPreview();
      // Force a second paint after all pointer/click handlers settle, so both local and detached displays jump.
      requestAnimationFrame(()=>{try{current=next;renderWords();updateSyncPreview()}catch(_){}});
      setTimeout(()=>{try{current=next;renderWords();updateSyncPreview()}catch(_){}},80);
      try{setStatus(`סנכרון אופס מהסמן והלאה — המשך מהמילה: ${words[next]?.t||''}`)}catch(_){}
    }catch(e){console.error('[v110 resync]',e)}
  }

  // Base waveform seek updates audio.currentTime; read it immediately after that update.
  wave.addEventListener('pointerup',()=>setTimeout(applyCursor,0));
  wave.addEventListener('click',()=>setTimeout(applyCursor,0));

  // Starting playback must NOT jump back to the old end of synchronization.
  audio.addEventListener('play',()=>{
    if(!armed)return;
    try{renderWords();updateSyncPreview()}catch(_){}
    armed=false;
  });

  window.__hksWaveResync110=applyCursor;
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.110';
})();