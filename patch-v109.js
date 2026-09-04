// Avi Karaoke Studio Web v1.109 — detached sync display follows waveform resync position
(function(){
  const wave=document.getElementById('wave'),audio=document.getElementById('audio'),list=document.getElementById('wordList');
  if(!wave||!audio||!list)return;

  function lastTimedBefore(t){
    try{let last=-1;for(let i=0;i<words.length;i++){const wt=Number(words[i]?.time);if(Number.isFinite(wt)&&wt<=t)last=i}return last}catch(_){return -1}
  }
  function jumpSyncDisplay(){
    try{
      const last=lastTimedBefore(audio.currentTime);if(last<0)return;
      // Continue from the word immediately after the last valid synchronized word before the cursor.
      current=Math.min(last+1,words.length-1);
      for(let i=current;i<words.length;i++)words[i].time=null;
      renderWords();updateSyncPreview();
      // v104 mirrors #wordList every 60 ms, so forcing renderWords here also moves the detached screen.
      list.dataset.hksResync109=String(current);
      try{setStatus(`מסך הסנכרון קפץ להמשך המילים מהסמן — הבאה: ${words[current]?.t||''}`)}catch(_){}
    }catch(e){console.warn('[v109]',e)}
  }
  wave.addEventListener('pointerdown',()=>setTimeout(jumpSyncDisplay,25));
  wave.addEventListener('click',()=>setTimeout(jumpSyncDisplay,25));
  audio.addEventListener('play',()=>setTimeout(jumpSyncDisplay,0));
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.109';
})();