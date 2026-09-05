// Avi Karaoke Studio Web v1.132 — faster/stall-safe iPhone renderer support
// Keeps v1.131 output quality and render flow, but makes FFmpeg quieter,
// throttles UI progress work and adds an outer no-progress watchdog.
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const LOAD_TIMEOUT=90*1000;
  const STALL_TIMEOUT=180*1000;
  const STALL_POLL=10*1000;

  function directState(text,progress){
    const e=$('#exportState'),p=$('#exportProgress'),s=$('#status');
    if(e)e.textContent=text;
    if(p&&Number.isFinite(progress))p.value=Math.max(0,Math.min(100,progress));
    if(s)s.textContent=text;
  }
  function withTimeout(promise,ms,message,onTimeout){
    return new Promise((resolve,reject)=>{
      let done=false;
      const finish=(fn,v)=>{if(done)return;done=true;clearTimeout(timer);fn(v)};
      const timer=setTimeout(()=>{try{onTimeout?.()}catch(_){}finish(reject,new Error(message))},ms);
      Promise.resolve(promise).then(v=>finish(resolve,v),e=>finish(reject,e));
    });
  }

  // v1.131 calls the global loadFFmpeg at each encode stage. Override it here so
  // MP4 and WMV both get a fresh, low-overhead worker without changing render output.
  loadFFmpeg=async function(){
    if(ffmpegInstance)return ffmpegInstance;
    let f=null;
    try{
      directState('שלב 1 — טוען מנוע רינדור מהיר לאייפון…',2);
      const mods=await withTimeout(Promise.all([
        import('./vendor/ffmpeg/ffmpeg/ios.js?v=132'),
        import('./vendor/ffmpeg/util/index.js')
      ]),20000,'לא הצלחתי לפתוח את מנוע FFmpeg המקומי');
      const {FFmpeg}=mods[0],{fetchFile}=mods[1];
      f=new FFmpeg();

      let lastHeartbeat=Date.now(),lastPaint=0,lastProgress=0;
      // Intentionally do not attach the verbose FFmpeg log stream to the DOM on iPhone.
      // The old logger appended thousands of strings to #renderLog during long exports.
      f.on('progress',({progress})=>{
        const now=Date.now(),v=Math.max(0,Math.min(1,Number(progress)||0));
        lastHeartbeat=now;
        if(now-lastPaint<250&&v<0.995&&v>=lastProgress)return;
        lastPaint=now;lastProgress=v;
        if(renderStage==='mp4')directState('שלב 2/4 — מרנדר MP4 באייפון…',18+v*56);
        else if(renderStage==='wmv')directState('שלב 3/4 — יוצר WMV במנוע נקי…',80+v*15);
      });

      const base=new URL('./vendor/ffmpeg/core/',location.href).href;
      directState('שלב 1 — מפעיל FFmpeg מקומי…',5);
      await withTimeout(
        f.load({coreURL:base+'ffmpeg-core.js',wasmURL:base+'ffmpeg-core.wasm'}),
        LOAD_TIMEOUT,
        'מנוע FFmpeg לא נפתח בזמן',
        ()=>f?.terminate?.()
      );

      const rawExec=f.exec.bind(f);
      f.exec=(args,timeout=-1)=>{
        lastHeartbeat=Date.now();lastPaint=0;lastProgress=0;
        return new Promise((resolve,reject)=>{
          let settled=false;
          let hard=null;
          const finish=(fn,v)=>{if(settled)return;settled=true;clearInterval(stall);if(hard)clearTimeout(hard);fn(v)};
          const stop=(message)=>{try{f.terminate()}catch(_){}finish(reject,new Error(message))};
          const stall=setInterval(()=>{
            if(Date.now()-lastHeartbeat>STALL_TIMEOUT)stop('מנוע הרינדור לא התקדם במשך 3 דקות ולכן הופעל מחדש כדי למנוע תקיעה');
          },STALL_POLL);
          if(timeout>0)hard=setTimeout(()=>stop('הרינדור עבר את מגבלת הזמן של השלב ונעצר בצורה בטוחה'),timeout+15000);
          Promise.resolve(rawExec(args,timeout)).then(v=>finish(resolve,v),e=>finish(reject,e));
        });
      };

      ffmpegFetchFile=fetchFile;
      ffmpegInstance=f;
      directState('מנוע FFmpeg מוכן — מצב iPhone מהיר',8);
      return f;
    }catch(e){
      try{f?.terminate?.()}catch(_){}
      try{if(ffmpegInstance===f)ffmpegInstance=null}catch(_){}
      directState('שגיאת מנוע: '+(e?.message||e),0);
      throw e;
    }
  };

  const log=$('#renderLog');
  if(log)log.textContent='מצב iPhone מהיר v1.132 — לוג FFmpeg פנימי מצומצם לחיסכון בזיכרון ובזמן רינדור.';
  const ver=$('.version');if(ver)ver.textContent='Web v1.132';
  try{navigator.serviceWorker?.register?.('sw.js?v=132',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
