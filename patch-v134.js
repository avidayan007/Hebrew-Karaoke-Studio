// Avi Karaoke Studio Web v1.134 — iPhone low-memory direct dual renderer
// MP4: quality-based H.264 without faststart rewrite. WMV: rendered directly
// from source inputs in a fresh worker, so MP4+WMV are never held together in FFmpeg FS.
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const MP4_TIMEOUT=20*60*1000,WMV_TIMEOUT=20*60*1000;
  let renderName='karaoke',wakeLock=null,waveWasReleased=false;

  function cleanName(s){return String(s||'').trim().replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').replace(/^\.+|\.+$/g,'').slice(0,80)||'karaoke'}
  function escConcat(s){return String(s||'').replace(/'/g,"'\\''")}
  function fitCanvasFont(c,text,maxW,start,min){let size=start;while(size>min){c.font=`800 ${size}px Arial, sans-serif`;if(c.measureText(text).width<=maxW)break;size-=2}return size}
  function groups(duration){
    const maxLine=words.reduce((m,w)=>Math.max(m,w.line??0),0),out=[];
    for(let start=0;start<=maxLine;start+=4){
      const group=words.filter(w=>(w.line??0)>=start&&(w.line??0)<start+4),synced=group.filter(w=>Number.isFinite(Number(w.time)));
      if(!group.length||!synced.length)continue;
      const lines=[];for(let l=start;l<start+4;l++){const t=words.filter(w=>(w.line??0)===l).map(w=>w.t).join(' ');if(t)lines.push(t)}
      out.push({start:start===0?0:Math.min(...synced.map(w=>Number(w.time))),lines});
    }
    out.sort((a,b)=>a.start-b.start);
    for(let i=0;i<out.length;i++)out[i].end=i+1<out.length?Math.max(out[i].start+.05,out[i+1].start):duration;
    return out.filter(x=>x.end>x.start);
  }
  async function overlayBlob(lines,p){
    const cv=document.createElement('canvas');cv.width=p.width;cv.height=p.height;
    const c=cv.getContext('2d');c.clearRect(0,0,p.width,p.height);c.lineJoin='round';
    const bs=Math.round(p.height*.029),top=Math.round(p.height*.026),pad=Math.round(p.width*.026);
    c.font=`900 ${bs}px Arial, sans-serif`;c.lineWidth=Math.max(2,Math.round(bs*.12));c.strokeStyle='#fff';c.fillStyle='#2584e6';c.textBaseline='top';
    c.textAlign='left';c.direction='ltr';c.strokeText('Avi Dayan The Show',pad,top);c.fillText('Avi Dayan The Show',pad,top);
    c.textAlign='right';c.direction='rtl';c.strokeText('אבי דיין ההופעה',p.width-pad,top);c.fillText('אבי דיין ההופעה',p.width-pad,top);
    const gap=Math.round(p.height*.105),base=Math.round(p.height*.075),maxW=p.width*.90,firstY=p.height/2-((Math.max(lines.length,1)-1)*gap)/2;
    c.textAlign='center';c.textBaseline='middle';c.direction='rtl';
    lines.forEach((line,i)=>{const fs=fitCanvasFont(c,line,maxW,base,30);c.font=`800 ${fs}px Arial, sans-serif`;c.lineWidth=Math.max(5,Math.round(fs*.11));c.strokeStyle='#000';c.fillStyle='#fff';c.strokeText(line,p.width/2,firstY+i*gap,maxW);c.fillText(line,p.width/2,firstY+i*gap,maxW)});
    return new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(new Error('לא הצלחתי ליצור שכבת כתוביות')),'image/png'));
  }
  async function prepare(f,duration,p,label,from,to){
    setExportState(`${label} — מכין קבצים…`,from);
    const audioName='audio_input'+extOf(audioInputFile?.name,'.m4a');await f.writeFile(audioName,await ffmpegFetchFile(audioInputFile));
    let bgName=null,bgArgs=[];
    if(videoInputFile){bgName='background'+extOf(videoInputFile.name,'.mp4');await f.writeFile(bgName,await ffmpegFetchFile(videoInputFile));bgArgs=['-stream_loop','-1','-i',bgName]}
    else if(imageInputFile){bgName='background'+extOf(imageInputFile.name,'.jpg');await f.writeFile(bgName,await ffmpegFetchFile(imageInputFile));bgArgs=['-loop','1','-framerate',String(p.fps),'-i',bgName]}
    else bgArgs=['-f','lavfi','-i',`color=c=black:s=${p.width}x${p.height}:r=${p.fps}`];
    const slides=groups(duration),overlayNames=[];if(!slides.length)throw new Error('לא נמצאו שקופיות מסונכרנות לרינדור');
    for(let i=0;i<slides.length;i++){
      const name=`overlay_${String(i).padStart(3,'0')}.png`;overlayNames.push(name);
      await f.writeFile(name,await ffmpegFetchFile(await overlayBlob(slides[i].lines,p)));
      setExportState(`${label} — מכין כתוביות ${i+1}/${slides.length}…`,from+((i+1)/slides.length)*(to-from));
      if((i&3)===3)await new Promise(r=>setTimeout(r,0));
    }
    const manifest=['ffconcat version 1.0'];
    for(let i=0;i<slides.length;i++){manifest.push(`file '${escConcat(overlayNames[i])}'`);manifest.push(`duration ${Math.max(.01,slides[i].end-slides[i].start).toFixed(6)}`)}
    manifest.push(`file '${escConcat(overlayNames[overlayNames.length-1])}'`);
    await f.writeFile('overlays.ffconcat',new TextEncoder().encode(manifest.join('\n')+'\n'));
    return{audioName,bgName,bgArgs,overlayNames};
  }
  function terminate(f){try{f?.terminate?.()}catch(_){}try{if(ffmpegInstance===f)ffmpegInstance=null}catch(_){}try{ffmpegFetchFile=null}catch(_){}}
  async function del(f,n){try{await f.deleteFile(n)}catch(_){}}
  async function acquireWake(){try{wakeLock=await navigator.wakeLock?.request?.('screen')||null}catch(_){wakeLock=null}}
  async function releaseWake(){try{await wakeLock?.release?.()}catch(_){}wakeLock=null}
  function pauseBg(){const v=$('#bgVideo');if(!v)return false;const was=!v.paused;try{v.pause()}catch(_){}return was}
  function restoreBg(was){if(!was)return;try{$('#bgVideo')?.play?.().catch(()=>{})}catch(_){}}
  function releaseWave(){try{if(audioBuffer){audioBuffer=null;waveWasReleased=true}}catch(_){}}
  function restoreWave(){if(!waveWasReleased||!audioInputFile)return;waveWasReleased=false;setTimeout(async()=>{try{const ab=await audioInputFile.arrayBuffer(),ac=new(window.AudioContext||window.webkitAudioContext)();audioBuffer=await ac.decodeAudioData(ab);drawWave();ac.close?.()}catch(_){}},900)}
  function wmvSafeBitrate(p,duration){
    const requested=String(p.videoK||'8M');const mbps=parseFloat(requested)||8;
    const estimatedMB=((mbps*1e6+(parseFloat(p.audioK)||320)*1000)*duration/8)/1e6;
    return estimatedMB>260?'8M':requested;
  }

  async function render134(){
    if(exportBusy)return;
    if(!audioInputFile){setExportState('קודם טען קובץ מוזיקה',0);return}
    if(!Array.isArray(words)||!words.length||!words.some(w=>Number.isFinite(Number(w.time)))){setExportState('קודם בצע סנכרון למילים',0);return}
    const duration=Number(audio.duration)||Number(audioBuffer?.duration)||0;if(!(duration>0)){setExportState('לא הצלחתי לקרוא את אורך השיר',0);return}
    exportBusy=true;window.__hksRenderBusy134=true;const btn=$('#dualExportBtn');if(btn)btn.disabled=true;
    $('#downloadMp4')?.classList.remove('ready');$('#downloadWmv')?.classList.remove('ready');audio.pause();
    const bgWas=pauseBg();releaseWave();await acquireWake();let f=null,files=[];
    try{
      const p=exportPreset();p.fps=Math.min(30,Math.max(24,Number(p.fps)||30));if(p.width>1920){p.width=1920;p.height=1080;p.videoK='12M'}
      // A — MP4. CRF 18 is visually high quality; maxrate still respects the selected preset.
      renderStage='mp4';f=await loadFFmpeg();let inp=await prepare(f,duration,p,'שלב 1/4 — MP4',5,15);files=[inp.audioName,inp.bgName,'overlays.ffconcat',...inp.overlayNames,'output.mp4'].filter(Boolean);
      const vf=`[0:v]scale=${p.width}:${p.height}:force_original_aspect_ratio=increase,crop=${p.width}:${p.height}[base];[2:v]format=rgba[ov];[base][ov]overlay=0:0:shortest=1[v]`;
      setExportState('שלב 2/4 — מרנדר MP4 במצב זיכרון חסכוני…',18);
      const mp4Args=[...inp.bgArgs,'-i',inp.audioName,'-f','concat','-safe','0','-i','overlays.ffconcat','-filter_complex',vf,'-map','[v]','-map','1:a:0','-t',String(duration),'-r',String(p.fps),'-c:v','libx264','-preset','ultrafast','-crf','18','-maxrate',p.videoK,'-bufsize',p.videoK==='12M'?'24M':p.videoK==='20M'?'40M':'16M','-pix_fmt','yuv420p','-c:a','aac','-b:a',p.audioK,'-shortest','output.mp4'];
      const rc=await f.exec(mp4Args,MP4_TIMEOUT);if(rc!==0)throw new Error('רינדור MP4 נכשל או נעצר');
      const mp4Data=await f.readFile('output.mp4');if(!mp4Data||mp4Data.byteLength<1000)throw new Error('קובץ MP4 יצא ריק');
      const mp4Blob=new Blob([mp4Data],{type:'video/mp4'});setDownloadLink('#downloadMp4',mp4Blob,renderName+'.mp4');
      setExportState(`MP4 מוכן (${Math.round(mp4Blob.size/1e6)} MB) — משחרר את המנוע…`,63);
      terminate(f);f=null;files=[];await new Promise(r=>setTimeout(r,120));

      // B — WMV directly from the original source in a new worker. No MP4 is copied back into FFmpeg.
      renderStage='wmv';f=await loadFFmpeg();const wp=window.wmvExportPreset?.()||p;wp.width=p.width;wp.height=p.height;wp.fps=p.fps;
      const safeWmv=wmvSafeBitrate(wp,duration);if(safeWmv!==String(wp.videoK||''))setExportState('שלב 3/4 — iPhone: WMV הותאם ל‑8 Mbps כדי למנוע קריסת זיכרון…',68);
      inp=await prepare(f,duration,wp,'שלב 3/4 — WMV',66,73);files=[inp.audioName,inp.bgName,'overlays.ffconcat',...inp.overlayNames,'output.wmv'].filter(Boolean);
      const vf2=`[0:v]scale=${wp.width}:${wp.height}:force_original_aspect_ratio=increase,crop=${wp.width}:${wp.height}[base];[2:v]format=rgba[ov];[base][ov]overlay=0:0:shortest=1[v]`;
      setExportState('שלב 3/4 — יוצר WMV ישירות מהמקור במנוע נקי…',74);
      const rc2=await f.exec([...inp.bgArgs,'-i',inp.audioName,'-f','concat','-safe','0','-i','overlays.ffconcat','-filter_complex',vf2,'-map','[v]','-map','1:a:0','-t',String(duration),'-r',String(wp.fps),'-c:v','wmv2','-b:v',safeWmv,'-c:a','wmav2','-b:a',wp.audioK||p.audioK,'-shortest','output.wmv'],WMV_TIMEOUT);
      if(rc2!==0)throw new Error('יצירת WMV נכשלה או נעצרה');
      const wmvData=await f.readFile('output.wmv');if(!wmvData||wmvData.byteLength<1000)throw new Error('קובץ WMV יצא ריק');
      const wmvBlob=new Blob([wmvData],{type:'video/x-ms-wmv'});setDownloadLink('#downloadWmv',wmvBlob,renderName+'.wmv');
      setExportState(`שלב 4/4 — הסתיים: MP4 ${Math.round(mp4Blob.size/1e6)} MB • WMV ${Math.round(wmvBlob.size/1e6)} MB`,100);
    }catch(e){console.error('[v134 iPhone render]',e);setExportState('הרינדור נעצר: '+(e?.message||e),0)}
    finally{renderStage='';if(f)for(const n of files)await del(f,n);terminate(f);window.__hksRenderBusy134=false;restoreBg(bgWas);await releaseWake();restoreWave();exportBusy=false;if(btn)btn.disabled=false}
  }

  const btn=$('#dualExportBtn'),overlay=$('#exportSetupOverlay'),nameInput=$('#exportFileName'),start=$('#exportSetupStart');
  if(btn)btn.onclick=()=>{if(exportBusy)return;if(overlay){nameInput.value=cleanName(window.__hksExportBaseName||renderName);overlay.classList.add('show');setTimeout(()=>{nameInput.focus();nameInput.select()},50)}else render134()};
  if(start)start.onclick=()=>{renderName=cleanName(nameInput?.value||window.__hksExportBaseName||'karaoke');window.__hksExportBaseName=renderName;if(nameInput)nameInput.value=renderName;overlay?.classList.remove('show');setStatus('שם הקבצים: '+renderName+' — מתחיל רינדור v1.134');render134()};
  renderDual=render134;window.__hksRenderMobile134={render:render134,get busy(){return!!window.__hksRenderBusy134}};

  // Explain that MP4 is quality-based and the old fixed-bitrate estimate is now a ceiling on iPhone.
  const note=$('#hksEstimateNote127');if(note){const old=note.textContent;note.textContent=(old?old+' • ':'')+'באייפון v1.134 ה‑MP4 משתמש בדחיסה לפי איכות ולכן עשוי לצאת קטן משמעותית מההערכה; WMV גדול מותאם אוטומטית ליציבות.'}
  const ver=$('.version');if(ver)ver.textContent='Web v1.134';
  try{navigator.serviceWorker?.register?.('sw.js?v=134',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
