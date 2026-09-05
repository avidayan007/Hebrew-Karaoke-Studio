// Avi Karaoke Studio Web v1.136 — safe WMV from successful MP4 + correct iPhone size estimate
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  let storedMp4=null;

  function argValue(args,key,fallback){const i=Array.isArray(args)?args.indexOf(key):-1;return i>=0&&args[i+1]!=null?String(args[i+1]):fallback}
  async function clearPreparedInputs(f){
    try{
      const list=await f.listDir('/');
      for(const it of list||[]){
        const n=it?.name||'';
        if(it?.isDir)continue;
        if(/^(audio_input|background|overlay_\d+\.png$|overlays\.ffconcat$|source136\.mp4$)/.test(n)){
          try{await f.deleteFile(n)}catch(_){}
        }
      }
    }catch(_){}
  }

  // v1.135 owns the stable FFmpeg loader. Wrap each new worker so the MP4 bytes
  // are remembered once, then WMV is transcoded from that smaller MP4 in a fresh worker.
  const baseLoad=loadFFmpeg;
  loadFFmpeg=async function(){
    const f=await baseLoad();
    if(f.__hksWrapped136)return f;
    f.__hksWrapped136=true;
    const rawRead=f.readFile.bind(f),rawExec=f.exec.bind(f);
    f.readFile=async function(path,encoding='binary'){
      const data=await rawRead(path,encoding);
      if(renderStage==='mp4'&&String(path)==='output.mp4'&&data instanceof Uint8Array&&data.byteLength>1000){
        storedMp4=data;window.__hksMp4Bytes136=data.byteLength;
      }
      return data;
    };
    f.exec=async function(args,timeout=-1){
      if(renderStage==='wmv'&&storedMp4&&Array.isArray(args)&&args.includes('output.wmv')){
        setExportState('שלב 3/4 — WMV: מפנה קבצי מקור ומשתמש ב‑MP4 המוכן…',75);
        await clearPreparedInputs(f);
        const source=storedMp4;storedMp4=null;
        await f.writeFile('source136.mp4',source);
        const mode=$('#hksIPhoneRenderMode135')?.value||'safe720';
        const videoK=mode==='safe720'?'4M':argValue(args,'-b:v','8M');
        const audioK=argValue(args,'-b:a','320k');
        setExportState(`שלב 3/4 — ממיר MP4 ל‑WMV (${videoK}) במנוע חדש…`,78);
        try{
          const rc=await rawExec(['-i','source136.mp4','-c:v','wmv2','-b:v',videoK,'-c:a','wmav2','-b:a',audioK,'output.wmv'],timeout);
          try{await f.deleteFile('source136.mp4')}catch(_){}
          return rc;
        }catch(e){try{await f.deleteFile('source136.mp4')}catch(_){};throw e}
      }
      return rawExec(args,timeout);
    };
    return f;
  };

  function fmtMB(bytes){const mb=bytes/1e6;return mb<1000?`${Math.round(mb)} MB`:`${(mb/1000).toFixed(2)} GB`}
  function safeEstimate(){
    const mode=$('#hksIPhoneRenderMode135')?.value||'safe720';if(mode!=='safe720'){try{window.__hksExportEstimate127?.()}catch(_){};return}
    const audio=$('#audio'),d=Number(audio?.duration)||0;if(!(d>0))return;
    const a=Number($('#mp4Audio')?.value||320)||320,wa=Number($('#wmvAudio')?.value||320)||320;
    const mp4Max=((6e6+a*1000)*d/8)*1.02,wmv=((4e6+wa*1000)*d/8)*1.04;
    const m=$('#hksEstimateMp4127'),w=$('#hksEstimateWmv127'),note=$('#hksEstimateNote127');
    if(m)m.textContent=`MP4: עד ≈ ${fmtMB(mp4Max)}`;
    if(w)w.textContent=`WMV: ≈ ${fmtMB(wmv)}`;
    if(note)note.textContent='iPhone Safe v1.136 • 720p • MP4 עד 6 Mbps בדחיסה לפי איכות • WMV 4 Mbps • הערכה זו מותאמת למסלול הרינדור בפועל באייפון.';
  }
  const mode=$('#hksIPhoneRenderMode135');mode?.addEventListener('change',()=>setTimeout(safeEstimate,0));
  $('#audio')?.addEventListener('loadedmetadata',()=>setTimeout(safeEstimate,0));
  ['mp4Audio','wmvAudio'].forEach(id=>$('#'+id)?.addEventListener('change',safeEstimate));
  setTimeout(safeEstimate,200);

  window.__hksRender136={get mp4Bytes(){return window.__hksMp4Bytes136||0},estimate:safeEstimate};
  const ver=$('.version');if(ver)ver.textContent='Web v1.136';
  try{navigator.serviceWorker?.register?.('sw.js?v=136',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
