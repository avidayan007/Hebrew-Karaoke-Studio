// Avi Karaoke Studio Web v1.139 — iPhone preset UI, v1.145 performance hotfix
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  let syncTimer=0;

  function setText(el,text){if(el&&el.textContent!==text)el.textContent=text}
  function originalLabel(opt){
    if(!opt)return '';
    if(!opt.dataset.hksOriginalLabel139)opt.dataset.hksOriginalLabel139=opt.textContent||'';
    return opt.dataset.hksOriginalLabel139;
  }
  function restoreSelect(sel){
    if(!sel)return;
    [...sel.options].forEach(o=>{const t=o.dataset.hksOriginalLabel139;if(t&&o.textContent!==t)o.textContent=t});
  }
  function markSafe(sel,label){
    if(!sel)return;
    restoreSelect(sel);
    const opt=sel.options[sel.selectedIndex];
    if(!opt)return;
    originalLabel(opt);
    setText(opt,label);
    sel.dataset.hksEffective139='safe720';
    if(sel.getAttribute('aria-label')!==label)sel.setAttribute('aria-label',label);
  }
  function syncVisiblePreset(){
    const mode=$('#hksIPhoneRenderMode135');
    const safe=!mode||mode.value==='safe720';
    const mp4=$('#mp4Video')||$('#videoQuality');
    const wmv=$('#wmvVideo')||mp4;
    restoreSelect(mp4);if(wmv!==mp4)restoreSelect(wmv);
    const hint=$('#hksIPhoneRenderHint135');
    if(safe){
      markSafe(mp4,'720p HD — iPhone Safe • MP4 עד 6 Mbps');
      if(wmv!==mp4)markSafe(wmv,'720p HD — iPhone Safe • WMV 4 Mbps');
      setText(hint,'פעיל עכשיו: 720p/30fps. MP4 עד 6 Mbps, ולאחריו WMV 4 Mbps במנוע חדש — מותאם לזיכרון של iPhone.');
    }else{
      if(mp4)delete mp4.dataset.hksEffective139;if(wmv)delete wmv.dataset.hksEffective139;
      setText(hint,'1080p נשאר זמין, אבל עלול להיות איטי או להיכשל בגלל מגבלת הזיכרון של Safari.');
    }
    try{window.__hksExportEstimate137?.()}catch(_){}
  }
  function scheduleSync(){clearTimeout(syncTimer);syncTimer=setTimeout(syncVisiblePreset,20)}
  function bind(){
    const mode=$('#hksIPhoneRenderMode135');
    const mp4=$('#mp4Video')||$('#videoQuality');
    const wmv=$('#wmvVideo')||mp4;
    [mode,mp4,wmv].forEach(el=>{
      if(!el||el.dataset.hksVisiblePreset139)return;
      el.dataset.hksVisiblePreset139='1';
      el.addEventListener('change',scheduleSync);
      el.addEventListener('input',scheduleSync);
    });
    scheduleSync();
  }
  bind();
  [80,300,900,1800].forEach(ms=>setTimeout(bind,ms));
  // v1.145: no document-wide MutationObserver here. It caused a self-triggering DOM loop on iPhone.

  const log=$('#renderLog');
  if(log&&/v1\.137/.test(log.textContent||''))log.textContent='מצב רינדור iPhone Safe — Web v1.139 / מנוע FFmpeg v1.137 עם cache יציב.';
  const ver=$('.version');if(ver)ver.textContent='Web v1.139';
})();
