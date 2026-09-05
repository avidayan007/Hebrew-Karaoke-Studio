// Avi Karaoke Studio Web v1.140 — fix iPhone Safe audio encoder mismatch (AAC 1536k crash)
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const safe=()=>{const m=$('#hksIPhoneRenderMode135');return !m||m.value==='safe720'};

  // ---------- make the visible audio settings match the real iPhone-safe encoders ----------
  function ensure320(sel,label){
    if(!sel)return;
    if(!sel.dataset.hksOriginalAudio140)sel.dataset.hksOriginalAudio140=String(sel.value||'');
    let opt=[...sel.options].find(o=>String(o.value)==='320');
    if(!opt){opt=document.createElement('option');opt.value='320';sel.appendChild(opt)}
    opt.textContent=label;
    sel.value='320';
    sel.dataset.hksEffectiveAudio140='320';
  }
  function restoreAudio(sel){
    if(!sel)return;
    const old=sel.dataset.hksOriginalAudio140;
    if(old&&[...sel.options].some(o=>String(o.value)===old))sel.value=old;
    delete sel.dataset.hksEffectiveAudio140;
  }
  function syncAudioUI(){
    const mp4=$('#mp4Audio')||$('#audioQuality');
    const wmv=$('#wmvAudio')||mp4;
    if(safe()){
      ensure320(mp4,'AAC 320 kbps — 48kHz • iPhone Safe');
      if(wmv!==mp4)ensure320(wmv,'WMA 320 kbps — 48kHz • iPhone Safe');
      const hint=$('#hksIPhoneRenderHint135');
      if(hint)hint.textContent='פעיל עכשיו: 720p/30fps • MP4 עד 6 Mbps + AAC 320 kbps / 48kHz • WMV 4 Mbps + WMA 320 kbps / 48kHz.';
    }else{
      restoreAudio(mp4);if(wmv!==mp4)restoreAudio(wmv);
    }
    try{window.__hksExportEstimate137?.()}catch(_){}
  }

  // ---------- force valid presets even if an older project leaves 1536 selected ----------
  const oldExportPreset=exportPreset;
  exportPreset=function(){
    const p=oldExportPreset();
    if(safe())p.audioK='320k';
    return p;
  };
  const oldWmvPreset=window.wmvExportPreset;
  window.wmvExportPreset=function(){
    const p=typeof oldWmvPreset==='function'?oldWmvPreset():oldExportPreset();
    if(safe())p.audioK='320k';
    return p;
  };

  function setArg(args,key,val){
    const i=args.indexOf(key);
    if(i>=0&&i+1<args.length)args[i+1]=String(val);
    else args.splice(Math.max(0,args.length-1),0,key,String(val));
  }
  function sanitizeAudio(args){
    if(!safe()||!Array.isArray(args))return args;
    const a=[...args],out=String(a[a.length-1]||'').toLowerCase();
    if(out.endsWith('.mp4')){
      setArg(a,'-c:a','aac');setArg(a,'-b:a','320k');setArg(a,'-ar','48000');setArg(a,'-ac','2');
      window.__hksAudioCommand140={type:'mp4',codec:'aac',bitrate:'320k',rate:48000,channels:2};
    }else if(out.endsWith('.wmv')){
      setArg(a,'-c:a','wmav2');setArg(a,'-b:a','320k');setArg(a,'-ar','48000');setArg(a,'-ac','2');
      window.__hksAudioCommand140={type:'wmv',codec:'wmav2',bitrate:'320k',rate:48000,channels:2};
    }
    return a;
  }

  // Last line of defence: rewrite the actual FFmpeg command immediately before exec.
  const baseLoad=loadFFmpeg;
  loadFFmpeg=async function(){
    const f=await baseLoad();
    if(f.__hksAudio140)return f;
    f.__hksAudio140=true;
    const rawExec=f.exec.bind(f);
    f.exec=(args,timeout=-1)=>rawExec(sanitizeAudio(args),timeout);
    return f;
  };

  function bind(){
    const mode=$('#hksIPhoneRenderMode135'),mp4=$('#mp4Audio')||$('#audioQuality'),wmv=$('#wmvAudio')||mp4;
    [mode,mp4,wmv].forEach(el=>{
      if(!el||el.dataset.hksAudioBound140)return;
      el.dataset.hksAudioBound140='1';el.addEventListener('change',()=>setTimeout(syncAudioUI,0));
    });
    syncAudioUI();
  }
  bind();[80,300,900,1800].forEach(ms=>setTimeout(bind,ms));
  new MutationObserver(()=>setTimeout(bind,0)).observe(document.documentElement,{subtree:true,childList:true});

  const log=$('#renderLog');
  if(log)log.textContent='מצב iPhone Safe v1.140 — 720p עם אודיו יציב: MP4 AAC 320k / WMV WMA 320k ב‑48kHz.';
  const ver=$('.version');if(ver)ver.textContent='Web v1.140';
  try{navigator.serviceWorker?.register?.('sw.js?v=140',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();