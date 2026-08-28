// Hebrew Karaoke Studio Web v1.44 — adaptive song-title animation based on first synced word
(function(){
  const slide=document.getElementById('hksSongTitleSlide');
  const frame=document.getElementById('hksSongTitleFrame');
  const audio=document.getElementById('audio');
  if(!slide||!frame||!audio)return;

  const style=document.createElement('style');
  style.textContent=`
    #hksSongTitleSlide.hksTitleEnter #hksSongTitleFrame{
      animation-duration:var(--hks-title-enter-ms,1700ms)!important;
    }
    #hksSongTitleSlide.hksTitleExit #hksSongTitleFrame{
      animation-duration:var(--hks-title-exit-ms,420ms)!important;
    }
  `;
  document.head.appendChild(style);

  function firstTime(){
    try{
      const t=Array.isArray(words)&&words.length?Number(words[0]?.time):NaN;
      return Number.isFinite(t)&&t>0?t:null;
    }catch(_){return null}
  }

  function timingForLead(lead){
    // Use about 45% of the intro for the entrance, while always leaving time to read the title.
    const safe=Math.max(.15,Number(lead)||0);
    let enter=Math.max(.32,Math.min(3.2,safe*.45));
    enter=Math.min(enter,Math.max(.28,safe*.72));
    const exit=Math.max(.18,Math.min(.5,safe*.09));
    return {enter,exit};
  }

  function applyAdaptiveTiming(){
    const t=firstTime();
    const tm=timingForLead(t||3.8);
    slide.style.setProperty('--hks-title-enter-ms',Math.round(tm.enter*1000)+'ms');
    slide.style.setProperty('--hks-title-exit-ms',Math.round(tm.exit*1000)+'ms');
    window.__hksTitleAdaptiveTiming={lead:t,enter:tm.enter,exit:tm.exit};
    return tm;
  }

  function titleHasText(){
    return !!String(window.__hksSongTitleState?.text||document.getElementById('hksSongTitleInput')?.value||'').trim();
  }

  function restartEnter(){
    if(!titleHasText())return;
    applyAdaptiveTiming();
    slide.hidden=false;
    slide.classList.remove('hksTitleExit','hksTitleEnter');
    void frame.offsetWidth;
    slide.classList.add('hksTitleEnter');
  }

  function showForCurrentTime(forceReplay){
    if(!titleHasText()){slide.hidden=true;return}
    const t=firstTime();
    if(t==null){
      // During the first synchronization pass the first-word time is not known yet.
      if(slide.hidden||forceReplay)restartEnter();
      return;
    }
    const now=Number(audio.currentTime)||0;
    if(now<t-.02){
      if(slide.hidden||forceReplay)restartEnter();
      else applyAdaptiveTiming();
    }else if(!slide.hidden){
      slide.hidden=true;
      slide.classList.remove('hksTitleEnter','hksTitleExit');
    }
  }

  // Once the first sync click teaches us the intro length, future playback uses that exact lead time.
  ['syncBtn','syncBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{
    setTimeout(()=>{applyAdaptiveTiming();showForCurrentTime(false)},15);
  }));

  // On replay from the beginning, show the title again even though word 1 is already synchronized.
  ['startBtn','startBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{
    setTimeout(()=>showForCurrentTime(true),35);
  }));
  audio.addEventListener('play',()=>showForCurrentTime((Number(audio.currentTime)||0)<.12));
  audio.addEventListener('seeked',()=>showForCurrentTime((Number(audio.currentTime)||0)<.12));
  audio.addEventListener('timeupdate',()=>showForCurrentTime(false));

  // Replace the fixed v1.43 export move time with a duration calculated from the first synced word.
  try{
    const originalBuildAss=window.buildAss;
    if(typeof originalBuildAss==='function'&&!originalBuildAss.__hksTitle44){
      const wrapped=function(duration){
        let ass=originalBuildAss(duration);
        const lead=firstTime();
        if(!(lead>0)||!ass.includes(',SongTitle,'))return ass;
        const tm=timingForLead(lead);
        const moveMs=Math.max(250,Math.min(Math.round(tm.enter*1000),Math.max(250,Math.round(lead*1000)-120)));
        const fadeIn=Math.max(120,Math.min(Math.round(moveMs*.48),900));
        const fadeOut=Math.max(120,Math.min(Math.round(tm.exit*1000),500));
        ass=ass.replace(/\\move\((\d+),(\d+),(\d+),(\d+),0,\d+\)/g,`\\move($1,$2,$3,$4,0,${moveMs})`);
        ass=ass.replace(/\\fad\(\d+,\d+\)/g,`\\fad(${fadeIn},${fadeOut})`);
        return ass;
      };
      wrapped.__hksTitle44=true;
      window.buildAss=wrapped;
    }
  }catch(e){console.warn('[v44 adaptive title export]',e)}

  applyAdaptiveTiming();
  showForCurrentTime(false);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.44';
})();
