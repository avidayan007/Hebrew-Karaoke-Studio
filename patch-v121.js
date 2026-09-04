// Avi Karaoke Studio Web v1.121 — choose cursor first; erase future sync ONLY on Sync Play
(function(){
  const canvas=document.getElementById('hksSyncWaveCanvas');
  const audio=document.getElementById('audio');
  const syncPlay=document.getElementById('syncPlayBtn');
  if(!canvas||!audio||!syncPlay)return;

  let armedTime=null;
  let markerGesture=false;
  const timed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));

  function duration(){
    try{return Number(audio.duration)||Number(audioBuffer?.duration)||0}catch(_){return Number(audio.duration)||0}
  }

  function nearMarker(clientX){
    try{
      const r=canvas.getBoundingClientRect(),dur=duration();
      if(!dur||!Array.isArray(words))return false;
      for(const w of words){
        if(!timed(w))continue;
        const x=r.left+(Number(w.time)/dur)*r.width;
        if(Math.abs(clientX-x)<=22)return true;
      }
    }catch(_){}
    return false;
  }

  function armAt(t){
    armedTime=Math.max(0,Number(t)||0);
    try{setStatus('נקודת חזרה נבחרה. שום סנכרון עדיין לא נמחק — לחץ ▶ נגן לסנכרון כדי להתחיל מחדש מכאן.')}catch(_){}
  }

  canvas.addEventListener('pointerdown',e=>{markerGesture=nearMarker(e.clientX)},true);

  canvas.addEventListener('pointerup',()=>{
    const wasMarker=markerGesture;
    markerGesture=false;
    if(wasMarker)return;
    setTimeout(()=>armAt(audio.currentTime),0);
  },true);
  canvas.addEventListener('pointercancel',()=>{markerGesture=false},true);

  function commitResync(){
    if(armedTime==null)return false;
    const t=armedTime;
    armedTime=null;
    try{
      if(!Array.isArray(words)||!words.length)return false;
      let last=-1;
      for(let i=0;i<words.length;i++)if(timed(words[i])&&Number(words[i].time)<=t)last=i;
      const next=Math.min(last+1,words.length);
      for(let i=next;i<words.length;i++){
        if(!words[i])continue;
        words[i].time=null;
        if('start' in words[i])words[i].start=null;
        if('end' in words[i])words[i].end=null;
        if('timestamp' in words[i])words[i].timestamp=null;
      }
      current=next;
      audio.currentTime=t;
      try{window.__hksSetSyncSessionStarted?.(true)}catch(_){}
      try{renderWords()}catch(_){}
      try{updateSyncPreview()}catch(_){}
      try{window.__hksDrawSyncWave?.()}catch(_){}
      try{window.__hksPaintFinal112?.()}catch(_){}
      setTimeout(()=>{try{current=next;renderWords();updateSyncPreview();window.__hksDrawSyncWave?.()}catch(_){}},80);
      const label=next<words.length?(words[next]?.t||''):'סוף השיר';
      try{setStatus(`סנכרון חדש התחיל מהסמן — כל מה שלפניו נשמר, וכל מה שאחריו נמחק. ממשיכים מ: ${label}`)}catch(_){}
      return true;
    }catch(e){console.error('[v121 commit resync]',e);return false}
  }

  syncPlay.addEventListener('click',()=>{commitResync()},true);

  window.__hksResync121={
    get armedTime(){return armedTime},
    arm:armAt,
    commit:commitResync,
    cancel(){armedTime=null}
  };

  const ver=document.querySelector('.version');
  if(ver)ver.textContent='Web v1.121';
})();