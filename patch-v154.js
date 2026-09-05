// Avi Karaoke Studio Web v1.154 — Export follows the ACTUAL iPhone custom fullscreen (hksPhoneFullscreen)
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const preview=$('#preview'),lyrics=$('#lyricsPreview');
  const brandL=preview?.querySelector('.brandL'),brandR=preview?.querySelector('.brandR');
  const title=$('#hksSongTitleText');
  if(!preview||!lyrics)return;

  const KEY='hksFullscreenExportMetrics154';
  let fullSnap=null;
  let armed=false;
  window.__hksFullscreenExportParity154=true;

  const n=v=>Number.isFinite(parseFloat(v))?parseFloat(v):0;
  const clone=v=>{try{return structuredClone(v)}catch(_){return JSON.parse(JSON.stringify(v))}};
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const lineRatio=(cs,fs)=>{const lh=n(cs?.lineHeight);return lh>0&&fs>0?lh/fs:1.15};

  function readSaved(){
    try{
      const v=JSON.parse(localStorage.getItem(KEY)||'null');
      if(v&&v.width>40&&v.height>40&&v.lyrics)return v;
    }catch(_){}
    return null;
  }
  fullSnap=readSaved();

  function metricFromRect(el,pr,defaults={}){
    if(!el)return null;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect(),fs=n(cs.fontSize);
    return {
      fontH:fs/Math.max(1,pr.height),
      lineRatio:lineRatio(cs,fs),
      left:(r.left-pr.left)/Math.max(1,pr.width),
      right:(pr.right-r.right)/Math.max(1,pr.width),
      top:(r.top-pr.top)/Math.max(1,pr.height),
      centerX:((r.left+r.width/2)-pr.left)/Math.max(1,pr.width),
      centerY:((r.top+r.height/2)-pr.top)/Math.max(1,pr.height),
      width:r.width/Math.max(1,pr.width),
      textShadow:cs.textShadow||'none',
      ...defaults
    };
  }

  function currentFontPx(el,fallback){
    if(!el)return fallback;
    const inline=parseFloat(el.style.fontSize);
    if(Number.isFinite(inline)&&inline>0)return inline;
    const cs=n(getComputedStyle(el).fontSize);
    return cs>0?cs:fallback;
  }

  // This reproduces the CSS fullscreen used by v1.34 even when the user has not
  // opened it in the current session yet. Once real fullscreen is opened, the
  // measured snapshot below becomes authoritative.
  function virtualFullscreenSnap(){
    const w=Math.max(1,window.innerWidth||screen.width||1280);
    const h=Math.max(1,window.innerHeight||screen.height||720);
    const fake={left:0,top:0,right:w,bottom:h,width:w,height:h};
    const lyricCs=getComputedStyle(lyrics);
    let lyricFs=currentFontPx(lyrics,48);
    // v1.34 fullscreen rule is clamp(26px,6vw,64px). Inline !important from the
    // user's font control wins; otherwise use the fullscreen clamp itself.
    if(!lyrics.style.fontSize || lyrics.style.getPropertyPriority('font-size')!=='important'){
      lyricFs=clamp(w*.06,26,64);
    }
    const lm=metricFromRect(lyrics,fake,{centerX:.5,centerY:.5,width:.94});
    if(lm){lm.fontH=lyricFs/h;lm.centerX=.5;lm.centerY=.5;lm.width=.94;lm.left=.03;lm.right=.03;lm.top=.5;lm.lineRatio=lineRatio(lyricCs,lyricFs)}

    const bl=metricFromRect(brandL,fake)||{};
    const br=metricFromRect(brandR,fake)||{};
    if(brandL){const fs=currentFontPx(brandL,18);bl.fontH=fs/h;bl.left=12/w;bl.right=0;bl.top=10/h;bl.centerY=(10+fs/2)/h;bl.width=Math.max(.01,brandL.getBoundingClientRect().width/w)}
    if(brandR){const fs=currentFontPx(brandR,18);br.fontH=fs/h;br.right=12/w;br.left=0;br.top=10/h;br.centerY=(10+fs/2)/h;br.width=Math.max(.01,brandR.getBoundingClientRect().width/w)}

    const ts=window.__hksSongTitleState||{};
    const titleFs=Math.max(1,Number(ts.size)||currentFontPx(title,72));
    const tcs=title?getComputedStyle(title):null;
    const tm={
      fontH:titleFs/h,lineRatio:lineRatio(tcs,titleFs),left:.03,right:.03,top:.5,
      centerX:.5,centerY:.5,width:.94,textShadow:tcs?.textShadow||'none'
    };
    return {width:w,height:h,lyrics:lm,brandL:bl,brandR:br,title:tm,capturedAt:Date.now(),source:'virtual-hksPhoneFullscreen'};
  }

  function captureActualFullscreen(reason='fullscreen'){
    if(!preview.classList.contains('hksPhoneFullscreen'))return fullSnap;
    const pr=preview.getBoundingClientRect();
    if(!(pr.width>40&&pr.height>40))return fullSnap;
    const lm=metricFromRect(lyrics,pr);
    const bl=metricFromRect(brandL,pr);
    const br=metricFromRect(brandR,pr);
    const ts=window.__hksSongTitleState||{};
    const titleFs=Math.max(1,Number(ts.size)||currentFontPx(title,72));
    const tcs=title?getComputedStyle(title):null;

    // The song-title slide is flex-centered in the real fullscreen. Do not read
    // getBoundingClientRect() while it is hidden: hidden title nodes report 0,0
    // and that was the reason the previous export placed the title incorrectly.
    const tm={
      fontH:titleFs/pr.height,lineRatio:lineRatio(tcs,titleFs),left:.03,right:.03,top:.5,
      centerX:.5,centerY:.5,width:.94,textShadow:tcs?.textShadow||'none'
    };

    fullSnap={
      width:pr.width,height:pr.height,
      lyrics:lm?{...lm,centerX:clamp(lm.centerX,0,1),centerY:clamp(lm.centerY,0,1)}:null,
      brandL:bl,brandR:br,title:tm,
      capturedAt:Date.now(),source:'actual-hksPhoneFullscreen',reason
    };
    try{localStorage.setItem(KEY,JSON.stringify(fullSnap))}catch(_){}
    window.__hksFullscreenMetrics154=clone(fullSnap);
    return fullSnap;
  }

  function snapshotForExport(){
    // Prefer the real measured fullscreen. If none was measured in this session,
    // build the same hksPhoneFullscreen geometry from the current viewport.
    const s=fullSnap||virtualFullscreenSnap();
    if(!s)return null;
    const out=clone(s);

    // Keep current user-selected sizes even if they were changed after the last
    // fullscreen visit; positions remain those of the real fullscreen snapshot.
    const H=Math.max(1,Number(out.height)||window.innerHeight||720);
    if(out.lyrics){
      let fs=currentFontPx(lyrics,48);
      if(!lyrics.style.fontSize || lyrics.style.getPropertyPriority('font-size')!=='important')fs=clamp((Number(out.width)||1280)*.06,26,64);
      out.lyrics.fontH=fs/H;
      out.lyrics.lineRatio=lineRatio(getComputedStyle(lyrics),fs);
    }
    if(out.brandL&&brandL)out.brandL.fontH=currentFontPx(brandL,18)/H;
    if(out.brandR&&brandR)out.brandR.fontH=currentFontPx(brandR,18)/H;
    if(out.title){
      const ts=window.__hksSongTitleState||{};
      const fs=Math.max(1,Number(ts.size)||currentFontPx(title,72));
      out.title.fontH=fs/H;out.title.centerX=.5;out.title.centerY=.5;out.title.width=.94;
    }
    out.capturedAt=Date.now();out.source=(s.source||'fullscreen')+'-export';
    return out;
  }

  function injectFullscreenMetrics(){
    const s=snapshotForExport();if(!s)return false;
    armed=true;
    // v1.153's real iPhone Canvas renderer reads this exact object when the
    // Studio preview is hidden on the Export page. Feeding it the fullscreen
    // snapshot makes Canvas use the full-screen font ratios and positions.
    window.__hksPreviewMetrics152=clone(s);
    window.__hksFullscreenExportSnapshot154=clone(s);
    return true;
  }

  function scheduleCapture(reason){
    [0,60,180,420].forEach(ms=>setTimeout(()=>{
      if(preview.classList.contains('hksPhoneFullscreen'))captureActualFullscreen(reason);
    },ms));
  }

  // Watch only the preview class, not the whole DOM: this is cheap on iPhone.
  new MutationObserver(()=>{
    if(preview.classList.contains('hksPhoneFullscreen'))scheduleCapture('class-enter');
  }).observe(preview,{attributes:true,attributeFilter:['class']});

  ['hksPreviewExpand','hksFullscreenBelowSmall','fullBtn'].forEach(id=>{
    document.getElementById(id)?.addEventListener('click',()=>scheduleCapture('fullscreen-button'),true);
  });
  window.addEventListener('resize',()=>{
    if(preview.classList.contains('hksPhoneFullscreen'))scheduleCapture('fullscreen-resize');
  });
  ['input','change','click'].forEach(evt=>document.addEventListener(evt,e=>{
    const id=String(e.target?.id||'');
    if(!/(hksFont|hksSongTitle|hksCornerBrand|hksBrand|hksLyrics|hksLinesPerScreen)/i.test(id))return;
    if(preview.classList.contains('hksPhoneFullscreen'))scheduleCapture('fullscreen-control');
  },true));

  // Important: v1.153 registered its own handlers first. These capture-phase
  // hooks run before the render button's onclick and inject the fullscreen
  // snapshot again immediately before every export stage begins.
  ['dualExportBtn','exportSetupStart'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    ['pointerdown','click'].forEach(evt=>el.addEventListener(evt,injectFullscreenMetrics,true));
  });
  document.querySelectorAll('[data-go="export"]').forEach(el=>{
    ['pointerdown','click'].forEach(evt=>el.addEventListener(evt,injectFullscreenMetrics,true));
  });

  // If another delayed v1.152 capture overwrites the global metrics while the
  // Export page is open, restore fullscreen metrics on the next render click.
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&armed)injectFullscreenMetrics()});

  window.__hksFullscreenExport154={
    capture:()=>captureActualFullscreen('api'),
    inject:injectFullscreenMetrics,
    get snapshot(){return clone(fullSnap||virtualFullscreenSnap())},
    get armed(){return armed}
  };

  // If the app was opened while already in custom fullscreen (restore/PWA edge case).
  if(preview.classList.contains('hksPhoneFullscreen'))scheduleCapture('startup-fullscreen');

  const ver=$('.version');if(ver)ver.textContent='Web v1.154';
  try{setStatus('v1.154 מוכן — ה-Export משתמש במידות של מסך מלא באייפון, לא בריבוע הקטן.')}catch(_){}
})();
