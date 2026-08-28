// Hebrew Karaoke Studio Web v1.49 — add/edit lyrics mid-project without losing existing sync
(function(){
  const oldLyrics=document.getElementById('lyricsText');
  if(!oldLyrics)return;

  // v1.48 attached listeners that rebuilt all words and cleared timings on every edit.
  // Clone the textarea to remove those listeners, then install a preserving updater.
  const lyrics=oldLyrics.cloneNode(true);
  lyrics.value=oldLyrics.value;
  oldLyrics.replaceWith(lyrics);

  function parseText(text){
    const out=[];
    String(text||'').split(/\r?\n/).forEach((line,li)=>{
      line.trim().split(/\s+/).filter(Boolean).forEach(t=>out.push({t,time:null,line:li}));
    });
    return out;
  }

  function same(a,b){return !!a&&!!b&&a.t===b.t}

  function rebuildPreservingSync(){
    const next=parseText(lyrics.value);
    let old=[];
    try{old=Array.isArray(words)?words:[]}catch(_){old=[]}

    // Preserve the unchanged beginning.
    let p=0;
    while(p<old.length&&p<next.length&&same(old[p],next[p])){
      next[p].time=old[p].time;
      p++;
    }

    // Preserve the unchanged ending. This makes inserting/deleting words in the
    // middle keep the already-synced timing on all unaffected later words.
    let oi=old.length-1, ni=next.length-1;
    while(oi>=p&&ni>=p&&same(old[oi],next[ni])){
      next[ni].time=old[oi].time;
      oi--;ni--;
    }

    // Any changed/new middle words intentionally start unsynced.
    try{
      words=next;
      // Continue from the first word that still needs timing. If all are timed,
      // keep current at the end.
      const firstUnsynced=words.findIndex(w=>w.time==null);
      current=firstUnsynced<0?words.length:firstUnsynced;
      renderWords();
      updateSyncPreview();
      updateLivePreview();
      try{
        const added=Math.max(0,next.length-old.length);
        setStatus(added?`נוספו ${added} מילים — הן מוכנות לסנכרון, והסנכרון הקיים נשמר`:'המילים עודכנו — הסנכרון הקיים נשמר ככל האפשר');
      }catch(_){}
    }catch(e){console.warn('[v49 preserve sync]',e)}
  }

  let timer=null;
  function schedule(){clearTimeout(timer);timer=setTimeout(rebuildPreservingSync,160)}
  lyrics.addEventListener('input',schedule);
  lyrics.addEventListener('paste',()=>{clearTimeout(timer);timer=setTimeout(rebuildPreservingSync,25)});
  lyrics.addEventListener('change',rebuildPreservingSync);

  // Keep the clear button working with the replacement textarea.
  document.getElementById('clearBtn')?.addEventListener('click',()=>{
    lyrics.value='';
    try{words=[];current=0;renderWords();updateSyncPreview()}catch(_){}
  });

  // If text exists but words have not been built yet, build once now.
  try{if(lyrics.value.trim()&&(!Array.isArray(words)||!words.length))rebuildPreservingSync()}catch(_){}

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.49';
})();
