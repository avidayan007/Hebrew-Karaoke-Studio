// Hebrew Karaoke Studio Web v1.59 — sync display session gate, including restored projects
(function(){
  const audioEl=document.getElementById('audio');
  const lyricsPreview=document.getElementById('lyricsPreview');
  if(!audioEl||!lyricsPreview)return;

  const isTimed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  const hasSavedTiming=()=>{try{return Array.isArray(words)&&words.some(isTimed)}catch(_){return false}};
  let syncSessionStarted=hasSavedTiming();

  function titleText(){return (window.__hksSongTitleState?.text||'').trim()}
  function showTitleOnly(){
    lyricsPreview.innerHTML='';
    lyricsPreview.style.setProperty('visibility','hidden','important');
    lyricsPreview.style.setProperty('opacity','0','important');
    lyricsPreview.setAttribute('aria-hidden','true');
    const slide=document.getElementById('hksSongTitleSlide');
    if(slide&&titleText()){
      slide.hidden=false;
      slide.style.setProperty('display','flex','important');
      slide.style.setProperty('visibility','visible','important');
      slide.style.setProperty('opacity','1','important');
    }
  }
  function showLyrics(){
    lyricsPreview.style.setProperty('display','block','important');
    lyricsPreview.style.setProperty('visibility','visible','important');
    lyricsPreview.style.setProperty('opacity','1','important');
    lyricsPreview.setAttribute('aria-hidden','false');
    const slide=document.getElementById('hksSongTitleSlide');
    if(slide){
      slide.hidden=true;
      slide.classList.remove('hksTitleEnter','hksTitleExit');
      slide.style.setProperty('display','none','important');
      slide.style.setProperty('visibility','hidden','important');
      slide.style.setProperty('opacity','0','important');
    }
  }
  function enforce(){syncSessionStarted?showLyrics():showTitleOnly()}
  function setSession(v){syncSessionStarted=!!v;enforce()}

  function beginFreshSyncSession(){
    syncSessionStarted=false;
    try{current=0;renderWords()}catch(_){}
    try{audioEl.currentTime=0}catch(_){}
    showTitleOnly();
    try{window.__hksDrawSyncWave?.()}catch(_){}
    try{setStatus('התחלת ניגון — עדיין לא התחיל סנכרון. לחץ ◆ סנכרן במילה הראשונה.')}catch(_){}
  }
  ['startBtn','startBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(beginFreshSyncSession,0)));

  function afterSync(){
    if(hasSavedTiming()){
      syncSessionStarted=true;
      showLyrics();
      try{updateSyncPreview();updateLivePreview()}catch(_){}
    }
  }
  ['syncBtn','syncBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(afterSync,0)));
  document.addEventListener('keydown',e=>{if(e.code==='Space'&&document.activeElement?.tagName!=='TEXTAREA'&&document.activeElement?.tagName!=='INPUT')setTimeout(afterSync,0)});
  document.getElementById('resetBtn')?.addEventListener('click',()=>setTimeout(()=>setSession(false),0));

  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(()=>{
    syncSessionStarted=hasSavedTiming();
    enforce();
    if(syncSessionStarted)try{updateLivePreview()}catch(_){}
  },900));

  audioEl.addEventListener('play',enforce);
  audioEl.addEventListener('seeking',enforce);
  audioEl.addEventListener('timeupdate',()=>{if(!syncSessionStarted)showTitleOnly()});
  const mo=new MutationObserver(()=>{if(!syncSessionStarted&&lyricsPreview.innerHTML)showTitleOnly()});
  mo.observe(lyricsPreview,{childList:true,subtree:true,characterData:true});

  window.__hksSyncSessionStarted=()=>syncSessionStarted;
  window.__hksSetSyncSessionStarted=setSession;
  window.__hksBeginFreshSyncSession=beginFreshSyncSession;
  window.__hksRefreshIntroVisibility=enforce;
  window.__hksForceLyricsVisible59=showLyrics;
  enforce();
})();