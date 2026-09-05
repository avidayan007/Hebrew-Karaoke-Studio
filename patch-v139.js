// Avi Karaoke Studio Web v1.139 — make iPhone Safe mode visible in the actual MP4/WMV controls
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);

  function originalLabel(opt){
    if(!opt)return '';
    if(!opt.dataset.hksOriginalLabel139)opt.dataset.hksOriginalLabel139=opt.textContent||'';
    return opt.dataset.hksOriginalLabel139;
  }
  function restoreSelect(sel){
    if(!sel)return;
    [...sel.options].forEach(o=>{if(o.dataset.hksOriginalLabel139)o.textContent=o.dataset.hksOriginalLabel139});
  }
  function markSafe(sel,label){
    if(!sel)return;
    restoreSelect(sel);
    const opt=sel.options[sel.selectedIndex];
    if(!opt)return;
    originalLabel(opt);
    opt.textContent=label;
    sel.dataset.hksEffective139='safe720';
    sel.setAttribute('aria-label',label);
  }
  function syncVisiblePreset(){
    const mode=$('#hksIPhoneRenderMode135');
    const safe=!mode||mode.value==='safe720';
    const mp4=$('#mp4Video')||$('#videoQuality');
    const wmv=$('#wmvVideo')||mp4;
    restoreSelect(mp4);if(wmv!==mp4)restoreSelect(wmv);
    if(safe){
      markSafe(mp4,'720p HD — iPhone Safe • MP4 עד 6 Mbps');
      if(wmv!==mp4)markSafe(wmv,'720p HD — iPhone Safe • WMV 4 Mbps');
      const hint=$('#hksIPhoneRenderHint135');if(hint)hint.textContent='פעיל עכשיו: 720p/30fps. MP4 עד 6 Mbps, ולאחריו WMV 4 Mbps במנוע חדש — מותאם לזיכרון של iPhone.';
    }else{
      if(mp4)delete mp4.dataset.hksEffective139;if(wmv)delete wmv.dataset.hksEffective139;
      const hint=$('#hksIPhoneRenderHint135');if(hint)hint.textContent='1080p נשאר זמין, אבל עלול להיות איטי או להיכשל בגלל מגבלת הזיכרון של Safari.';
    }
    try{window.__hksExportEstimate137?.()}catch(_){}
  }

  function bind(){
    const mode=$('#hksIPhoneRenderMode135');
    const mp4=$('#mp4Video')||$('#videoQuality');
    const wmv=$('#wmvVideo')||mp4;
    [mode,mp4,wmv].forEach(el=>{
      if(!el||el.dataset.hksVisiblePreset139)return;
      el.dataset.hksVisiblePreset139='1';
      el.addEventListener('change',()=>setTimeout(syncVisiblePreset,0));
      el.addEventListener('input',()=>setTimeout(syncVisiblePreset,0));
    });
    syncVisiblePreset();
  }
  bind();
  [50,250,800,1800].forEach(ms=>setTimeout(bind,ms));
  new MutationObserver(()=>setTimeout(bind,0)).observe(document.documentElement,{subtree:true,childList:true});

  const log=$('#renderLog');
  if(log&&/v1\.137/.test(log.textContent||''))log.textContent='מצב רינדור iPhone Safe — Web v1.139 / מנוע FFmpeg v1.137 עם cache יציב.';
  const ver=$('.version');if(ver)ver.textContent='Web v1.139';
  try{navigator.serviceWorker?.register?.('sw.js?v=139',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
