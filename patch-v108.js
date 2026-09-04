// Avi Karaoke Studio Web v1.108 — waveform cursor resumes lyrics from last synced word before cursor
(function(){
  const wave=document.getElementById('wave'),audio=document.getElementById('audio'),list=document.getElementById('wordList');
  if(!wave||!audio||!list)return;
  let pending=null;

  function lastSyncedBefore(t){
    try{
      let idx=-1;
      for(let i=0;i<words.length;i++){
        const wt=Number(words[i]?.time);
        if(Number.isFinite(wt)&&wt<=t)idx=i;
      }
      return idx;
    }catch(_){return -1}
  }
  function armFromCursor(){
    try{
      const t=audio.currentTime, last=lastSyncedBefore(t);
      if(last<0)return;
      const next=Math.min(last+1,words.length-1);
      pending={time:t,last,next};
      // Keep the last valid synchronized word; everything after it becomes a fresh pass.
      for(let i=next;i<words.length;i++)words[i].time=null;
      current=next;
      renderWords();updateSyncPreview();
      try{setStatus(`מוכן להמשך סנכרון מהסמן — אחרונה מסונכרנת: ${words[last]?.t||''}, הבאה: ${words[next]?.t||''}`)}catch(_){}
    }catch(e){console.warn('[v108 arm]',e)}
  }
  wave.addEventListener('pointerdown',()=>setTimeout(armFromCursor,10));
  wave.addEventListener('click',()=>setTimeout(armFromCursor,10));

  // When playback is started after positioning the waveform, force the sync display to the new continuation point.
  audio.addEventListener('play',()=>{
    if(!pending)return;
    try{
      current=pending.next;
      renderWords();updateSyncPreview();
      // Do not move audio: playback continues exactly from the waveform cursor selected by the user.
      try{setStatus(`ממשיך סנכרון מהסמן — המילה הבאה: ${words[current]?.t||''}`)}catch(_){}
    }catch(_){ }
    pending=null;
  });

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.108';
})();