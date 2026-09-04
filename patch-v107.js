// Avi Karaoke Studio Web v1.107 — waveform seek selects the matching sync word
(function(){
  const wave=document.getElementById('wave'), audio=document.getElementById('audio'), list=document.getElementById('wordList');
  if(!wave||!audio||!list)return;
  let seekArmed=false;

  function findIndexAt(t){
    try{
      if(!Array.isArray(words)||!words.length)return -1;
      let best=-1;
      for(let i=0;i<words.length;i++){
        const wt=Number(words[i]?.time);
        if(Number.isFinite(wt)&&wt<=t)best=i;
        else if(Number.isFinite(wt)&&wt>t)break;
      }
      if(best<0){for(let i=0;i<words.length;i++){if(Number.isFinite(Number(words[i]?.time))){best=i;break}}}
      return best;
    }catch(_){return -1}
  }
  function selectFromWave(){
    const i=findIndexAt(audio.currentTime);if(i<0)return;
    try{
      current=i;
      // From this word onward the old timing is intentionally cleared: this is a new sync pass.
      for(let n=i;n<words.length;n++)words[n].time=null;
      renderWords();updateSyncPreview();updateLivePreview();
      seekArmed=true;
      try{setStatus(`נבחרה נקודת סנכרון חדשה — המילה הבאה: ${words[i]?.t||''}. הפעל מוזיקה ולחץ סנכרן`)}catch(_){}
    }catch(e){console.warn('[v107]',e)}
  }
  // Base app already moves audio.currentTime on pointerdown. Run after it.
  wave.addEventListener('pointerdown',()=>setTimeout(selectFromWave,0));
  wave.addEventListener('click',()=>setTimeout(selectFromWave,0));

  // Do not auto-play; user's Sync button will now work from the newly selected current word.
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.107';
})();