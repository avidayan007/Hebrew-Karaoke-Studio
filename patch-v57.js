// Hebrew Karaoke Studio Web v1.57 — playback start never syncs; only Sync assigns word timing
(function(){
  const audioEl=document.getElementById('audio');
  const lyricsPreview=document.getElementById('lyricsPreview');
  const startMain=document.getElementById('startBtn');
  const startSync=document.getElementById('startBtn2');
  if(!audioEl)return;

  const isTimed=w=>!!w && w.time!=null && Number.isFinite(Number(w.time));
  const hasFirstSync=()=>{try{return Array.isArray(words)&&words.length>0&&isTimed(words[0])}catch(_){return false}};

  // Make the wording unambiguous: this button only starts playback from 0:00.
  if(startMain)startMain.textContent='◀ התחלת ניגון';
  if(startSync)startSync.textContent='◀ התחלת ניגון';
  [startMain,startSync].forEach(btn=>btn?.setAttribute('aria-label','התחלת ניגון מההתחלה ללא סנכרון'));

  // Correct visual state in the sync view: orange means an ACTUALLY timed word only.
  const style=document.createElement('style');
  style.textContent=`
    .hksSyncWord{color:#f5f8fb!important;background:transparent!important;transform:none!important}
    .hksSyncWord.hksTimed{color:#ffb23c!important}
    .hksSyncWord.hksSelected{outline:1px solid #8aa1b5;outline-offset:2px}
    .hksSyncWord.hksTimed.hksSelected{color:#ffb23c!important;background:#ffb23c14!important}
  `;
  document.head.appendChild(style);

  function syncStartLine(){
    try{
      if(!Array.isArray(words)||!words.length)return 0;
      const idx=Math.min(Math.max(Number(current)||0,0),words.length-1);
      return Math.floor((words[idx]?.line??0)/4)*4;
    }catch(_){return 0}
  }

  window.renderWords=function(){
    const el=document.getElementById('wordList');if(!el)return;
    el.className='hksSyncLyrics';el.innerHTML='';
    let arr=[];try{arr=Array.isArray(words)?words:[]}catch(_){}
    if(!arr.length){const empty=document.createElement('div');empty.className='small';empty.textContent='הכנס מילים — הן מוכנות לסנכרון אוטומטית';el.appendChild(empty);return;}
    const start=syncStartLine();
    for(let lineNo=start;lineNo<start+4;lineNo++){
      const row=document.createElement('div');row.className='hksSyncLine';
      const lineWords=[];arr.forEach((w,i)=>{if((w.line??0)===lineNo)lineWords.push([w,i])});
      lineWords.forEach(([w,i],n)=>{
        if(n)row.appendChild(document.createTextNode(' '));
        const s=document.createElement('span');
        const timed=isTimed(w),selected=i===current;
        s.className='hksSyncWord'+(timed?' hksTimed':'')+(selected?' hksSelected':'');
        s.textContent=w.t;
        s.title=(i+1)+(timed?' • '+fmt(Number(w.time)):'');
        s.dataset.wordIndex=String(i);
        s.onclick=()=>selectWord(i,false);
        s.ondblclick=e=>{e.preventDefault();selectWord(i,true)};
        s.addEventListener('touchend',e=>{
          const now=Date.now();
          if(lastTapIndex===i&&now-lastTapTime<500){e.preventDefault();selectWord(i,true);lastTapIndex=-1}
          else{lastTapIndex=i;lastTapTime=now}
        },{passive:false});
        row.appendChild(s);
      });
      el.appendChild(row);
    }
  };

  function refreshIntro(){
    if(!lyricsPreview)return;
    const show=hasFirstSync();
    lyricsPreview.style.setProperty('visibility',show?'visible':'hidden','important');
    lyricsPreview.style.setProperty('opacity',show?'1':'0','important');
    const slide=document.getElementById('hksSongTitleSlide');
    const title=(window.__hksSongTitleState?.text||'').trim();
    if(slide&&title){slide.hidden=show; if(!show){slide.style.setProperty('display','flex','important');slide.style.setProperty('opacity','1','important')}}
  }

  // After pressing playback-start, explicitly keep an unsynced first word unsynced.
  // No timing is written here. Timing is written only by the existing Sync action.
  function afterStart(){
    try{audioEl.currentTime=0}catch(_){}
    try{renderWords()}catch(_){}
    refreshIntro();
    window.__hksDrawSyncWave?.();
    try{setStatus('הניגון התחיל מההתחלה — עדיין לא סונכרנה אף מילה חדשה. לחץ ◆ סנכרן בזמן המילה הראשונה.')}catch(_){}
  }
  [startMain,startSync].forEach(btn=>btn?.addEventListener('click',()=>setTimeout(afterStart,0)));

  // Any actual sync/undo/reset refreshes the real timed-word state.
  ['syncBtn','syncBtn2','undoBtn','resetBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(()=>{try{renderWords()}catch(_){}refreshIntro();window.__hksDrawSyncWave?.()},0)));
  document.addEventListener('keydown',e=>{if(e.code==='Space')setTimeout(()=>{try{renderWords()}catch(_){}refreshIntro();window.__hksDrawSyncWave?.()},0)});

  window.__hksRefreshIntroVisibility=refreshIntro;
  try{renderWords()}catch(_){}
  refreshIntro();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.57';
})();
