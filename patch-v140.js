// Avi Karaoke Studio Web v1.140 — iPhone Safe audio fix: MP4 AAC 320k + WMV uncompressed PCM WAV-quality
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const safe=()=>{const m=$('#hksIPhoneRenderMode135');return !m||m.value==='safe720'};

  function ensureOption(sel,value,label){
    if(!sel)return;
    if(!sel.dataset.hksOriginalAudio140)sel.dataset.hksOriginalAudio140=String(sel.value||'');
    let opt=[...sel.options].find(o=>String(o.value)===String(value));
    if(!opt){opt=document.createElement('option');opt.value=String(value);sel.appendChild(opt)}
    opt.textContent=label;sel.value=String(value);sel.dataset.hksEffectiveAudio140=String(value);
  }
  function restoreAudio(sel){
    if(!sel)return;const old=sel.dataset.hksOriginalAudio140;
    if(old&&[...sel.options].some(o=>String(o.value)===old))sel.value=old;
    delete sel.dataset.hksEffectiveAudio140;
  }
  function syncAudioUI(){
    const mp4=$('#mp4Audio')||$('#audioQuality');
    const wmv=$('#wmvAudio')||mp4;
    if(safe()){
      ensureOption(mp4,'320','AAC 320 kbps — 48kHz • MP4 iPhone Safe');
      if(wmv!==mp4)ensureOption(wmv,'1536','PCM לא דחוס — 48kHz / 16-bit / Stereo • 1536 kbps');
      const hint=$('#hksIPhoneRenderHint135');
      if(hint)hint.textContent='פעיל עכשיו: 720p/30fps • MP4 עד 6 Mbps + AAC 320 kbps • WMV 4 Mbps + PCM לא דחוס 48kHz/16-bit/Stereo (כמו WAV, 1536 kbps).';
    }else{
      restoreAudio(mp4);if(wmv!==mp4)restoreAudio(wmv);
    }
    try{window.__hksExportEstimate137?.()}catch(_){}
  }

  // Keep MP4 on a codec/rate combination that FFmpeg AAC accepts on iPhone.
  const oldExportPreset=exportPreset;
  exportPreset=function(){
    const p=oldExportPreset();if(safe()){p.audioK='320k';p.audioCodec='aac';p.audioRate=48000;p.audioChannels=2}return p;
  };
  // WMV Safe mode is intentionally lossless/uncompressed PCM audio.
  const oldWmvPreset=window.wmvExportPreset;
  window.wmvExportPreset=function(){
    const p=typeof oldWmvPreset==='function'?oldWmvPreset():oldExportPreset();
    if(safe()){p.audioK='1536k';p.audioCodec='pcm_s16le';p.audioRate=48000;p.audioChannels=2}return p;
  };

  function setArg(args,key,val){const i=args.indexOf(key);if(i>=0&&i+1<args.length)args[i+1]=String(val);else args.splice(Math.max(0,args.length-1),0,key,String(val))}
  function removeArg(args,key,withValue=true){let i;while((i=args.indexOf(key))>=0)args.splice(i,withValue?2:1)}
  function sanitizeAudio(args){
    if(!safe()||!Array.isArray(args))return args;
    const a=[...args],out=String(a[a.length-1]||'').toLowerCase();
    if(out.endsWith('.mp4')){
      setArg(a,'-c:a','aac');setArg(a,'-b:a','320k');setArg(a,'-ar','48000');setArg(a,'-ac','2');
      window.__hksAudioCommand140={type:'mp4',codec:'aac',bitrate:'320k',rate:48000,channels:2};
    }else if(out.endsWith('.wmv')){
      setArg(a,'-c:a','pcm_s16le');removeArg(a,'-b:a');setArg(a,'-ar','48000');setArg(a,'-ac','2');
      window.__hksAudioCommand140={type:'wmv',codec:'pcm_s16le',bitrate:'1536k-equivalent',rate:48000,bits:16,channels:2};
    }
    return a;
  }

  // Final guard: rewrite the real FFmpeg command immediately before execution.
  const baseLoad=loadFFmpeg;
  loadFFmpeg=async function(){
    const f=await baseLoad();if(f.__hksAudio140)return f;f.__hksAudio140=true;
    const rawExec=f.exec.bind(f);f.exec=(args,timeout=-1)=>rawExec(sanitizeAudio(args),timeout);return f;
  };

  function bind(){
    const mode=$('#hksIPhoneRenderMode135'),mp4=$('#mp4Audio')||$('#audioQuality'),wmv=$('#wmvAudio')||mp4;
    [mode,mp4,wmv].forEach(el=>{if(!el||el.dataset.hksAudioBound140)return;el.dataset.hksAudioBound140='1';el.addEventListener('change',()=>setTimeout(syncAudioUI,0))});
    syncAudioUI();
  }
  bind();[80,300,900,1800].forEach(ms=>setTimeout(bind,ms));
  new MutationObserver(()=>setTimeout(bind,0)).observe(document.documentElement,{subtree:true,childList:true});

  const log=$('#renderLog');if(log)log.textContent='מצב iPhone Safe v1.140 — MP4: AAC 320k / WMV: PCM לא דחוס 48kHz 16-bit Stereo (WAV-quality).';
  const ver=$('.version');if(ver)ver.textContent='Web v1.140';
  try{navigator.serviceWorker?.register?.('sw.js?v=140',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
