// Avi Karaoke Studio Web v1.120 — draggable sync markers restored; no layout changes
(function(){
  const canvas=document.getElementById('hksSyncWaveCanvas'),audio=document.getElementById('audio');
  if(!canvas||!audio)return;
  const timed=w=>w&&w.time!=null&&Number.isFinite(Number(w.time));
  function nearMarker(clientX){
    try{
      const r=canvas.getBoundingClientRect(),dur=Number(audio.duration)||Number(audioBuffer?.duration)||0;
      if(!dur||!Array.isArray(words))return false;
      for(const w of words){
        if(!timed(w))continue;
        const x=r.left+(Number(w.time)/dur)*r.width;
        if(Math.abs(clientX-x)<=24)return true;
      }
    }catch(_){}
    return false;
  }
  canvas.addEventListener('pointermove',e=>{
    if(e.buttons)return;
    canvas.style.cursor=nearMarker(e.clientX)?'ew-resize':'crosshair';
  });
  canvas.addEventListener('pointerleave',()=>{canvas.style.cursor='crosshair'});
  canvas.style.cursor='crosshair';
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.120';
})();