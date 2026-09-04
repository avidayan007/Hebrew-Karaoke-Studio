// Avi Karaoke Studio Web v1.113 — arm cursor only; marker drags stay editable; title until first sync
(function(){
  const canvas=document.getElementById('hksSyncWaveCanvas'),audio=document.getElementById('audio'),preview=document.getElementById('lyricsPreview');
  if(!canvas||!audio)return;
  let armedTime=null,markerGesture=false;
  const timed=w=>w&&w.time!=null&&Number.isFinite(Number(w.time));

  function nearMarker(clientX){
    try{
      const r=canvas.getBoundingClientRect(),dur=Number(audio.duration)||Number(audioBuffer?.duration)||0;
      if(!dur||!Array.isArray(words))return false;
      let best=22;
      for(const w of words){
        if(!timed(w))continue;
        const x=r.left+(Number(w.time)/dur)*r.width;
        const d=Math.abs(clientX-x);
        if(d<=best)return true;
      }
    }catch(_){}
    return false;
  }

  function arm(){
    armedTime=Number(audio.currentTime)||0;
    try{setStatus('נקודת חזרה נבחרה — הסנכרון עדיין לא נמחק. לחץ נגן לסנכרון כדי להתחיל מחדש מהנקודה הזאת.')}catch(_){}
  }

  // A drag that starts on an existing orange marker is an EDIT, not a resync seek.
  canvas.addEventListener('pointerdown',e=>{markerGesture=nearMarker(e.clientX)},true);
  canvas.addEventListener('pointerup',()=>{
    const wasMarker=markerGesture;markerGesture=false;
    if(wasMarker){
      armedTime=null;
      setTimeout(()=>{try{window.__hksDrawSyncWave?.();setStatus('נקודת הסנכרון הוזזה. אפשר להמשיך לערוך או לנגן.')}catch(_){}},0);
      return;
    }
    setTimeout(arm,0);
  },true);
  canvas.addEventListener('pointercancel',()=>{markerGesture=false},true);

  function beginResync(){
    if(armedTime==null)return;
    const t=armedTime;armedTime=null;
    try{
      let last=-1;
      for(let i=0;i<words.length;i++)if(timed(words[i])&&Number(words[i].time)<=t)last=i;
      const next=Math.max(0,Math.min(last+1,words.length-1));
      // Preserve everything before/at the cursor. Erase ONLY synchronization after it.
      for(let i=next;i<words.length;i++){
        words[i].time=null;
        if('start' in words[i])words[i].start=null;
        if('end' in words[i])words[i].end=null;
        if('timestamp' in words[i])words[i].timestamp=null;
      }
      current=next;
      audio.currentTime=t;
      renderWords();updateSyncPreview();window.__hksDrawSyncWave?.();
      setTimeout(()=>{try{current=next;renderWords();updateSyncPreview();window.__hksDrawSyncWave?.()}catch(_){}},80);
      try{setStatus(`סנכרון חדש מהסמן — נשמר כל מה שלפניו. המילה הבאה: ${words[next]?.t||''}`)}catch(_){}
    }catch(e){console.error('[v113 begin resync]',e)}
  }
  // Play is the commit point: only NOW delete the future synchronization.
  audio.addEventListener('play',beginResync,true);

  // Song title is visible from 00:00 until the first synchronized word time, then disappears.
  function titleByTime(){
    const slide=document.getElementById('hksSongTitleSlide');if(!slide)return;
    const text=(window.__hksSongTitleState?.text||document.getElementById('hksSongTitleInput')?.value||'').trim();
    let first=Infinity;try{for(const w of words){if(timed(w)){first=Number(w.time);break}}}catch(_){}
    const show=!!text && Number(audio.currentTime)<first;
    slide.hidden=!show;
    if(preview)preview.style.visibility=show?'hidden':'';
  }
  audio.addEventListener('timeupdate',titleByTime);audio.addEventListener('seeked',titleByTime);audio.addEventListener('play',()=>setTimeout(titleByTime,0));
  ['syncBtn','syncBtn2','resetBtn','undoBtn','startBtn','startBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(titleByTime,0)));
  titleByTime();

  window.__hksBeginResync113=beginResync;
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.113';
})();