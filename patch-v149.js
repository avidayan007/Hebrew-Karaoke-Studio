// Avi Karaoke Studio Web v1.149 — live playback follows the synchronized waveform
(function(){
  const audio=document.getElementById('audio');
  if(!audio)return;
  window.__hksWaveFollow149=true;

  let following=false,raf=0,lastPaint=0;
  const api=()=>window.__hksWaveView125;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  function stopOldFollow(){
    try{window.__hksWaveFollow128?.stop?.()}catch(_){}
  }

  function followNow(force=false){
    const a=api();
    if(!a||typeof a.view!=='function'||typeof a.set!=='function')return;
    const d=Number(audio.duration)||Number(window.audioBuffer?.duration)||0;
    const t=Number(audio.currentTime)||0;
    if(!(d>0))return;
    const zoom=Math.max(1,Number(a.zoom)||1);
    if(zoom<=1){
      // Full-song view: redraw the white playhead at the exact current position.
      a.set(1,0);
      return;
    }
    const span=d/zoom,maxStart=Math.max(0,d-span);
    // Keep the live playhead around 42% of the visible window so the user can
    // see upcoming sync points while still seeing enough of what just played.
    const start=clamp(t-span*.42,0,maxStart);
    const pan=maxStart?start/maxStart:0;
    const currentPan=Number(a.pan)||0;
    if(force||Math.abs(currentPan-pan)>.00015)a.set(zoom,pan);
    else a.set(zoom,currentPan); // cheap redraw; cached waveform data is reused
  }

  function frame(ts){
    if(!following||audio.paused||audio.ended){raf=0;return}
    if(ts-lastPaint>=90){lastPaint=ts;followNow(false)}
    raf=requestAnimationFrame(frame);
  }

  function startFollow(){
    if(window.__hksRenderBusy131)return;
    following=true;stopOldFollow();
    // v1.128 also listens to play. Stop it again after its event handler has run
    // so only the smoother v1.149 follow loop controls the viewport.
    setTimeout(stopOldFollow,0);
    followNow(true);
    if(!raf)raf=requestAnimationFrame(frame);
  }

  function stopFollow(){
    following=false;
    if(raf){cancelAnimationFrame(raf);raf=0}
    stopOldFollow();
    // Leave the waveform exactly where playback stopped and redraw the playhead.
    followNow(true);
  }

  audio.addEventListener('play',startFollow);
  audio.addEventListener('playing',startFollow);
  audio.addEventListener('pause',stopFollow);
  audio.addEventListener('ended',stopFollow);
  audio.addEventListener('seeked',()=>followNow(true));
  audio.addEventListener('loadedmetadata',()=>followNow(true));
  // Native iOS audio scrubbing may emit timeupdate before seeked. While paused,
  // keep the synchronized waveform on the scrubbed location immediately.
  audio.addEventListener('timeupdate',()=>{if(audio.paused)followNow(true)});

  // Direct buttons are also wired so the response is immediate before the media
  // element dispatches its play/pause events.
  document.getElementById('playBtn')?.addEventListener('click',()=>setTimeout(()=>{if(!audio.paused)startFollow()},0),true);
  document.getElementById('syncPlayBtn')?.addEventListener('click',()=>setTimeout(()=>{if(!audio.paused)startFollow()},0),true);
  document.getElementById('stopBtn')?.addEventListener('click',()=>setTimeout(stopFollow,0),true);
  document.getElementById('syncStopBtn')?.addEventListener('click',()=>setTimeout(stopFollow,0),true);

  window.__hksWaveFollow149Api={
    get active(){return following},
    start:startFollow,
    stop:stopFollow,
    update:()=>followNow(true)
  };

  // Draw once after all previous waveform patches have settled.
  [0,250,900].forEach(ms=>setTimeout(()=>followNow(true),ms));
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.149';
  try{setStatus('v1.149 מוכן — גל הסנכרון עוקב בלייב אחרי Play ונשאר במקום ב-Pause.')}catch(_){}
})();
