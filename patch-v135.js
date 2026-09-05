// Avi Karaoke Studio Web v1.135 — iPhone stable render mode + real FFmpeg errors
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);

  // ---------- iPhone render mode ----------
  const renderBtn=$('#dualExportBtn');
  let mode=$('#hksIPhoneRenderMode135');
  if(renderBtn&&!mode){
    const box=document.createElement('div');
    box.id='hksIPhoneRenderBox135';
    box.innerHTML=`<div style="font-weight:900;color:#f2cf79;margin-bottom:5px">מצב רינדור באייפון</div>
      <select id="hksIPhoneRenderMode135" style="width:100%;min-height:44px;border-radius:9px;background:#182331;color:#fff;border:1px solid #526a7d;padding:7px;font-weight:800">
        <option value="safe720" selected>מומלץ — 720p HD יציב ומהיר</option>
        <option value="1080">1080p Master — כבד / ניסיוני באייפון</option>
      </select>
      <div id="hksIPhoneRenderHint135" style="font-size:11px;color:#b8c7d6;margin-top:5px;line-height:1.4">720p משתמש פחות בזיכרון של Safari ושומר על איכות טובה מאוד למסך ולטלוויזיה.</div>`;
    box.style.cssText='margin:8px 0;padding:9px 10px;border:1px solid #35506a;border-radius:10px;background:#0b1622;direction:rtl';
    renderBtn.parentElement?.insertBefore(box,renderBtn);
    mode=$('#hksIPhoneRenderMode135');
  }
  const oldExportPreset=exportPreset;
  exportPreset=function(){
    const p=oldExportPreset();
    if((mode?.value||'safe720')==='safe720'){
      p.width=1280;p.height=720;p.fps=30;p.videoK='6M';
    }else{
      p.width=Math.min(1920,p.width||1920);p.height=1080;p.fps=Math.min(30,p.fps||30);if(p.videoK==='20M')p.videoK='12M';
    }
    return p;
  };
  const oldWmv=window.wmvExportPreset;
  window.wmvExportPreset=function(){
    const p=typeof oldWmv==='function'?oldWmv():oldExportPreset();
    if((mode?.value||'safe720')==='safe720'){
      p.width=1280;p.height=720;p.fps=30;p.videoK='6M';
    }else{
      p.width=Math.min(1920,p.width||1920);p.height=1080;p.fps=Math.min(30,p.fps||30);if(p.videoK==='20M')p.videoK='12M';
    }
    return p;
  };
  mode?.addEventListener('change',()=>{try{window.__hksExportEstimate127?.()}catch(_){};const h=$('#hksIPhoneRenderHint135');if(h)h.textContent=mode.value==='safe720'?'720p משתמש פחות בזיכרון של Safari ושומר על איכות טובה מאוד למסך ולטלוויזיה.':'1080p נשאר זמין, אבל עלול להיות איטי או להיכשל בגלל מגבלת הזיכרון של Safari.'});

  // ---------- Quiet, low-memory FFmpeg loader ----------
  loadFFmpeg=async function(){
    if(ffmpegInstance)return ffmpegInstance;
    const timeout=(p,ms,msg,onTimeout)=>new Promise((resolve,reject)=>{let done=false;const finish=(fn,v)=>{if(done)return;done=true;clearTimeout(t);fn(v)};const t=setTimeout(()=>{try{onTimeout?.()}catch(_){}finish(reject,new Error(msg))},ms);Promise.resolve(p).then(v=>finish(resolve,v),e=>finish(reject,e))});
    let f=null;
    try{
      setExportState('טוען מנוע FFmpeg יציב לאייפון…',2);
      const mods=await timeout(Promise.all([import('./vendor/ffmpeg/ffmpeg/ios.js?v=135'),import('./vendor/ffmpeg/util/index.js')]),20000,'לא הצלחתי לפתוח את מנוע FFmpeg');
      const {FFmpeg}=mods[0],{fetchFile}=mods[1];
      f=new FFmpeg();
      let lastPaint=0,lastProgress=0;const errors=[];
      window.__hksLastFFmpegErrors135=errors;
      f.on('log',({message})=>{
        const m=String(message||'').trim();if(!m)return;
        if(/error|failed|invalid|memory|abort|cannot|unable|allocation|killed|fatal/i.test(m)){
          errors.push(m);if(errors.length>8)errors.shift();window.__hksLastFFmpegError135=m;
        }
      });
      f.on('progress',({progress})=>{
        const now=Date.now(),v=Math.max(0,Math.min(1,Number(progress)||0));
        if(now-lastPaint<350&&v<.995&&v>=lastProgress)return;lastPaint=now;lastProgress=v;
        if(renderStage==='mp4')setExportState('שלב 2/4 — מרנדר MP4…',18+v*44);
        else if(renderStage==='wmv')setExportState('שלב 3/4 — יוצר WMV…',74+v*22);
      });
      const base=new URL('./vendor/ffmpeg/core/',location.href).href;
      await timeout(f.load({coreURL:base+'ffmpeg-core.js',wasmURL:base+'ffmpeg-core.wasm'}),90000,'מנוע FFmpeg לא נפתח בזמן',()=>f?.terminate?.());
      const rawExec=f.exec.bind(f);
      f.exec=async(args,limit=-1)=>{
        let a=[...args];
        // Minimize x264 frame buffers/lookahead on iOS. Keep H.264 compatibility.
        const x=a.indexOf('libx264');
        if(x>=0){
          const insert=x+1;
          a.splice(insert,0,'-threads','1','-tune','zerolatency','-x264-params','ref=1:bframes=0:rc-lookahead=0:sync-lookahead=0:scenecut=0');
        }
        const w=a.indexOf('wmv2');if(w>=0)a.splice(w+1,0,'-threads','1');
        errors.length=0;window.__hksLastFFmpegError135='';
        const hard=limit>0?limit+30000:25*60*1000;
        const rc=await timeout(rawExec(a,limit),hard,'הרינדור עבר את מגבלת הזמן',()=>f?.terminate?.());
        if(rc!==0){
          const detail=errors.slice(-3).join(' | ')||window.__hksLastFFmpegError135||`FFmpeg code ${rc}`;
          throw new Error(`FFmpeg עצר: ${detail}`);
        }
        return rc;
      };
      ffmpegFetchFile=fetchFile;ffmpegInstance=f;setExportState('מנוע FFmpeg מוכן — מצב iPhone יציב',6);return f;
    }catch(e){try{f?.terminate?.()}catch(_){}try{if(ffmpegInstance===f)ffmpegInstance=null}catch(_){}setExportState('שגיאת מנוע: '+(e?.message||e),0);throw e}
  };

  const oldEstimate=window.__hksExportEstimate127;
  setTimeout(()=>{try{oldEstimate?.()}catch(_){}},0);
  const ver=$('.version');if(ver)ver.textContent='Web v1.135';
  try{navigator.serviceWorker?.register?.('sw.js?v=135',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
