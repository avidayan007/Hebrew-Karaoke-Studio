// Avi Karaoke Studio Web v1.114 — edit/add unsynced lyrics without losing completed synchronization
(function(){
  const ta=document.getElementById('lyricsText');if(!ta)return;
  let timer=null,lastText=ta.value;
  const tokenize=text=>{
    const out=[];text.replace(/\r/g,'').split('\n').forEach((line,li)=>line.trim().split(/\s+/).filter(Boolean).forEach(t=>out.push({t,line:li})));
    return out;
  };
  function refresh(){
    const text=ta.value;if(text===lastText)return;lastText=text;
    try{
      const fresh=tokenize(text),old=Array.isArray(words)?words:[];
      // Preserve the already synchronized PREFIX exactly. User may freely edit/add words after it.
      let syncedPrefix=0;
      while(syncedPrefix<old.length&&Number.isFinite(Number(old[syncedPrefix]?.time)))syncedPrefix++;
      // If the edit changed any already-synced token, stop preservation at the first changed token.
      let keep=0;
      while(keep<syncedPrefix&&keep<fresh.length&&String(old[keep]?.t)===String(fresh[keep]?.t)){keep++}
      const rebuilt=fresh.map((x,i)=>{
        if(i<keep){const o=old[i];return {...o,t:x.t,line:x.line}}
        return {t:x.t,time:null,line:x.line};
      });
      words=rebuilt;
      current=Math.min(keep,words.length);
      renderWords();updateSyncPreview();updateLivePreview();window.__hksDrawSyncWave?.();
      try{setStatus(`המילים עודכנו — נשמרו ${keep} מילים שכבר סונכרנו. אפשר להמשיך לסנכרן מהמילה הבאה.`)}catch(_){}
    }catch(e){console.error('[v114 lyrics refresh]',e)}
  }
  ta.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(refresh,180)});
  // Ensure playback/sync buttons see the edited word list even if clicked immediately after typing.
  ['syncBtn','syncBtn2','startBtn','startBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('pointerdown',()=>{clearTimeout(timer);refresh()},true));
  window.__hksRefreshEditedLyrics114=refresh;
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.114';
})();