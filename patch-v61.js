// Hebrew Karaoke Studio Web v1.61 — live result follows every synced word timing
(function(){
  const audioEl=document.getElementById('audio');
  const lyricsEl=document.getElementById('lyricsPreview');
  if(!audioEl||!lyricsEl)return;

  const isTimed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  const normalColor=()=>localStorage.getItem('hksLyricsColor')||'#ffffff';

  const style=document.createElement('style');
  style.textContent=`
    #lyricsPreview .hksLiveWord{color:var(--hks-live-normal,#fff);transition:color .06s linear,text-shadow .06s linear}
    #lyricsPreview .hksLiveWord.hksLiveDone{color:#ffb23c!important}
    #lyricsPreview .hksLiveWord.hksLiveCurrent{color:#ffd36a!important;text-shadow:0 0 8px rgba(255,179,60,.55)}
  `;
  document.head.appendChild(style);

  function titleOnly(){
    lyricsEl.innerHTML='';
    lyricsEl.style.setProperty('visibility','hidden','important');
    lyricsEl.style.setProperty('opacity','0','important');
    const slide=document.getElementById('hksSongTitleSlide');
    const title=(window.__hksSongTitleState?.text||'').trim();
    if(slide&&title){
      slide.hidden=false;
      slide.style.setProperty('display','flex','important');
      slide.style.setProperty('visibility','visible','important');
      slide.style.setProperty('opacity','1','important');
    }
  }

  function showLyrics(){
    lyricsEl.style.setProperty('visibility','visible','important');
    lyricsEl.style.setProperty('opacity','1','important');
    const slide=document.getElementById('hksSongTitleSlide');
    if(slide)slide.hidden=true;
  }

  function firstTimedIndex(){
    try{return Array.isArray(words)?words.findIndex(isTimed):-1}catch(_){return-1}
  }

  function activeIndexAt(t){
    let best=-1;
    try{
      for(let i=0;i<words.length;i++){
        if(!isTimed(words[i]))continue;
        if(Number(words[i].time)<=t+0.005)best=i;
        else break;
      }
    }catch(_){}
    return best;
  }

  function renderLiveByTiming(){
    let arr=[];try{arr=Array.isArray(words)?words:[]}catch(_){}
    if(!arr.length)return;

    const first=firstTimedIndex();
    if(first<0){titleOnly();return}

    const t=Number(audioEl.currentTime)||0;
    const firstTime=Number(arr[first].time);
    if(t+0.005<firstTime){titleOnly();return}

    const active=Math.max(first,activeIndexAt(t));
    const lineNo=arr[Math.min(active,arr.length-1)]?.line??0;
    const startLine=Math.floor(lineNo/4)*4;

    lyricsEl.style.setProperty('--hks-live-normal',normalColor());
    lyricsEl.innerHTML='';
    for(let line=startLine;line<startLine+4;line++){
      const row=document.createElement('div');
      let added=0;
      arr.forEach((w,i)=>{
        if((w.line??0)!==line)return;
        if(added++)row.appendChild(document.createTextNode(' '));
        const s=document.createElement('span');
        s.className='hksLiveWord';
        s.textContent=w.t;
        if(isTimed(w)&&Number(w.time)<=t+0.005)s.classList.add('hksLiveDone');
        if(i===active)s.classList.add('hksLiveCurrent');
        row.appendChild(s);
      });
      if(added)lyricsEl.appendChild(row);
    }
    showLyrics();
  }

  // Final override: result preview is driven by the actual time of every word.
  window.updateLivePreview=renderLiveByTiming;
  audioEl.addEventListener('timeupdate',renderLiveByTiming);
  audioEl.addEventListener('seeked',renderLiveByTiming);
  audioEl.addEventListener('play',renderLiveByTiming);
  ['syncBtn','syncBtn2','undoBtn','resetBtn','startBtn','startBtn2','playBtn'].forEach(id=>{
    document.getElementById(id)?.addEventListener('click',()=>setTimeout(renderLiveByTiming,0));
  });
  document.getElementById('hksLyricsColor')?.addEventListener('input',renderLiveByTiming);

  window.__hksRenderLiveByTiming=renderLiveByTiming;
  renderLiveByTiming();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.61';
})();
