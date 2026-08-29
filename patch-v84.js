// Hebrew Karaoke Studio Web v1.84 — render monitor + cleaner compact sync words
(function(){
  const syncCard=document.getElementById('hksStudioSyncCard');
  const exportPage=document.getElementById('export');
  const progress=document.getElementById('exportProgress');
  const state=document.getElementById('exportState');

  const style=document.createElement('style');
  style.id='hksPolish84';
  style.textContent=`
    /* Cleaner, smaller synchronization rows */
    #hksStudioSyncCard #wordList{
      font-size:10px!important;
      line-height:1.05!important;
      padding:2px!important;
    }
    #hksStudioSyncCard #wordList .wordrow{
      grid-template-columns:24px minmax(0,1fr) 62px!important;
      gap:3px!important;
      min-height:20px!important;
      padding:2px 4px!important;
      font-size:10px!important;
      line-height:1.05!important;
      align-items:center!important;
      border-bottom:1px solid rgba(255,255,255,.07)!important;
    }
    #hksStudioSyncCard #wordList .wordrow span{
      font-size:10px!important;
      line-height:1.05!important;
      min-width:0!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
    }
    #hksStudioSyncCard #wordList .wordrow span:nth-child(1),
    #hksStudioSyncCard #wordList .wordrow span:nth-child(3){opacity:.75!important}
    #hksStudioSyncCard #wordList .wordrow.current{border-radius:5px!important}

    /* Export render monitor */
    #hksRenderMonitor84{margin:10px 0 12px;padding:9px;background:#07111c;border:1px solid #263747;border-radius:12px}
    .hksRenderTitle84{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:7px;font-size:12px}
    #hksRenderPercent84{font-weight:900;color:#7fc4ff}
    .hksRenderScreen84{position:relative;aspect-ratio:16/9;background:#02060b;border:1px solid #33485b;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center}
    .hksRenderScreen84 img,.hksRenderScreen84 video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .hksRenderLyrics84{position:relative;z-index:3;width:90%;text-align:center;direction:rtl;color:#fff;font-size:clamp(16px,3vw,34px);font-weight:900;line-height:1.35;text-shadow:-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000}
    .hksRenderBrandL84,.hksRenderBrandR84{position:absolute;top:8px;z-index:4;color:#2584e6;font-weight:900;text-shadow:1px 1px #fff,-1px -1px #fff;font-size:clamp(9px,1.6vw,15px)}
    .hksRenderBrandL84{left:10px;direction:ltr}.hksRenderBrandR84{right:10px}
    .hksRenderMeta84{display:flex;justify-content:space-between;gap:8px;margin-top:7px;font-size:10px;color:#9fb1c3}
    @media(min-width:850px){#hksRenderMonitor84{max-width:760px;margin-inline:auto}}
  `;
  document.head.appendChild(style);

  if(exportPage && progress && state && !document.getElementById('hksRenderMonitor84')){
    const monitor=document.createElement('div');
    monitor.id='hksRenderMonitor84';
    monitor.innerHTML=`
      <div class="hksRenderTitle84"><strong>תצוגת התקדמות הרינדור</strong><span id="hksRenderPercent84">0%</span></div>
      <div class="hksRenderScreen84">
        <img id="hksRenderImg84" hidden>
        <video id="hksRenderVideo84" muted playsinline hidden></video>
        <div class="hksRenderBrandL84">Avi Dayan The Show</div>
        <div class="hksRenderBrandR84">אבי דיין ההופעה</div>
        <div id="hksRenderLyrics84" class="hksRenderLyrics84">מוכן לרינדור</div>
      </div>
      <div class="hksRenderMeta84"><span id="hksRenderTime84">00:00 / 00:00</span><span id="hksRenderStage84">מוכן</span></div>`;
    progress.insertAdjacentElement('beforebegin',monitor);

    const img=document.getElementById('hksRenderImg84');
    const vid=document.getElementById('hksRenderVideo84');
    const pct=document.getElementById('hksRenderPercent84');
    const lyricsEl=document.getElementById('hksRenderLyrics84');
    const timeEl=document.getElementById('hksRenderTime84');
    const stageEl=document.getElementById('hksRenderStage84');
    let lastVideoSrc='';

    function fmtShort(t){
      t=Math.max(0,Number(t)||0);const m=Math.floor(t/60),s=Math.floor(t%60);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
    function linesAt(t){
      try{
        if(!Array.isArray(words)||!words.length)return [];
        let idx=0,found=false;
        for(let i=0;i<words.length;i++){
          if(Number.isFinite(words[i].time)&&words[i].time<=t){idx=i;found=true}else if(Number.isFinite(words[i].time)&&words[i].time>t)break;
        }
        if(!found)idx=0;
        return typeof fourLinesForWordIndex==='function'?fourLinesForWordIndex(idx):[];
      }catch(_){return []}
    }
    function syncBackground(){
      const srcVideo=document.getElementById('bgVideo');
      const srcImg=document.getElementById('bgImg');
      if(srcVideo && srcVideo.src){
        img.hidden=true;vid.hidden=false;
        if(lastVideoSrc!==srcVideo.src){vid.src=srcVideo.src;lastVideoSrc=srcVideo.src;vid.load();}
      }else if(srcImg && srcImg.src){
        vid.hidden=true;img.hidden=false;img.src=srcImg.src;
      }else{vid.hidden=true;img.hidden=true;}
    }
    function refresh(){
      const p=Math.max(0,Math.min(100,Number(progress.value)||0));
      const duration=Number(document.getElementById('audio')?.duration)||0;
      const t=duration*(p/100);
      pct.textContent=Math.round(p)+'%';
      stageEl.textContent=state.textContent||'מוכן';
      timeEl.textContent=`${fmtShort(t)} / ${fmtShort(duration)}`;
      syncBackground();
      const lines=linesAt(t);
      lyricsEl.innerHTML=lines.length?lines.map(x=>`<div>${String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</div>`).join(''):(p>0?'מרנדר…':'מוכן לרינדור');
      if(!vid.hidden && duration){
        try{const vt=Math.max(0,Math.min((vid.duration||duration)-.05,t));if(Number.isFinite(vt))vid.currentTime=vt}catch(_){ }
      }
    }
    new MutationObserver(refresh).observe(state,{childList:true,subtree:true,characterData:true});
    progress.addEventListener('input',refresh);
    setInterval(refresh,300);
    refresh();
  }

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.84';
})();