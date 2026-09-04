// Avi Karaoke Studio Web v1.128 — regular player automatically follows current position in zoomed sync waveform
(function(){
  const audio=document.getElementById('audio');
  const playBtn=document.getElementById('playBtn');
  const stopBtn=document.getElementById('stopBtn');
  const syncPlay=document.getElementById('syncPlayBtn');
  if(!audio)return;

  let follow=false,lastMove=0;

  function api(){return window.__hksWaveView125}
  function followNow(force=false){
    if(!follow)return;
    const a=api();if(!a||typeof a.view!=='function'||typeof a.set!=='function')return;
    const zoom=Number(a.zoom)||1;if(zoom<=1)return;
    const d=Number(audio.duration)||0,t=Number(audio.currentTime)||0;if(!(d>0))return;
    const v=a.view(),span=Math.max(.001,Number(v.span)||d/zoom);
    // Keep the playhead inside the middle 60% of the visible waveform.
    // Recenter only when needed so playback stays smooth and does not redraw on every timeupdate.
    const low=v.start+span*.20,high=v.end-span*.20;
    if(!force&&t>=low&&t<=high)return;
    const now=performance.now();if(!force&&now-lastMove<180)return;lastMove=now;
    const maxStart=Math.max(0,d-span);
    const start=Math.max(0,Math.min(maxStart,t-span*.35));
    const pan=maxStart?start/maxStart:0;
    a.set(zoom,pan);
  }

  playBtn?.addEventListener('click',()=>{follow=true;setTimeout(()=>followNow(true),0)},true);
  stopBtn?.addEventListener('click',()=>{follow=false},true);
  // Sync playback keeps its own cursor/resync workflow; don't force the regular-player follow mode there.
  syncPlay?.addEventListener('click',()=>{follow=false},true);
  audio.addEventListener('timeupdate',()=>followNow(false));
  audio.addEventListener('seeked',()=>followNow(true));
  audio.addEventListener('ended',()=>{follow=false});

  // If normal playback is started by another final-result helper, recognize it after the main Play button path.
  audio.addEventListener('play',()=>{
    if(document.activeElement===playBtn){follow=true;setTimeout(()=>followNow(true),0)}
  });

  window.__hksWaveFollow128={
    get enabled(){return follow},
    start(){follow=true;followNow(true)},
    stop(){follow=false},
    update(){followNow(true)}
  };

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.128';
})();