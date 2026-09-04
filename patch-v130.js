// Avi Karaoke Studio Windows v1.130 — parity audit: desktop must include the complete web feature set through v1.128
(function(){
  const api=window.aviDesktop;if(!api?.isDesktop)return;
  const checks=[
    ['שם שיר','#hksSongTitleControls'],['גודל מילים','#hksFontControls'],['כלי סטודיו','#hksCompactToolbar80'],
    ['סנכרון בסטודיו','#hksStudioSyncCard'],['מסך סנכרון חיצוני','#hksSyncExternal104'],['מסך קהל חיצוני','#hksExternalDisplay102'],
    ['4/5/6 שורות','#hksLinesPerScreen99'],['מסגרת כיתוב','#hksBrandOutlineControls97'],['תצוגת מסגרת','#hksBrandOutlinePreview98'],
    ['זום גל קול','#hksWaveZoom115'],['גלילת גל מוגדל','#hksWavePan125'],['שחזור סנכרון','#hksRestoreSync119'],
    ['הערכת גודל ייצוא','#hksExportSizeEstimate127'],['כפתור רענון','#hksRefresh105']
  ];
  function audit(){
    const missing=checks.filter(([,sel])=>!document.querySelector(sel)).map(([name])=>name);
    const functions={waveFollow:!!window.__hksWaveFollow128,waveZoom:!!window.__hksWaveView125,finalPlayback:!!window.__hksFinalPlayback124,externalDisplay:!!window.__hksExternalDisplay126};
    window.__hksDesktopParity130={ok:missing.length===0,missing,functions,checkedAt:Date.now()};
    let badge=document.getElementById('hksDesktopParity130');
    if(!badge){badge=document.createElement('div');badge.id='hksDesktopParity130';(document.querySelector('header')||document.body).appendChild(badge)}
    badge.style.cssText='font-size:10px;font-weight:900;padding:3px 7px;border-radius:7px;margin-inline:5px;white-space:nowrap';
    if(!missing.length){badge.textContent='Windows • כל תכונות v1.128 נטענו';badge.style.background='#123c26';badge.style.color='#9ff0bd';}
    else{badge.textContent='Windows • חסרות תכונות: '+missing.join(', ');badge.style.background='#5a1717';badge.style.color='#ffd4d4';console.error('[Windows parity v130] missing',missing)}
    const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.128 • Windows v1.130';
  }
  setTimeout(audit,250);
  window.__hksDesktopAudit130=audit;
})();