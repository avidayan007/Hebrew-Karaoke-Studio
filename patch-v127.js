// Avi Karaoke Studio Web v1.127 — estimated MP4/WMV output sizes before rendering (current separate presets)
(function(){
  const audio=document.getElementById('audio');
  const renderBtn=document.getElementById('dualExportBtn');
  if(!audio||!renderBtn)return;

  const mp4Q=()=>document.getElementById('mp4Video')||document.getElementById('videoQuality');
  const mp4A=()=>document.getElementById('mp4Audio')||document.getElementById('audioQuality');
  const wmvQ=()=>document.getElementById('wmvVideo')||mp4Q();
  const wmvA=()=>document.getElementById('wmvAudio')||mp4A();

  let box=document.getElementById('hksExportSizeEstimate127');
  if(!box){
    box=document.createElement('div');
    box.id='hksExportSizeEstimate127';
    box.innerHTML='<strong>הערכת גודל לפני רינדור</strong><span id="hksEstimateMp4127">MP4: —</span><span id="hksEstimateWmv127">WMV: —</span><small id="hksEstimateNote127">הערכה לפי אורך השיר והאיכות שבחרת לכל פורמט.</small>';
    renderBtn.parentElement?.insertBefore(box,renderBtn);
  }

  const mp4=document.getElementById('hksEstimateMp4127');
  const wmv=document.getElementById('hksEstimateWmv127');
  const note=document.getElementById('hksEstimateNote127');
  if(!document.getElementById('hksExportEstimateStyle127')){
    const style=document.createElement('style');style.id='hksExportEstimateStyle127';
    style.textContent=`#hksExportSizeEstimate127{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:7px 0;padding:8px 10px;border:1px solid rgba(216,174,85,.38);border-radius:10px;background:#131016;color:#f6f1e7;direction:rtl}#hksExportSizeEstimate127 strong{color:#f2cf79;font-size:12px;font-weight:900}#hksExportSizeEstimate127 span{padding:4px 8px;border-radius:7px;background:#24182e;border:1px solid #6e3c8b;font-size:12px;font-weight:900;direction:ltr}#hksExportSizeEstimate127 small{width:100%;font-size:10px;color:#aaa2b3}`;
    document.head.appendChild(style);
  }

  function videoMbps(el){const v=el?.value||'1080-master';if(v==='1080-master')return 12;if(v==='4k')return 20;return 8}
  function audioKbps(el){const n=Number(el?.value);return Number.isFinite(n)&&n>0?n:320}
  function bytesFor(duration,q,a,overhead){return (((videoMbps(q)*1e6+audioKbps(a)*1000)*duration)/8)*overhead}
  function fmtBytes(bytes){if(!Number.isFinite(bytes)||bytes<=0)return '—';const mb=bytes/1e6;if(mb<1000)return `${Math.round(mb)} MB`;return `${(mb/1000).toFixed(mb<10000?2:1)} GB`}
  function durationNow(){try{return Number(audio.duration)||Number(audioBuffer?.duration)||0}catch(_){return Number(audio.duration)||0}}
  function refresh(){
    const duration=durationNow();
    if(!(duration>0)){mp4.textContent='MP4: —';wmv.textContent='WMV: —';note.textContent='טען שיר כדי לקבל הערכת גודל לפני הרינדור.';return}
    const mq=mp4Q(),ma=mp4A(),wq=wmvQ(),wa=wmvA();
    const mp4Bytes=bytesFor(duration,mq,ma,1.015),wmvBytes=bytesFor(duration,wq,wa,1.035);
    mp4.textContent=`MP4: ≈ ${fmtBytes(mp4Bytes)}`;wmv.textContent=`WMV: ≈ ${fmtBytes(wmvBytes)}`;
    const m=Math.floor(duration/60),s=String(Math.floor(duration%60)).padStart(2,'0');
    note.textContent=`משך ${m}:${s} • MP4: ${videoMbps(mq)} Mbps / ${audioKbps(ma)} kbps • WMV: ${videoMbps(wq)} Mbps / ${audioKbps(wa)} kbps • זו הערכה; הגודל בפועל עשוי להשתנות מעט.`;
  }
  function bind(el){if(!el||el.dataset.hksEstimate127)return;el.dataset.hksEstimate127='1';el.addEventListener('change',refresh);el.addEventListener('input',refresh)}
  [mp4Q(),mp4A(),wmvQ(),wmvA()].forEach(bind);
  audio.addEventListener('loadedmetadata',refresh);audio.addEventListener('durationchange',refresh);
  document.getElementById('audioFile')?.addEventListener('change',()=>setTimeout(refresh,250));
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(refresh,900));
  // Export controls are injected by an early patch; bind again after all patches settle.
  setTimeout(()=>{[mp4Q(),mp4A(),wmvQ(),wmvA()].forEach(bind);refresh()},200);
  refresh();window.__hksExportEstimate127=refresh;
  const ver=document.querySelector('.version');if(ver&&!window.aviDesktop?.isDesktop)ver.textContent='Web v1.127';
})();