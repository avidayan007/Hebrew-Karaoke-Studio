// Hebrew Karaoke Studio Web v1.63 — plain four-line result slides driven by sync timings
(function(){
  const audioEl=document.getElementById('audio');
  const lyricsEl=document.getElementById('lyricsPreview');
  if(!audioEl||!lyricsEl)return;

  const isTimed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  function titleOnly(){
    lyricsEl.innerHTML='';
    lyricsEl.style.removeProperty('display');
    lyricsEl.style.setProperty('visibility','hidden','important');
    lyricsEl.style.setProperty('opacity','0','important');
    const slide=document.getElementById('hksSongTitleSlide');
    const title=(window.__hksSongTitleState?.text||'').trim();
    if(slide&&title){
      slide.hidden=false;
      slide.classList.remove('hksTitleExit');
      slide.style.setProperty('display','flex','important');
      slide.style.setProperty('visibility','visible','important');
      slide.style.setProperty('opacity','1','important');
    }
  }
  function showLyrics(){
    lyricsEl.style.setProperty('display','block','important');
    lyricsEl.style.setProperty('visibility','visible','important');
    lyricsEl.style.setProperty('opacity','1','important');
    const slide=document.getElementById('hksSongTitleSlide');
    if(slide){
      slide.hidden=true;
      slide.classList.remove('hksTitleEnter','hksTitleExit');
      slide.style.setProperty('display','none','important');
      slide.style.setProperty('visibility','hidden','important');
      slide.style.setProperty('opacity','0','important');
    }
  }
  function firstTimedIndex(){try{return Array.isArray(words)?words.findIndex(isTimed):-1}catch(_){return-1}}
  function activeTimedIndex(t){
    let best=-1;
    try{for(let i=0;i<words.length;i++){const w=words[i];if(!isTimed(w))continue;if(Number(w.time)<=t+0.005)best=i;else break}}catch(_){}
    return best;
  }
  function renderFourLineSlides(){
    let arr=[];try{arr=Array.isArray(words)?words:[]}catch(_){}
    if(!arr.length){titleOnly();return}
    if(window.__hksSyncSessionStarted && !window.__hksSyncSessionStarted()){titleOnly();return}
    const first=firstTimedIndex();if(first<0){titleOnly();return}
    const t=Number(audioEl.currentTime)||0;
    if(t+0.005<Number(arr[first].time)){titleOnly();return}
    const active=Math.max(first,activeTimedIndex(t));
    const lineNo=arr[Math.min(active,arr.length-1)]?.line??0;
    const startLine=Math.floor(lineNo/4)*4;
    const rows=[];
    for(let line=startLine;line<startLine+4;line++){
      const text=arr.filter(w=>(w.line??0)===line).map(w=>w.t).join(' ');
      if(text)rows.push(text);
    }
    lyricsEl.innerHTML=rows.map(text=>`<div>${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`).join('');
    showLyrics();
  }

  window.updateLivePreview=renderFourLineSlides;
  window.__hksRenderLiveByTiming=renderFourLineSlides;
  audioEl.addEventListener('timeupdate',renderFourLineSlides);
  audioEl.addEventListener('seeked',renderFourLineSlides);
  audioEl.addEventListener('play',()=>setTimeout(renderFourLineSlides,0));
  audioEl.addEventListener('pause',()=>setTimeout(renderFourLineSlides,0));
  document.getElementById('playBtn')?.addEventListener('click',()=>setTimeout(renderFourLineSlides,0));
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(()=>{
    try{if(Array.isArray(words)&&words.some(isTimed))window.__hksSetSyncSessionStarted?.(true)}catch(_){}
    renderFourLineSlides();
  },1000));
  ['syncBtn','syncBtn2','undoBtn','resetBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(()=>{
    try{if(Array.isArray(words)&&words.some(isTimed))window.__hksSetSyncSessionStarted?.(true)}catch(_){}
    renderFourLineSlides();
  },0)));

  renderFourLineSlides();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.63';
})();