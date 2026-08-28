// Hebrew Karaoke Studio Web v1.8 render hotfix
// Safari/iPhone: use the official single-thread UMD ffmpeg core loader.
// Render lyrics/branding as transparent PNG overlays instead of libass/subtitles.
(function(){
  const $ = s => document.querySelector(s);

  function timeout(promise, ms, msg){
    return Promise.race([promise,new Promise((_,rej)=>setTimeout(()=>rej(new Error(msg)),ms))]);
  }

  // Override v1.7 loader. Official single-thread core is much more reliable on iOS Safari.
  loadFFmpeg = async function(){
    if(ffmpegInstance) return ffmpegInstance;
    setExportState('שלב 1/4 — מוריד את מנוע הרינדור…',2);
    const modules = await timeout(Promise.all([
      import('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm/index.js'),
      import('https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.2/dist/esm/index.js')
    ]),30000,'לא הצלחתי להוריד את ספריית הרינדור');
    const {FFmpeg}=modules[0], {fetchFile,toBlobURL}=modules[1];
    const ffmpeg=new FFmpeg();
    ffmpeg.on('log',({message})=>console.log('[ffmpeg]',message));
    ffmpeg.on('progress',({progress})=>{
      const p=Math.max(0,Math.min(1,Number(progress)||0));
      if(renderStage==='mp4') setExportState('שלב 3/4 — מרנדר MP4…',20+p*55);
      else if(renderStage==='wmv') setExportState('שלב 4/4 — יוצר WMV…',78+p*20);
    });
    const base='https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';
    setExportState('שלב 1/4 — טוען WebAssembly…',4);
    const [coreURL,wasmURL]=await timeout(Promise.all([
      toBlobURL(base+'/ffmpeg-core.js','text/javascript'),
      toBlobURL(base+'/ffmpeg-core.wasm','application/wasm')
    ]),60000,'קבצי מנוע הרינדור לא ירדו');
    setExportState('שלב 1/4 — מפעיל את מנוע הרינדור…',6);
    await timeout(ffmpeg.load({coreURL,wasmURL}),90000,'מנוע הרינדור לא נפתח במכשיר');
    ffmpegFetchFile=fetchFile; ffmpegInstance=ffmpeg;
    setExportState('שלב 1/4 — מנוע הרינדור מוכן',8);
    return ffmpeg;
  };

  function slideGroups(duration){
    const maxLine=words.reduce((m,w)=>Math.max(m,w.line??0),0),out=[];
    for(let start=0;start<=maxLine;start+=4){
      const group=words.filter(w=>(w.line??0)>=start&&(w.line??0)<start+4);
      const synced=group.filter(w=>Number.isFinite(w.time));
      if(!group.length||!synced.length) continue;
      const lines=[];
      for(let l=start;l<start+4;l++){
        const t=words.filter(w=>(w.line??0)===l).map(w=>w.t).join(' ');
        if(t) lines.push(t);
      }
      out.push({start:start===0?0:Math.min(...synced.map(w=>w.time)),lines});
    }
    out.sort((a,b)=>a.start-b.start);
    for(let i=0;i<out.length;i++) out[i].end=i+1<out.length?Math.max(out[i].start+.05,out[i+1].start):duration;
    return out.filter(x=>x.end>x.start);
  }

  function fitCanvasFont(c,text,maxW,start,min){
    let size=start;
    while(size>min){c.font=`800 ${size}px Arial, sans-serif`;if(c.measureText(text).width<=maxW)break;size-=2;}
    return size;
  }

  async function makeOverlayBlob(lines,p){
    const cv=document.createElement('canvas'); cv.width=p.width; cv.height=p.height;
    const c=cv.getContext('2d'); c.clearRect(0,0,p.width,p.height); c.lineJoin='round';
    const bs=Math.round(p.height*.029), top=Math.round(p.height*.026), pad=Math.round(p.width*.026);
    c.font=`900 ${bs}px Arial, sans-serif`; c.lineWidth=Math.max(2,Math.round(bs*.12)); c.strokeStyle='#fff'; c.fillStyle='#2584e6'; c.textBaseline='top';
    c.textAlign='left'; c.direction='ltr'; c.strokeText('Avi Dayan The Show',pad,top); c.fillText('Avi Dayan The Show',pad,top);
    c.textAlign='right'; c.direction='rtl'; c.strokeText('אבי דיין ההופעה',p.width-pad,top); c.fillText('אבי דיין ההופעה',p.width-pad,top);
    const gap=Math.round(p.height*.105), base=Math.round(p.height*.075), maxW=p.width*.90;
    const firstY=p.height/2-((Math.max(lines.length,1)-1)*gap)/2;
    c.textAlign='center';c.textBaseline='middle';c.direction='rtl';
    lines.forEach((line,i)=>{const fs=fitCanvasFont(c,line,maxW,base,30);c.font=`800 ${fs}px Arial, sans-serif`;c.lineWidth=Math.max(5,Math.round(fs*.11));c.strokeStyle='#000';c.fillStyle='#fff';c.strokeText(line,p.width/2,firstY+i*gap,maxW);c.fillText(line,p.width/2,firstY+i*gap,maxW);});
    return await new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(new Error('לא הצלחתי ליצור שכבת כתוביות')),'image/png'));
  }

  async function prepareV18(ffmpeg,duration,p){
    setExportState('שלב 2/4 — מכין קבצים ושכבות…',10);
    const audioName='audio_input'+extOf(audioInputFile?.name,'.m4a');
    await ffmpeg.writeFile(audioName,await ffmpegFetchFile(audioInputFile));
    let bgName=null,bgArgs=[];
    if(videoInputFile){bgName='background'+extOf(videoInputFile.name,'.mp4');await ffmpeg.writeFile(bgName,await ffmpegFetchFile(videoInputFile));bgArgs=['-stream_loop','-1','-i',bgName];}
    else if(imageInputFile){bgName='background'+extOf(imageInputFile.name,'.jpg');await ffmpeg.writeFile(bgName,await ffmpegFetchFile(imageInputFile));bgArgs=['-loop','1','-framerate',String(p.fps),'-i',bgName];}
    else bgArgs=['-f','lavfi','-i',`color=c=black:s=${p.width}x${p.height}:r=${p.fps}`];
    const slides=slideGroups(duration), overlayNames=[];
    for(let i=0;i<slides.length;i++){
      const name=`overlay_${i}.png`; overlayNames.push(name);
      await ffmpeg.writeFile(name,await ffmpegFetchFile(await makeOverlayBlob(slides[i].lines,p)));
      setExportState(`שלב 2/4 — מכין כתוביות ${i+1}/${slides.length}…`,10+((i+1)/Math.max(1,slides.length))*9);
    }
    return{audioName,bgName,bgArgs,slides,overlayNames};
  }

  function buildOverlayFilter(inp,p){
    let fc=`[0:v]scale=${p.width}:${p.height}:force_original_aspect_ratio=increase,crop=${p.width}:${p.height}[v0]`;
    let prev='v0';
    inp.slides.forEach((s,i)=>{const idx=2+i, out=`v${i+1}`;fc+=`;[${idx}:v]format=rgba[ov${i}];[${prev}][ov${i}]overlay=0:0:enable='between(t,${s.start.toFixed(3)},${s.end.toFixed(3)})'[${out}]`;prev=out;});
    return{fc,last:prev};
  }

  renderDual = async function(){
    if(exportBusy)return;
    if(!audioInputFile){setExportState('קודם טען קובץ מוזיקה',0);return;}
    if(!words.length||!words.some(w=>Number.isFinite(w.time))){setExportState('קודם בצע סנכרון למילים',0);return;}
    const duration=Number(audio.duration)||Number(audioBuffer?.duration)||0;
    if(!duration){setExportState('לא הצלחתי לקרוא את אורך השיר',0);return;}
    exportBusy=true;const btn=$('#dualExportBtn');btn.disabled=true;$('#downloadMp4').classList.remove('ready');$('#downloadWmv').classList.remove('ready');audio.pause();
    let ffmpeg=null, files=[];
    try{
      ffmpeg=await loadFFmpeg(); const p=exportPreset();
      if(/iPhone|iPad|iPod/i.test(navigator.userAgent)&&p.width>1920){p.width=1920;p.height=1080;p.videoK='12M';setExportState('באייפון 4K הותאם ל‑1080p Master כדי למנוע תקיעה',9);}
      const inp=await prepareV18(ffmpeg,duration,p);files=[inp.audioName,inp.bgName,...inp.overlayNames,'output.mp4','output.wmv'].filter(Boolean);
      const overlayInputs=[];inp.overlayNames.forEach(n=>overlayInputs.push('-loop','1','-framerate',String(p.fps),'-i',n));
      const {fc,last}=buildOverlayFilter(inp,p);
      renderStage='mp4';setExportState('שלב 3/4 — מרנדר MP4…',20);
      const rc=await ffmpeg.exec([...inp.bgArgs,'-i',inp.audioName,...overlayInputs,'-filter_complex',fc,'-map',`[${last}]`,'-map','1:a:0','-t',String(duration),'-r',String(p.fps),'-c:v','libx264','-preset','ultrafast','-pix_fmt','yuv420p','-b:v',p.videoK,'-c:a','aac','-b:a',p.audioK,'-movflags','+faststart','-shortest','output.mp4'],300000);
      if(rc!==0) throw new Error('רינדור MP4 נכשל');
      const mp4Data=await ffmpeg.readFile('output.mp4'),mp4Blob=new Blob([mp4Data.buffer],{type:'video/mp4'});if(mp4Blob.size<1000)throw new Error('קובץ MP4 יצא ריק');setDownloadLink('#downloadMp4',mp4Blob,'karaoke.mp4');
      renderStage='wmv';setExportState('שלב 4/4 — יוצר WMV…',78);
      const rc2=await ffmpeg.exec(['-i','output.mp4','-c:v','wmv2','-b:v',p.videoK,'-c:a','wmav2','-b:a',p.audioK,'output.wmv'],300000);
      if(rc2!==0) throw new Error('יצירת WMV נכשלה');
      const wmvData=await ffmpeg.readFile('output.wmv'),wmvBlob=new Blob([wmvData.buffer],{type:'video/x-ms-wmv'});if(wmvBlob.size<1000)throw new Error('קובץ WMV יצא ריק');setDownloadLink('#downloadWmv',wmvBlob,'karaoke.wmv');setExportState('הרינדור הסתיים — MP4 ו‑WMV מוכנים לשמירה',100);
    }catch(err){console.error(err);setExportState('הרינדור נעצר: '+(err?.message||err),0);}
    finally{renderStage='';if(ffmpeg)for(const f of files)try{await ffmpeg.deleteFile(f)}catch(e){}exportBusy=false;btn.disabled=false;}
  };

  const b=$('#dualExportBtn');if(b)b.onclick=renderDual;
})();

