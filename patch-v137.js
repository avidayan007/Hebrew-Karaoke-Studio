// Avi Karaoke Studio Web v1.137 — iPhone FFmpeg cache/load fix + reliable safe-mode estimate
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const SW_VERSION='hks-v137';
  const LOAD_TIMEOUT=180*1000;

  function state(text,progress){
    try{setExportState(text,progress)}catch(_){
      const e=$('#exportState'),p=$('#exportProgress'),s=$('#status');
      if(e)e.textContent=text;if(p&&Number.isFinite(progress))p.value=Math.max(0,Math.min(100,progress));if(s)s.textContent=text;
    }
  }
  function timeout(p,ms,msg,onTimeout){
    return new Promise((resolve,reject)=>{
      let done=false;const finish=(fn,v)=>{if(done)return;done=true;clearTimeout(t);fn(v)};
      const t=setTimeout(()=>{try{onTimeout?.()}catch(_){}finish(reject,new Error(msg))},ms);
      Promise.resolve(p).then(v=>finish(resolve,v),e=>finish(reject,e));
    });
  }
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  function pingSW(){
    return new Promise(resolve=>{
      const c=navigator.serviceWorker?.controller;if(!c)return resolve('');
      const ch=new MessageChannel(),t=setTimeout(()=>resolve(''),1500);
      ch.port1.onmessage=e=>{clearTimeout(t);resolve(String(e.data||''))};
      try{c.postMessage({type:'HKS_SW_VERSION'},[ch.port2])}catch(_){clearTimeout(t);resolve('')}
    });
  }
  async function ensureSW137(){
    if(!('serviceWorker' in navigator))return;
    try{
      const reg=await navigator.serviceWorker.register('sw.js?v=137',{updateViaCache:'none'});
      try{await reg.update()}catch(_){}
      let v=await pingSW();if(v===SW_VERSION)return;
      await Promise.race([
        new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),
        sleep(12000)
      ]);
      v=await pingSW();
      window.__hksSW137=v||'unknown';
    }catch(e){console.warn('[v137 service worker]',e)}
  }

  async function newEngine137(attempt){
    state(attempt===1?'שלב 1 — טוען מנוע FFmpeg לאייפון…':'שלב 1 — ניסיון נוסף לפתיחת FFmpeg…',attempt===1?2:3);
    const mods=await timeout(Promise.all([
      import('./vendor/ffmpeg/ffmpeg/ios.js?v=137'),
      import('./vendor/ffmpeg/util/index.js?v=137')
    ]),30000,'לא הצלחתי לטעון את קבצי מנוע FFmpeg');
    const {FFmpeg}=mods[0],{fetchFile}=mods[1];
    const f=new FFmpeg(),errors=[];let lastPaint=0,lastProgress=0;
    f.on('log',({message})=>{
      const m=String(message||'').trim();if(!m)return;
      if(/error|failed|invalid|memory|abort|cannot|unable|allocation|killed|fatal/i.test(m)){
        errors.push(m);if(errors.length>10)errors.shift();window.__hksLastFFmpegError137=m;
      }
    });
    f.on('progress',({progress})=>{
      const now=Date.now(),v=Math.max(0,Math.min(1,Number(progress)||0));
      if(now-lastPaint<350&&v<.995&&v>=lastProgress)return;lastPaint=now;lastProgress=v;
      if(renderStage==='mp4')state('שלב 2/4 — מרנדר MP4…',18+v*44);
      else if(renderStage==='wmv')state('שלב 3/4 — יוצר WMV…',74+v*22);
    });
    const base=new URL('./vendor/ffmpeg/core/',location.href).href;
    try{
      // v1.137 service worker deliberately does NOT intercept /vendor/ffmpeg/**.
      // Safari can therefore reuse its normal HTTP cache instead of downloading the 32 MB WASM again per worker.
      await timeout(
        f.load({coreURL:base+'ffmpeg-core.js',wasmURL:base+'ffmpeg-core.wasm'}),
        LOAD_TIMEOUT,
        `מנוע FFmpeg לא נפתח בתוך ${Math.round(LOAD_TIMEOUT/60000)} דקות`,
        ()=>f?.terminate?.()
      );
    }catch(e){try{f.terminate()}catch(_){};throw e}

    const rawExec=f.exec.bind(f);
    f.exec=async(args,limit=-1)=>{
      let a=[...args];
      const x=a.indexOf('libx264');
      if(x>=0&&!a.includes('-x264-params'))a.splice(x+1,0,'-threads','1','-tune','zerolatency','-x264-params','ref=1:bframes=0:rc-lookahead=0:sync-lookahead=0:scenecut=0');
      const w=a.indexOf('wmv2');if(w>=0&&!a.includes('-threads'))a.splice(w+1,0,'-threads','1');
      errors.length=0;window.__hksLastFFmpegError137='';
      const hard=limit>0?limit+45000:25*60*1000;
      const rc=await timeout(rawExec(a,limit),hard,'הרינדור עבר את מגבלת הזמן',()=>f?.terminate?.());
      if(rc!==0){const detail=errors.slice(-3).join(' | ')||window.__hksLastFFmpegError137||`FFmpeg code ${rc}`;throw new Error(`FFmpeg עצר: ${detail}`)}
      return rc;
    };
    return{f,fetchFile};
  }

  loadFFmpeg=async function(){
    if(ffmpegInstance)return ffmpegInstance;
    if(window.__hksFFmpegLoading137)return window.__hksFFmpegLoading137;
    window.__hksFFmpegLoading137=(async()=>{
      await ensureSW137();
      let last=null;
      for(let attempt=1;attempt<=2;attempt++){
        try{
          const r=await newEngine137(attempt);ffmpegFetchFile=r.fetchFile;ffmpegInstance=r.f;
          state(attempt===1?'מנוע FFmpeg מוכן — cache מהיר פעיל':'מנוע FFmpeg מוכן לאחר ניסיון נוסף',6);
          window.__hksFFmpegLoadAttempt137=attempt;return r.f;
        }catch(e){
          last=e;try{if(ffmpegInstance){ffmpegInstance.terminate?.();ffmpegInstance=null}}catch(_){}
          if(attempt<2){state('הפתיחה הראשונה לא הצליחה — מפנה את המנוע ומנסה שוב…',2);await sleep(800)}
        }
      }
      throw last||new Error('FFmpeg לא נפתח');
    })();
    try{return await window.__hksFFmpegLoading137}
    catch(e){state('שגיאת מנוע: '+(e?.message||e),0);throw e}
    finally{window.__hksFFmpegLoading137=null}
  };

  // The old v1.127 estimate has delayed event handlers that could overwrite the safe-mode numbers.
  // v1.137 keeps the visible estimate synchronized with the renderer that actually runs on iPhone.
  function fmtMB(bytes){const mb=bytes/1e6;return mb<1000?`${Math.round(mb)} MB`:`${(mb/1000).toFixed(2)} GB`}
  function safeEstimate137(){
    const mode=$('#hksIPhoneRenderMode135')?.value||'safe720';
    if(mode!=='safe720')return;
    const aEl=$('#audio'),d=Number(aEl?.duration)||0;if(!(d>0))return;
    const a=Number(($('#mp4Audio')||$('#audioQuality'))?.value||320)||320;
    const wa=Number(($('#wmvAudio')||$('#audioQuality'))?.value||320)||320;
    const mp4=((6e6+a*1000)*d/8)*1.02,wmv=((4e6+wa*1000)*d/8)*1.04;
    const m=$('#hksEstimateMp4127'),w=$('#hksEstimateWmv127'),note=$('#hksEstimateNote127');
    const mt=`MP4: עד ≈ ${fmtMB(mp4)}`,wt=`WMV: ≈ ${fmtMB(wmv)}`;
    const mins=Math.floor(d/60),secs=String(Math.floor(d%60)).padStart(2,'0');
    const nt=`iPhone Safe v1.137 • ${mins}:${secs} • 720p/30fps • MP4 עד 6 Mbps • WMV 4 Mbps • ההערכה מותאמת למסלול הרינדור בפועל.`;
    if(m&&m.textContent!==mt)m.textContent=mt;if(w&&w.textContent!==wt)w.textContent=wt;if(note&&note.textContent!==nt)note.textContent=nt;
  }
  window.__hksExportEstimate137=safeEstimate137;
  window.__hksExportEstimate127=safeEstimate137;
  const scheduleEstimate=()=>[0,100,500,1300].forEach(ms=>setTimeout(safeEstimate137,ms));
  ['change','input','loadedmetadata','durationchange'].forEach(ev=>document.addEventListener(ev,scheduleEstimate,true));
  const box=$('#hksExportSizeEstimate127');if(box){
    new MutationObserver(()=>setTimeout(safeEstimate137,0)).observe(box,{subtree:true,characterData:true,childList:true});
  }
  scheduleEstimate();

  const log=$('#renderLog');if(log)log.textContent='מצב iPhone v1.137 — FFmpeg עם cache יציב: קובץ המנוע הגדול אינו יורד מחדש בכל שלב.';
  const ver=$('.version');if(ver)ver.textContent='Web v1.137';
  ensureSW137();
})();
