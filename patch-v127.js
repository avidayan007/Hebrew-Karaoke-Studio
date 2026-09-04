// Avi Karaoke Studio Web v1.127 — estimated MP4/WMV output sizes before rendering
(function(){
  const audio=document.getElementById('audio');
  const q=document.getElementById('videoQuality');
  const aq=document.getElementById('audioQuality');
  const renderBtn=document.getElementById('dualExportBtn');
  if(!audio||!q||!aq||!renderBtn)return;

  let box=document.getElementById('hksExportSizeEstimate127');
  if(!box){
    box=document.createElement('div');
    box.id='hksExportSizeEstimate127';
    box.innerHTML='<strong>הערכת גודל לפני רינדור</strong><span id="hksEstimateMp4127">MP4: —</span><span id="hksEstimateWmv127">WMV: —</span><small id="hksEstimateNote127">הערכה לפי אורך השיר ואיכות הווידאו/אודיו שנבחרו.</small>';
    renderBtn.parentElement?.insertBefore(box,renderBtn);
  }

  const mp4=document.getElementById('hksEstimateMp4127');
  const wmv=document.getElementById('hksEstimateWmv127');
  const note=document.getElementById('hksEstimateNote127');
  const style=document.createElement('style');
  style.textContent=`
    #hksExportSizeEstimate127{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:7px 0;padding:8px 10px;border:1px solid rgba(216,174,85,.38);border-radius:10px;background:#131016;color:#f6f1e7;direction:rtl}
    #hksExportSizeEstimate127 strong{color:#f2cf79;font-size:12px;font-weight:900}
    #hksExportSizeEstimate127 span{padding:4px 8px;border-radius:7px;background:#24182e;border:1px solid #6e3c8b;font-size:12px;font-weight:900;direction:ltr}
    #hksExportSizeEstimate127 small{width:100%;font-size:10px;color:#aaa2b3}
  `;
  document.head.appendChild(style);

  function videoMbps(){
    const v=q.value;
    if(v==='1080-master')return 12;
    if(v==='4k')return 20;
    return 8;
  }
  function audioKbps(){
    const n=Number(aq.value);
    return Number.isFinite(n)&&n>0?n:192;
  }
  function fmtBytes(bytes){
    if(!Number.isFinite(bytes)||bytes<=0)return '—';
    const mb=bytes/1e6;
    if(mb<1000)return `${Math.round(mb)} MB`;
    return `${(mb/1000).toFixed(mb<10000?2:1)} GB`;
  }
  function refresh(){
    const duration=Number(audio.duration)||Number(window.audioBuffer?.duration)||0;
    if(!(duration>0)){
      mp4.textContent='MP4: —';wmv.textContent='WMV: —';
      note.textContent='טען שיר כדי לקבל הערכת גודל לפני הרינדור.';
      return;
    }
    const bitsPerSecond=videoMbps()*1e6+audioKbps()*1000;
    const raw=(bitsPerSecond*duration)/8;
    // Both render paths use the same selected video/audio bitrate. Container overhead differs slightly.
    const mp4Bytes=raw*1.015;
    const wmvBytes=raw*1.035;
    mp4.textContent=`MP4: ≈ ${fmtBytes(mp4Bytes)}`;
    wmv.textContent=`WMV: ≈ ${fmtBytes(wmvBytes)}`;
    const low=fmtBytes(raw*.88),high=fmtBytes(raw*1.15);
    note.textContent=`משך ${Math.floor(duration/60)}:${String(Math.floor(duration%60)).padStart(2,'0')} • וידאו ${videoMbps()} Mbps • אודיו ${audioKbps()} kbps • בפועל ייתכן בערך ${low}–${high}.`;
  }

  q.addEventListener('change',refresh);
  aq.addEventListener('change',refresh);
  audio.addEventListener('loadedmetadata',refresh);
  audio.addEventListener('durationchange',refresh);
  document.getElementById('audioFile')?.addEventListener('change',()=>setTimeout(refresh,250));
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(refresh,900));
  refresh();
  window.__hksExportEstimate127=refresh;
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.127';
})();