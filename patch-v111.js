// Avi Karaoke Studio Web v1.111 — authoritative resync from the SYNC waveform canvas
(function(){
  const canvas=document.getElementById('hksSyncWaveCanvas');
  const audio=document.getElementById('audio');
  const list=document.getElementById('wordList');
  if(!canvas||!audio||!list)return;
  let seekTime=null;

  function timed(w){return w&&w.time!=null&&Number.isFinite(Number(w.time))}
  function resetForwardAt(t){
    try{
      if(!Array.isArray(words)||!words.length)return;
      // Snapshot before deleting anything. Find the last valid word BEFORE the cursor.
      let last=-1;
      for(let i=0;i<words.length;i++) if(timed(words[i])&&Number(words[i].time)<=t) last=i;
      const next=Math.max(0,Math.min(last+1,words.length-1));
      // Delete ALL synchronization from the continuation word forward.
      for(let i=next;i<words.length;i++){
        words[i].time=null;
        if('start' in words[i])words[i].start=null;
        if('end' in words[i])words[i].end=null;
        if('timestamp' in words[i])words[i].timestamp=null;
      }
      current=next;
      // Repaint the source used by the detached sync screen. v104 mirrors this HTML.
      renderWords();updateSyncPreview();window.__hksDrawSyncWave?.();
      requestAnimationFrame(()=>{try{current=next;renderWords();updateSyncPreview()}catch(_){}});
      setTimeout(()=>{try{current=next;renderWords();updateSyncPreview();window.__hksDrawSyncWave?.()}catch(_){}},90);
      try{setStatus(`נמחק הסנכרון שמלפני ההמשך החדש. ממשיכים מהמילה: ${words[next]?.t||''}`)}catch(_){}
    }catch(e){console.error('[v111 reset forward]',e)}
  }

  // The user actually works on #hksSyncWaveCanvas (v56), not the small main #wave.
  canvas.addEventListener('pointerdown',()=>{setTimeout(()=>{seekTime=Number(audio.currentTime)||0},0)},true);
  canvas.addEventListener('pointerup',()=>{setTimeout(()=>{seekTime=Number(audio.currentTime)||0;resetForwardAt(seekTime)},0)},true);

  // When Play is pressed after moving backward, enforce the reset once more using that exact cursor time.
  audio.addEventListener('play',()=>{
    if(seekTime==null)return;
    const t=seekTime;seekTime=null;
    audio.currentTime=t;
    resetForwardAt(t);
  },true);

  window.__hksSyncWaveResync111=resetForwardAt;
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.111';
})();