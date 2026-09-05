// Avi Karaoke Studio Web v1.153 — iPhone Canvas export uses the ACTUAL live-preview proportions
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const preview=$('#preview'),lyrics=$('#lyricsPreview'),audio=$('#audio');
  const brandL=preview?.querySelector('.brandL'),brandR=preview?.querySelector('.brandR');
  const titleText=$('#hksSongTitleText')||$('#hksSongTitleSlide');
  const btn=$('#dualExportBtn'),overlay=$('#exportSetupOverlay'),nameInput=$('#exportFileName'),startBtn=$('#exportSetupStart');
  if(!preview||!lyrics||!audio||!btn)return;
  window.__hksMobilePreviewParity153=true;

  let snap=null,wakeLock=null,waveWasReleased=false,renderName=String(window.__hksExportBaseName||'karaoke');
  const cleanName=s=>String(s||'').trim().replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').replace(/^\.+|\.+$/g,'').slice(0,80)||'karaoke';
  const escConcat=s=>String(s||'').replace(/'/g,"'\\''");
  const timed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  const num=v=>Number.isFinite(parseFloat(v))?parseFloat(v):0;
  const visiblePreview=()=>{const r=preview.getBoundingClientRect();return r.width>20&&r.height>20&&getComputedStyle(preview).display!=='none'};

  function cssColor(v,fallback){
    const m=String(v||'').match(/rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);
    return m?`rgb(${m[1]},${m[2]},${m[3]})`:(v||fallback);
  }
  function metricStyle(el,m){
    if(!el&&!m)return null;
    const cs=el?getComputedStyle(el):null;
    const fs=cs?num(cs.fontSize):0,lh=cs?num(cs.lineHeight):0;
    return {
      fontH:m?.fontH||0,
      lineRatio:m?.lineRatio||(fs>0&&lh>0?lh/fs:1.15),
      left:m?.left??0,right:m?.right??0,top:m?.top??0,
      centerX:m?.centerX??.5,centerY:m?.centerY??.5,width:m?.width??.92,
      fontFamily:cs?.fontFamily||'Arial, sans-serif',
      fontWeight:cs?.fontWeight||'900',
      color:cssColor(cs?.color,'#fff'),
      textShadow:cs?.textShadow||m?.textShadow||'none',
      previewFontPx:fs
    };
  }
  function capture(force=false){
    if(visiblePreview()){
      try{window.__hksPreviewParity152Api?.capture?.()}catch(_){}
    }
    const base=window.__hksPreviewMetrics152||window.__hksPreviewParity152Api?.metrics||null;
    const pr=preview.getBoundingClientRect();
    if(!base&&!visiblePreview()&&!force)return snap;
    const ph=base?.height||(pr.height>20?pr.height:1),pw=base?.width||(pr.width>20?pr.width:1);
    const fallbackMetric=(el)=>{
      if(!el||!(pr.height>20&&pr.width>20))return null;
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el),fs=num(cs.fontSize);
      return {fontH:fs/pr.height,lineRatio:(num(cs.lineHeight)||fs*1.15)/Math.max(1,fs),left:(r.left-pr.left)/pr.width,right:(pr.right-r.right)/pr.width,top:(r.top-pr.top)/pr.height,centerX:((r.left+r.width/2)-pr.left)/pr.width,centerY:((r.top+r.height/2)-pr.top)/pr.height,width:r.width/pr.width,textShadow:cs.textShadow};
    };
    const bm={
      lyrics:base?.lyrics||fallbackMetric(lyrics),brandL:base?.brandL||fallbackMetric(brandL),brandR:base?.brandR||fallbackMetric(brandR),title:base?.title||fallbackMetric(titleText)
    };
    snap={
      previewW:pw,previewH:ph,capturedAt:Date.now(),
      lyrics:metricStyle(lyrics,bm.lyrics),brandL:metricStyle(brandL,bm.brandL),brandR:metricStyle(brandR,bm.brandR),title:metricStyle(titleText,bm.title),
      titleText:String(window.__hksSongTitleState?.text||$('#hksSongTitleInput')?.value||titleText?.textContent||'').trim(),
      brandOutline:{color:String(window.__hksBrandOutline97?.color||'#ffffff'),size:Number(window.__hksBrandOutline97?.size)||0}
    };
    window.__hksExportSnapshot153=snap;return snap;
  }

  // Capture BEFORE navigation hides the Studio page.
  document.querySelectorAll('[data-go="export"]').forEach(b=>{
    if(b.dataset.hksCapture153)return;b.dataset.hksCapture153='1';
    b.addEventListener('pointerdown',()=>capture(true),true);b.addEventListener('click',()=>capture(true),true);
  });
  const previewControl=el=>/(font|title|brand|corner|outline|size|plus|minus)/i.test(String(el?.id||''))||!!el?.closest?.('#hksCornerBrandControls,#hksBrandOutlineControls97');
  ['click','input','change'].forEach(evt=>document.addEventListener(evt,e=>{if(previewControl(e.target)&&visiblePreview())setTimeout(()=>capture(true),50)},true));
  [0,180,700,1500].forEach(ms=>setTimeout(()=>capture(true),ms));

  function linesPerScreen(){
    const n=Number(window.__hksLyricsLayout99?.linesPerScreen||localStorage.getItem('hksLyricsLinesPerScreen99')||4);
    return [4,5,6].includes(n)?n:4;
  }
  function rawLines(){return String($('#lyricsText')?.value||'').replace(/\r/g,'').split('\n')}
  function firstSync(){try{for(const w of words){if(timed(w))return Number(w.time)}}catch(_){}return 0}
  function buildSlides153(duration){
    const n=linesPerScreen(),all=rawLines(),maxLine=Math.max(all.length-1,words.reduce((m,w)=>Math.max(m,Number(w.line)||0),0));
    const pages=[];const title=String(snap?.titleText||window.__hksSongTitleState?.text||$('#hksSongTitleInput')?.value||'').trim();const first=firstSync();
    if(title&&first>0)pages.push({kind:'title',start:0,end:Math.min(duration,first),title,lines:[]});
    for(let start=0;start<=maxLine;start+=n){
      const group=words.filter(w=>(Number(w.line)||0)>=start&&(Number(w.line)||0)<start+n),synced=group.filter(timed);
      if(!group.length||!synced.length)continue;
      const rows=[];for(let l=start;l<start+n;l++)rows.push(all[l]??'');
      let at=Math.min(...synced.map(w=>Number(w.time)));
      if(start===0&&!title)at=0;
      pages.push({kind:'lyrics',start:Math.max(0,at),end:duration,lines:rows});
    }
    pages.sort((a,b)=>a.start-b.start);
    for(let i=0;i<pages.length;i++)pages[i].end=i+1<pages.length?Math.max(pages[i].start+.05,pages[i+1].start):duration;
    return pages.filter(x=>x.end>x.start);
  }

  function fontSpec(m,h,fallbackRatio){
    const ratio=m?.fontH>0?m.fontH:fallbackRatio;
    return Math.max(8,ratio*h);
  }
  function setFont(c,m,px){c.font=`${m?.fontWeight||900} ${px.toFixed(2)}px ${m?.fontFamily||'Arial, sans-serif'}`}
  function drawBrands(c,p,s){
    const outline=s?.brandOutline||{color:'#fff',size:1};
    const draw=(text,m,side)=>{
      if(!m||!text)return;
      const fs=fontSpec(m,p.height,.035);setFont(c,m,fs);c.textBaseline='top';c.direction=side==='left'?'ltr':'rtl';c.textAlign=side==='left'?'left':'right';
      const x=side==='left'?(m.left||.025)*p.width:p.width-(m.right||.025)*p.width,y=(m.top||.025)*p.height;
      const stroke=Math.max(0,(Number(outline.size)||0)/Math.max(1,s.previewH)*p.height);
      if(stroke>0){c.lineJoin='round';c.lineWidth=Math.max(1,stroke*2);c.strokeStyle=outline.color||'#fff';c.strokeText(text,x,y)}
      c.fillStyle=m.color||'#2584e6';c.fillText(text,x,y);
      return{fontPx:fs,x,y,strokePx:stroke};
    };
    return{left:draw('Avi Dayan The Show',s.brandL,'left'),right:draw('אבי דיין ההופעה',s.brandR,'right')};
  }
  function drawCenteredRows(c,p,rows,m){
    const fs=fontSpec(m,p.height,.09),lh=fs*(m?.lineRatio||1.15),cx=(m?.centerX??.5)*p.width,cy=(m?.centerY??.5)*p.height,maxW=Math.max(20,(m?.width||.92)*p.width);
    setFont(c,m,fs);c.textAlign='center';c.textBaseline='middle';c.direction='rtl';c.fillStyle=m?.color||'#fff';c.strokeStyle='#000';c.lineJoin='round';c.lineWidth=Math.max(3,fs*.09);
    const n=Math.max(1,rows.length),ys=[];
    rows.forEach((text,i)=>{const y=cy+(i-(n-1)/2)*lh;ys.push(y);if(!String(text||'').trim())return;c.strokeText(String(text),cx,y,maxW);c.fillText(String(text),cx,y,maxW)});
    return{fontPx:fs,lineHeightPx:lh,centerX:cx,centerY:cy,maxW,ys};
  }
  function drawTitle(c,p,text,m){
    const fs=fontSpec(m,p.height,.09),cx=(m?.centerX??.5)*p.width,cy=(m?.centerY??.5)*p.height,maxW=Math.max(20,(m?.width||.9)*p.width);
    setFont(c,m,fs);c.textAlign='center';c.textBaseline='middle';c.direction='rtl';c.fillStyle=m?.color||'#fff';c.strokeStyle='#000';c.lineJoin='round';c.lineWidth=Math.max(3,fs*.08);c.strokeText(text,cx,cy,maxW);c.fillText(text,cx,cy,maxW);
    return{fontPx:fs,centerX:cx,centerY:cy,maxW};
  }
  async function makeOverlayBlob153(slide,p){
    const s=snap||capture(true)||{};const cv=document.createElement('canvas');cv.width=p.width;cv.height=p.height;const c=cv.getContext('2d');c.clearRect(0,0,p.width,p.height);
    const brands=drawBrands(c,p,s);let content=null;
    if(slide.kind==='title')content=drawTitle(c,p,slide.title,s.title);
    else content=drawCenteredRows(c,p,slide.lines,s.lyrics);
    window.__hksLastMobileOverlay153={kind:slide.kind,width:p.width,height:p.height,lines:slide.lines?.length||0,brands,content,snapshot:s};
    return new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(new Error('לא הצלחתי ליצור שכבת כתוביות')),'image/png'));
  }

  async function acquireWake(){try{wakeLock=await navigator.wakeLock?.request?.('screen')||null}catch(_){wakeLock=null}}
  async function releaseWake(){try{await wakeLock?.release?.()}catch(_){}wakeLock=null}
  function pausePreviewVideo(){const v=$('#bgVideo');if(!v)return null;const was=!v.paused;try{v.pause()}catch(_){}return was}
  function restorePreviewVideo(was){if(!was)return;try{$('#bgVideo')?.play?.().catch(()=>{})}catch(_){}}
  function releaseWave(){try{if(audioBuffer){audioBuffer=null;waveWasReleased=true}}catch(_){} }
  function restoreWave(){if(!waveWasReleased||!audioInputFile)return;waveWasReleased=false;setTimeout(async()=>{try{const ab=await audioInputFile.arrayBuffer(),ac=new(window.AudioContext||window.webkitAudioContext)();audioBuffer=await ac.decodeAudioData(ab);drawWave();ac.close?.()}catch(e){console.warn('[v153 wave restore]',e)}},800)}
  async function safeDelete(f,name){try{await f.deleteFile(name)}catch(_){} }
  function terminate(f){try{f?.terminate?.()}catch(_){}try{if(ffmpegInstance===f)ffmpegInstance=null}catch(_){}try{ffmpegFetchFile=null}catch(_){} }

  async function prepareInputs153(f,duration,p){
    setExportState('שלב 1/4 — מכין Export זהה לתצוגה החיה…',8);
    const audioName='audio_input'+extOf(audioInputFile?.name,'.m4a');await f.writeFile(audioName,await ffmpegFetchFile(audioInputFile));
    let bgName=null,bgArgs=[];
    if(videoInputFile){bgName='background'+extOf(videoInputFile.name,'.mp4');await f.writeFile(bgName,await ffmpegFetchFile(videoInputFile));bgArgs=['-stream_loop','-1','-i',bgName]}
    else if(imageInputFile){bgName='background'+extOf(imageInputFile.name,'.jpg');await f.writeFile(bgName,await ffmpegFetchFile(imageInputFile));bgArgs=['-loop','1','-framerate',String(p.fps),'-i',bgName]}
    else bgArgs=['-f','lavfi','-i',`color=c=black:s=${p.width}x${p.height}:r=${p.fps}`];
    const slides=buildSlides153(duration),overlayNames=[];if(!slides.length)throw new Error('לא נמצאו שקופיות מסונכרנות לרינדור');
    for(let i=0;i<slides.length;i++){
      const name=`overlay_${String(i).padStart(3,'0')}.png`;overlayNames.push(name);const blob=await makeOverlayBlob153(slides[i],p);await f.writeFile(name,await ffmpegFetchFile(blob));
      setExportState(`שלב 1/4 — מכין כתוביות ${i+1}/${slides.length} לפי התצוגה החיה…`,8+((i+1)/slides.length)*8);await new Promise(r=>setTimeout(r,0));
    }
    const manifest=['ffconcat version 1.0'];
    slides.forEach((sl,i)=>{manifest.push(`file '${escConcat(overlayNames[i])}'`);manifest.push(`duration ${Math.max(.01,sl.end-sl.start).toFixed(6)}`)});manifest.push(`file '${escConcat(overlayNames[overlayNames.length-1])}'`);
    await f.writeFile('overlays.ffconcat',new TextEncoder().encode(manifest.join('\n')+'\n'));
    return{audioName,bgName,bgArgs,overlayNames,slides};
  }

  async function renderMobile153(){
    if(exportBusy)return;if(!audioInputFile){setExportState('קודם טען קובץ מוזיקה',0);return}if(!Array.isArray(words)||!words.some(timed)){setExportState('קודם בצע סנכרון למילים',0);return}
    const duration=Number(audio.duration)||Number(audioBuffer?.duration)||0;if(!(duration>0)){setExportState('לא הצלחתי לקרוא את אורך השיר',0);return}
    capture(true);exportBusy=true;btn.disabled=true;$('#downloadMp4')?.classList.remove('ready');$('#downloadWmv')?.classList.remove('ready');audio.pause();window.__hksRenderBusy131=true;document.body.classList.add('hksRendering131');
    const previewWas=pausePreviewVideo();releaseWave();await acquireWake();let f=null,files=[];
    try{
      f=await loadFFmpeg();const p=exportPreset();p.fps=Math.min(30,Math.max(24,Number(p.fps)||30));if(p.width>1920){p.width=1920;p.height=1080;p.videoK='12M'}
      const inp=await prepareInputs153(f,duration,p);files=[inp.audioName,inp.bgName,'overlays.ffconcat',...inp.overlayNames,'output.mp4'].filter(Boolean);
      const vf=`[0:v]scale=${p.width}:${p.height}:force_original_aspect_ratio=increase,crop=${p.width}:${p.height}[base];[2:v]format=rgba[ov];[base][ov]overlay=0:0:shortest=1[v]`;
      renderStage='mp4';setExportState('שלב 2/4 — מרנדר MP4 בדיוק לפי התצוגה החיה…',18);
      const rc=await f.exec([...inp.bgArgs,'-i',inp.audioName,'-f','concat','-safe','0','-i','overlays.ffconcat','-filter_complex',vf,'-map','[v]','-map','1:a:0','-t',String(duration),'-r',String(p.fps),'-c:v','libx264','-preset','ultrafast','-pix_fmt','yuv420p','-b:v',p.videoK,'-c:a','aac','-b:a',p.audioK,'-shortest','output.mp4'],20*60*1000);
      if(rc!==0)throw new Error('רינדור MP4 נכשל או נעצר');const mp4Transfer=await f.readFile('output.mp4');if(!mp4Transfer||mp4Transfer.byteLength<1000)throw new Error('קובץ MP4 יצא ריק');
      setExportState('שלב 3/4 — MP4 מוכן; מכין WMV…',76);terminate(f);f=null;files=[];await new Promise(r=>setTimeout(r,80));
      renderStage='wmv';f=await loadFFmpeg();files=['output.mp4','output.wmv'];await f.writeFile('output.mp4',mp4Transfer);const wp=window.wmvExportPreset?.()||p;
      setExportState('שלב 3/4 — יוצר WMV…',80);const rc2=await f.exec(['-i','output.mp4','-c:v','wmv2','-b:v',wp.videoK||p.videoK,'-c:a','pcm_s16le','-ar','48000','-ac','2','output.wmv'],15*60*1000);if(rc2!==0)throw new Error('יצירת WMV נכשלה או נעצרה');
      renderStage='';setExportState('שלב 4/4 — מכין קבצים לשמירה…',96);const mp4Data=await f.readFile('output.mp4');const mp4Blob=new Blob([mp4Data.buffer],{type:'video/mp4'});if(mp4Blob.size<1000)throw new Error('קובץ MP4 יצא ריק');setDownloadLink('#downloadMp4',mp4Blob,renderName+'.mp4');await safeDelete(f,'output.mp4');
      const wmvData=await f.readFile('output.wmv');const wmvBlob=new Blob([wmvData.buffer],{type:'video/x-ms-wmv'});if(wmvBlob.size<1000)throw new Error('קובץ WMV יצא ריק');setDownloadLink('#downloadWmv',wmvBlob,renderName+'.wmv');await safeDelete(f,'output.wmv');
      setExportState(`הרינדור הסתיים — ${linesPerScreen()} שורות לפי התצוגה החיה • MP4 ו-WMV מוכנים`,100);
    }catch(e){console.error('[v153 iPhone parity render]',e);setExportState('הרינדור נעצר: '+(e?.message||e),0)}finally{renderStage='';if(f)for(const x of files)await safeDelete(f,x);terminate(f);window.__hksRenderBusy131=false;document.body.classList.remove('hksRendering131');restorePreviewVideo(previewWas);await releaseWake();restoreWave();exportBusy=false;btn.disabled=false}
  }

  // Replace only the iPhone render actions; keep the existing filename overlay UI.
  btn.onclick=()=>{if(exportBusy)return;capture(true);if(overlay){if(nameInput)nameInput.value=cleanName(window.__hksExportBaseName||renderName);overlay.classList.add('show');setTimeout(()=>{nameInput?.focus?.();nameInput?.select?.()},50)}else renderMobile153()};
  if(startBtn)startBtn.onclick=()=>{renderName=cleanName(nameInput?.value||window.__hksExportBaseName||'karaoke');window.__hksExportBaseName=renderName;if(nameInput)nameInput.value=renderName;overlay?.classList.remove('show');setStatus('שם הקבצים: '+renderName+' — מתחיל Export זהה לתצוגה החיה');renderMobile153()};
  try{renderDual=renderMobile153}catch(_){};
  if(window.__hksRenderMobile131)window.__hksRenderMobile131.render=renderMobile153;
  window.__hksRenderMobile153={render:renderMobile153,capture,buildSlides:buildSlides153,makeOverlayBlob:makeOverlayBlob153,get snapshot(){return snap},get linesPerScreen(){return linesPerScreen()}};

  // Fix the old hard-coded v1.147 refresh handler as well: no self-update loop when already current.
  async function latest(){try{const r=await fetch('./version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return null;const j=await r.json(),v=Number(j?.version||0);return Number.isFinite(v)&&v>0?v:null}catch(_){return null}}
  function bindSmartUpdate(){
    const old=$('#hksRefresh105');if(!old||old.dataset.hksUpdate153)return;
    const b=old.cloneNode(true);b.dataset.hksUpdate153='1';b.disabled=false;b.textContent='↻ רענן עדכון';old.replaceWith(b);
    b.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();const running=Number(window.__hksLoaderVersion||153);b.disabled=true;const text=b.textContent;try{b.textContent='בודק עדכון…';const v=await latest();if(!v){setStatus('לא הצלחתי לבדוק עדכון כרגע.');return}if(v<=running){setStatus(`אתה כבר בגרסה האחרונה — v1.${running}.`);return}b.textContent=`מעדכן ל-v1.${v}…`;try{const reg=await navigator.serviceWorker.register('sw.js?v='+v,{updateViaCache:'none'});await reg.update?.()}catch(_){}const u=new URL(location.href);u.searchParams.set('hksUpdate',String(v));u.searchParams.set('_',Date.now().toString());location.replace(u.href)}finally{b.disabled=false;b.textContent=text}} ,true);
  }
  bindSmartUpdate();setTimeout(bindSmartUpdate,300);

  const ver=$('.version');if(ver)ver.textContent='Web v1.153';
  try{setStatus('v1.153 מוכן — Export באייפון מצייר לפי הגודל והפרופורציות של התצוגה החיה.')}catch(_){}
})();
