// Avi Karaoke Studio Web v1.129 — Windows desktop native FFmpeg/NVIDIA rendering bridge
(function(){
  const api=window.aviDesktop;
  if(!api?.isDesktop)return;
  const btn=document.getElementById('dualExportBtn');
  const progress=document.getElementById('exportProgress');
  const state=document.getElementById('exportState');
  const mp4=document.getElementById('downloadMp4');
  const wmv=document.getElementById('downloadWmv');
  if(!btn)return;

  let badge=document.getElementById('hksDesktopRenderBadge129');
  if(!badge){
    badge=document.createElement('div');badge.id='hksDesktopRenderBadge129';badge.textContent='Windows • בודק מנוע רינדור...';
    btn.parentElement?.insertBefore(badge,btn);
    const st=document.createElement('style');st.textContent='#hksDesktopRenderBadge129{margin:6px 0;padding:7px 10px;border:1px solid #8051a1;border-radius:9px;background:#171019;color:#f1d77d;font-size:11px;font-weight:900;direction:rtl}';document.head.appendChild(st);
  }

  api.rendererInfo().then(info=>{
    if(!info?.available)badge.textContent='Windows • FFmpeg מקומי לא נמצא';
    else if(info.nvencSupported)badge.textContent='Windows • FFmpeg מקומי • NVIDIA NVENC זמין';
    else badge.textContent='Windows • FFmpeg מקומי • רינדור CPU';
  }).catch(()=>badge.textContent='Windows • מצב רינדור לא ידוע');

  api.onRenderProgress(data=>{
    const p=Math.max(0,Math.min(100,Number(data?.percent)||0));
    if(progress)progress.value=p;
    if(state)state.textContent=data?.state||'מרנדר...';
    try{setStatus(data?.state||'מרנדר...')}catch(_){}
  });

  function setNativeResult(anchor,filePath,label){
    if(!anchor)return;
    anchor.classList.add('ready');
    anchor.removeAttribute('href');
    anchor.textContent=label;
    anchor.onclick=e=>{e.preventDefault();api.openPath(filePath)};
  }

  async function renderDesktop(){
    try{
      if(exportBusy)return;
      if(!audioInputFile){setExportState('קודם טען קובץ מוזיקה',0);return}
      if(!Array.isArray(words)||!words.length||!words.some(w=>w.time!=null)){setExportState('קודם בצע סנכרון למילים',0);return}
      const duration=Number(document.getElementById('audio')?.duration)||Number(audioBuffer?.duration)||0;
      if(!(duration>0)){setExportState('לא הצלחתי לקרוא את אורך השיר',0);return}
      const audioPath=api.getPathForFile(audioInputFile);
      const bgVideoPath=videoInputFile?api.getPathForFile(videoInputFile):'';
      const bgImagePath=imageInputFile?api.getPathForFile(imageInputFile):'';
      if(!audioPath){setExportState('Windows לא הצליח לקבל את נתיב קובץ המוזיקה',0);return}
      const preset=exportPreset();
      const title=(window.__hksSongTitleState?.text||document.getElementById('hksSongTitleInput')?.value||'karaoke').trim()||'karaoke';
      exportBusy=true;btn.disabled=true;
      mp4?.classList.remove('ready');wmv?.classList.remove('ready');
      setExportState('פותח חלון שמירה ומכין FFmpeg מקומי...',1);
      document.getElementById('audio')?.pause();
      const result=await api.renderKaraoke({
        audioPath,
        backgroundPath:bgVideoPath||bgImagePath||'',
        backgroundType:bgVideoPath?'video':bgImagePath?'image':null,
        ass:buildAss(duration),
        duration,preset,title
      });
      if(result?.canceled){setExportState('הרינדור בוטל',0);return}
      setNativeResult(mp4,result.mp4Path,'פתח MP4');
      setNativeResult(wmv,result.wmvPath,'פתח WMV');
      const enc=result?.encoder||'FFmpeg מקומי';
      setExportState(`הרינדור הסתיים ב-Windows (${enc}) — MP4 ו-WMV נשמרו`,100);
    }catch(e){
      console.error('[v129 native render]',e);
      setExportState('הרינדור נעצר: '+(e?.message||e),0);
    }finally{
      exportBusy=false;btn.disabled=false;
    }
  }

  btn.onclick=renderDesktop;
  btn.textContent='רנדר Windows מהיר';
  btn.title='FFmpeg מקומי; משתמש ב-NVIDIA NVENC אוטומטית כאשר הוא זמין';
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.129 • Windows';
})();