// v1.9: removable uploaded files
(function(){
  const $ = s => document.querySelector(s);
  const version = document.querySelector('.version');
  if(version) version.textContent='Web v1.9';

  const style=document.createElement('style');
  style.textContent=`.fileRemoveRow{display:flex;gap:8px;align-items:center;margin:-4px 0 10px}.fileRemoveBtn{min-height:38px;padding:7px 12px;border-radius:10px;border:1px solid #9d4650;background:linear-gradient(#c83a45,#711b22);color:#fff;font-weight:800;font-size:14px;display:none}.fileRemoveBtn.show{display:inline-block}.fileName{font-size:12px;color:#b9c7d5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}`;
  document.head.appendChild(style);

  function addRemove(inputId, label, onRemove){
    const input=$(inputId); if(!input)return;
    const row=document.createElement('div');row.className='fileRemoveRow';
    const name=document.createElement('div');name.className='fileName';name.textContent='לא נבחר קובץ';
    const btn=document.createElement('button');btn.type='button';btn.className='fileRemoveBtn';btn.textContent='✕ הסר קובץ';
    row.appendChild(name);row.appendChild(btn);input.insertAdjacentElement('afterend',row);
    input.addEventListener('change',()=>{const f=input.files&&input.files[0];name.textContent=f?`${label}: ${f.name}`:'לא נבחר קובץ';btn.classList.toggle('show',!!f);});
    btn.onclick=()=>{onRemove();input.value='';name.textContent='לא נבחר קובץ';btn.classList.remove('show');setStatus(`${label} הוסר — אפשר לבחור קובץ חדש`);};
  }

  addRemove('#audioFile','קובץ המוזיקה',()=>{
    audio.pause();
    try{if(audio.src&&audio.src.startsWith('blob:'))URL.revokeObjectURL(audio.src)}catch(e){}
    audio.removeAttribute('src');audio.load();audioInputFile=null;audioBuffer=null;
    const w=$('#wave');if(w){const c=w.getContext('2d');c.clearRect(0,0,w.width,w.height);}
    const clock=$('#clock');if(clock)clock.textContent='00:00.000 / 00:00.000';
  });

  addRemove('#imageFile','תמונת הרקע',()=>{
    imageInputFile=null;const im=$('#bgImg');if(im){try{if(im.src&&im.src.startsWith('blob:'))URL.revokeObjectURL(im.src)}catch(e){}im.removeAttribute('src');im.hidden=true;}
  });

  addRemove('#videoFile','וידאו הרקע',()=>{
    videoInputFile=null;const v=$('#bgVideo');if(v){v.pause();try{if(v.src&&v.src.startsWith('blob:'))URL.revokeObjectURL(v.src)}catch(e){}v.removeAttribute('src');v.load();v.hidden=true;}
  });
})();
