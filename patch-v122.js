// Avi Karaoke Studio Web v1.122 — smooth sync waveform cursor/marker dragging without UI freezes
(function(){
  const canvas=document.getElementById('hksSyncWaveCanvas');
  const audio=document.getElementById('audio');
  if(!canvas||!audio)return;

  const timed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  let mode=null; // 'marker' | 'cursor'
  let dragIndex=-1;
  let currentBefore=0;
  let pendingTime=0;
  let raf=0;

  function duration(){
    try{return Number(audio.duration)||Number(audioBuffer?.duration)||0}catch(_){return Number(audio.duration)||0}
  }
  function timeFromX(clientX){
    const r=canvas.getBoundingClientRect(),dur=duration();
    if(!dur)return 0;
    return Math.max(0,Math.min(dur,((clientX-r.left)/Math.max(1,r.width))*dur));
  }
  function nearestMarker(clientX){
    try{
      const r=canvas.getBoundingClientRect(),dur=duration();
      if(!dur||!Array.isArray(words))return -1;
      let best=-1,bestDist=22;
      for(let i=0;i<words.length;i++){
        const w=words[i];if(!timed(w))continue;
        const x=r.left+(Number(w.time)/dur)*r.width;
        const d=Math.abs(clientX-x);
        if(d<=bestDist){best=i;bestDist=d}
      }
      return best;
    }catch(_){return -1}
  }
  function clampMarkerTime(i,t){
    const dur=duration();let min=0,max=dur||Math.max(0,t);
    try{
      for(let p=i-1;p>=0;p--){if(timed(words[p])){min=Number(words[p].time)+0.001;break}}
      for(let n=i+1;n<words.length;n++){if(timed(words[n])){max=Math.min(max,Number(words[n].time)-0.001);break}}
    }catch(_){}
    if(max<min)max=min;
    return Math.max(min,Math.min(max,Number(t)||0));
  }
  function paintSoon(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{raf=0;try{window.__hksDrawSyncWave?.()}catch(_){}});
  }

  canvas.addEventListener('pointerdown',e=>{
    const hit=nearestMarker(e.clientX);
    currentBefore=Number(current)||0;
    pendingTime=timeFromX(e.clientX);
    if(hit>=0){
      mode='marker';dragIndex=hit;
      pendingTime=Number(words[hit].time)||pendingTime;
      try{canvas.setPointerCapture?.(e.pointerId)}catch(_){}
      // Stop the old heavy v56 drag handler from running at the same time.
      e.stopImmediatePropagation();
      e.preventDefault();
      canvas.style.cursor='ew-resize';
      paintSoon();
      return;
    }
    mode='cursor';dragIndex=-1;
    try{canvas.setPointerCapture?.(e.pointerId)}catch(_){}
    audio.currentTime=pendingTime;
    paintSoon();
    // We handle cursor movement ourselves, so bypass the old one-shot handler.
    e.stopImmediatePropagation();
    e.preventDefault();
  },true);

  canvas.addEventListener('pointermove',e=>{
    if(!mode)return;
    pendingTime=timeFromX(e.clientX);
    if(mode==='marker'&&dragIndex>=0){
      pendingTime=clampMarkerTime(dragIndex,pendingTime);
      try{words[dragIndex].time=pendingTime}catch(_){}
      // IMPORTANT: no renderWords(), no updateSyncPreview(), no audio seek on every pixel.
      // That was what made the whole interface choke while dragging.
      paintSoon();
      e.stopImmediatePropagation();e.preventDefault();
      return;
    }
    if(mode==='cursor'){
      // Throttle seeking to one browser frame, so dragging the white cursor stays smooth.
      if(!raf){
        raf=requestAnimationFrame(()=>{
          raf=0;
          try{audio.currentTime=pendingTime;window.__hksDrawSyncWave?.()}catch(_){}
        });
      }
      e.stopImmediatePropagation();e.preventDefault();
    }
  },true);

  function finish(e,cancelled=false){
    if(!mode)return;
    const finishedMode=mode,idx=dragIndex,t=pendingTime;
    mode=null;dragIndex=-1;
    try{canvas.releasePointerCapture?.(e.pointerId)}catch(_){}
    if(raf){cancelAnimationFrame(raf);raf=0}

    if(finishedMode==='marker'&&idx>=0){
      try{
        if(!cancelled)words[idx].time=clampMarkerTime(idx,t);
        current=currentBefore; // editing a marker must not move the active sync word
        audio.currentTime=Number(words[idx].time)||0;
        renderWords();updateSyncPreview();window.__hksDrawSyncWave?.();
        setStatus(`נקודת הסנכרון של "${words[idx]?.t||''}" הוזזה בהצלחה.`);
      }catch(err){console.error('[v122 marker finish]',err)}
      canvas.style.cursor='crosshair';
      e.stopImmediatePropagation();e.preventDefault();
      return;
    }

    if(finishedMode==='cursor'){
      try{
        audio.currentTime=Math.max(0,t);
        window.__hksDrawSyncWave?.();
        window.__hksResync121?.arm?.(t);
      }catch(err){console.error('[v122 cursor finish]',err)}
      canvas.style.cursor='crosshair';
      e.stopImmediatePropagation();e.preventDefault();
    }
  }

  canvas.addEventListener('pointerup',e=>finish(e,false),true);
  canvas.addEventListener('pointercancel',e=>finish(e,true),true);

  canvas.style.cursor='crosshair';
  window.__hksWaveDrag122={get mode(){return mode}};
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.122';
})();