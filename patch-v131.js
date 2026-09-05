// Avi Karaoke Studio Web v1.131 — iPhone memory-safe faster renderer
// Keeps the existing MP4 + WMV workflow, but removes the 5-minute render ceiling,
// uses one sequential overlay input instead of many simultaneous PNG inputs,
// pauses preview video work during render, and releases the WASM heap afterwards.
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const $=s=>document.querySelector(s);
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;

  const MP4_TIMEOUT=20*60*1000;
  const WMV_TIMEOUT=15*60*1000;
  let renderName='karaoke',wakeLock=null,waveWasReleased=false;

  function cleanName(s){return String(s||'').trim().replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').replace(/^\.+|\.+$/g,'').slice(0,80)||'karaoke'}
  function escConcat(s){return String(s||'').replace(/'/g,"'\\''")}
  function fitCanvasFont(c,text,maxW,start,min){let size=start;while(size>min){c.font=`800 ${size}px Arial, sans-serif`;if(c.measureText(text).width<=maxW)break;size-=2}return size}
  function slideGroups(duration){
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
  async function makeOverlayBlob(lines,p){
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
  async function acquireWake(){try{wakeLock=await navigator.wakeLock?.request?.('screen')||null}catch(e){wakeLock=null}}
  async function releaseWake(){try{await wakeLock?.release?.()}catch(e){}wakeLock=null}
  function pausePreviewVideo(){const v=$('#bgVideo');if(!v)return null;const wasPlaying=!v.paused;try{v.pause()}catch(e){}return wasPlaying}
  function restorePreviewVideo(wasPlaying){if(!wasPlaying)return;const v=$('#bgVideo');try{v?.play?.().catch(()=>{})}catch(e){}}
  function releaseWaveBuffer(){try{if(audioBuffer){audioBuffer=null;waveWasReleased=true}}catch(e){}}
  async function restoreWaveBufferLater(){
    if(!waveWasReleased||!audioInputFile)return;waveWasReleased=false;
    setTimeout(async()=>{try{const ab=await audioInputFile.arrayBuffer(),ac=new(window.AudioContext||window.webkitAudioContext)();audioBuffer=await ac.decodeAudioData(ab);drawWave();ac.close?.()}catch(e){console.warn('[v131 waveform restore]',e)}},800);
  }
  async function safeDelete131(f,name){try{await f.deleteFile(name)}catch(e){}}
  async function prepareInputs131(f,duration,p){
    setExportState('שלב 1/4 — מכין קבצים לרינדור חסכוני…',8);
    const audioName='audio_input'+extOf(audioInputFile?.name,'.m4a');await f.writeFile(audioName,await ffmpegFetchFile(audioInputFile));
    let bgName=null,bgArgs=[];
    if(videoInputFile){bgName='background'+extOf(videoInputFile.name,'.mp4');await f.writeFile(bgName,await ffmpegFetchFile(videoInputFile));bgArgs=['-stream_loop','-1','-i',bgName]}
    else if(imageInputFile){bgName='background'+extOf(imageInputFile.name,'.jpg');await f.writeFile(bgName,await ffmpegFetchFile(imageInputFile));bgArgs=['-loop','1','-framerate',String(p.fps),'-i',bgName]}
    else bgArgs=['-f','lavfi','-i',`color=c=black:s=${p.width}x${p.height}:r=${p.fps}`];
    const slides=slideGroups(duration),overlayNames=[];
    if(!slides.length)throw new Error('לא נמצאו שקופיות מסונכרנות לרינדור');
    for(let i=0;i<slides.length;i++){
      const name=`overlay_${String(i).padStart(3,'0')}.png`;overlayNames.push(name);
      const blob=await makeOverlayBlob(slides[i].lines,p);await f.writeFile(name,await ffmpegFetchFile(blob));
      setExportState(`שלב 1/4 — מכין כתוביות ${i+1}/${slides.length}…`,8+((i+1)/slides.length)*8);
      await new Promise(r=>setTimeout(r,0));
    }
    const manifest=['ffconcat version 1.0'];
    for(let i=0;i<slides.length;i++){
      manifest.push(`file '${escConcat(overlayNames[i])}'`);
      manifest.push(`duration ${Math.max(.01,slides[i].end-slides[i].start).toFixed(6)}`);
    }
    manifest.push(`file '${escConcat(overlayNames[overlayNames.length-1])}'`);
    await f.writeFile('overlays.ffconcat',new TextEncoder().encode(manifest.join('\n')+'\n'));
    return{audioName,bgName,bgArgs,overlayNames};
  }
  function terminateEngine(f){
    try{f?.terminate?.()}catch(e){}
    try{if(ffmpegInstance===f)ffmpegInstance=null}catch(e){}
    try{ffmpegFetchFile=null}catch(e){}
  }
  async function renderMobile131(){
    if(exportBusy)return;
    if(!audioInputFile){setExportState('קודם טען קובץ מוזיקה',0);return}
    if(!Array.isArray(words)||!words.length||!words.some(w=>Number.isFinite(Number(w.time)))){setExportState('קודם בצע סנכרון למילים',0);return}
    const duration=Number(audio.duration)||Number(audioBuffer?.duration)||0;if(!(duration>0)){setExportState('לא הצלחתי לקרוא את אורך השיר',0);return}
    exportBusy=true;const btn=$('#dualExportBtn');if(btn)btn.disabled=true;$('#downloadMp4')?.classList.remove('ready');$('#downloadWmv')?.classList.remove('ready');
    audio.pause();window.__hksRenderBusy131=true;document.body.classList.add('hksRendering131');const previewWasPlaying=pausePreviewVideo();releaseWaveBuffer();await acquireWake();
    let f=null,files=[];
    try{
      f=await loadFFmpeg();const p=exportPreset();p.fps=Math.min(30,Math.max(24,Number(p.fps)||30));
      if(p.width>1920){p.width=1920;p.height=1080;p.videoK='12M';setExportState('באייפון 4K הותאם ל‑1080p Master כדי לשמור על יציבות ומהירות',7)}
      const inp=await prepareInputs131(f,duration,p);files=[inp.audioName,inp.bgName,'overlays.ffconcat',...inp.overlayNames,'output.mp4','output.wmv'].filter(Boolean);
      const vf=`[0:v]scale=${p.width}:${p.height}:force_original_aspect_ratio=increase,crop=${p.width}:${p.height}[base];[2:v]format=rgba[ov];[base][ov]overlay=0:0:shortest=1[v]`;
      renderStage='mp4';setExportState('שלב 2/4 — מרנדר MP4 באייפון…',18);
      const rc=await f.exec([...inp.bgArgs,'-i',inp.audioName,'-f','concat','-safe','0','-i','overlays.ffconcat','-filter_complex',vf,'-map','[v]','-map','1:a:0','-t',String(duration),'-r',String(p.fps),'-c:v','libx264','-preset','ultrafast','-pix_fmt','yuv420p','-b:v',p.videoK,'-c:a','aac','-b:a',p.audioK,'-movflags','+faststart','-shortest','output.mp4'],MP4_TIMEOUT);
      if(rc!==0)throw new Error('רינדור MP4 נכשל או נעצר');
      renderStage='wmv';setExportState('שלב 3/4 — MP4 מוכן; יוצר WMV…',76);
      const wp=window.wmvExportPreset?.()||p,wv=wp.videoK||p.videoK;
      const rc2=await f.exec(['-i','output.mp4','-c:v','wmv2','-b:v',wv,'-c:a','wmav2','-b:a',wp.audioK||p.audioK,'output.wmv'],WMV_TIMEOUT);
      if(rc2!==0)throw new Error('יצירת WMV נכשלה או נעצרה');
      renderStage='';setExportState('שלב 4/4 — מכין את הקבצים לשמירה…',96);
      const mp4Data=await f.readFile('output.mp4');const mp4Blob=new Blob([mp4Data.buffer],{type:'video/mp4'});if(mp4Blob.size<1000)throw new Error('קובץ MP4 יצא ריק');await safeDelete131(f,'output.mp4');setDownloadLink('#downloadMp4',mp4Blob,renderName+'.mp4');
      const wmvData=await f.readFile('output.wmv');const wmvBlob=new Blob([wmvData.buffer],{type:'video/x-ms-wmv'});if(wmvBlob.size<1000)throw new Error('קובץ WMV יצא ריק');await safeDelete131(f,'output.wmv');setDownloadLink('#downloadWmv',wmvBlob,renderName+'.wmv');
      setExportState('הרינדור הסתיים — MP4 ו‑WMV מוכנים לשמירה',100);
    }catch(e){console.error('[v131 iPhone render]',e);setExportState('הרינדור נעצר: '+(e?.message||e),0)}
    finally{
      renderStage='';if(f)for(const name of files)await safeDelete131(f,name);terminateEngine(f);window.__hksRenderBusy131=false;document.body.classList.remove('hksRendering131');restorePreviewVideo(previewWasPlaying);await releaseWake();restoreWaveBufferLater();exportBusy=false;if(btn)btn.disabled=false;
    }
  }

  // v1.28 owns the filename dialog. Reuse its UI, but route START to the new renderer.
  const btn=$('#dualExportBtn'),overlay=$('#exportSetupOverlay'),nameInput=$('#exportFileName'),start=$('#exportSetupStart');
  if(btn){btn.onclick=()=>{if(exportBusy)return;if(overlay){nameInput.value=cleanName(window.__hksExportBaseName||renderName);overlay.classList.add('show');setTimeout(()=>{nameInput.focus();nameInput.select()},50)}else renderMobile131()}}
  if(start){start.onclick=()=>{renderName=cleanName(nameInput?.value||window.__hksExportBaseName||'karaoke');window.__hksExportBaseName=renderName;if(nameInput)nameInput.value=renderName;overlay?.classList.remove('show');setStatus('שם הקבצים: '+renderName+' — מתחיל רינדור מהיר לאייפון');renderMobile131()}}
  renderDual=renderMobile131;
  window.__hksRenderMobile131={render:renderMobile131,get busy(){return!!window.__hksRenderBusy131}};
  const ver=$('.version');if(ver)ver.textContent='Web v1.131';
  // Force an iOS PWA service-worker update so the new renderer is not shadowed by an old cache.
  try{navigator.serviceWorker?.register?.('sw.js?v=131',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(e){}
})();
