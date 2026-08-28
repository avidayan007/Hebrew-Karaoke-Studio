// Hebrew Karaoke Studio Web v1.52 — plain song title + auto-ready lyrics after opening saved projects
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #hksSongTitleSlide{background:none!important;padding:0 5%!important}
    #hksSongTitleFrame{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;border-radius:0!important;max-width:94%!important}
    #hksSongTitleFrame:before,#hksSongTitleFrame:after{display:none!important;content:none!important}
    #hksSongTitleNote{display:none!important}
  `;
  document.head.appendChild(style);

  const load=document.getElementById('loadProject');
  const lyrics=document.getElementById('lyricsText');

  function forceLyricsReady(){
    const box=document.getElementById('lyricsText');
    if(!box||!box.value.trim())return;
    try{
      // v1.49 owns the safe preserving rebuild. Trigger its normal input path after project restore.
      box.dispatchEvent(new Event('input',{bubbles:true}));
      setTimeout(()=>{
        try{
          const hasWords=Array.isArray(words)&&words.length>0;
          if(!hasWords){
            const next=[];
            String(box.value||'').split(/\r?\n/).forEach((line,li)=>line.trim().split(/\s+/).filter(Boolean).forEach(t=>next.push({t,time:null,line:li})));
            words=next;current=0;renderWords();updateSyncPreview();updateLivePreview();
          }
          if(Array.isArray(words)&&words.length){
            const firstUnsynced=words.findIndex(w=>w.time==null);
            current=firstUnsynced<0?words.length:firstUnsynced;
            renderWords();updateSyncPreview();updateLivePreview();
            try{setStatus('הפרויקט נפתח — המילים מוכנות לסנכרון מיד')}catch(_){}
          }
        }catch(e){console.warn('[v52 project lyrics ready]',e)}
      },240);
    }catch(e){console.warn('[v52 trigger lyrics ready]',e)}
  }

  if(load){
    const original=load.onchange;
    load.onchange=async function(e){
      if(typeof original==='function')await original.call(this,e);
      forceLyricsReady();
    };
    // Also catch cases where another listener handles loading.
    load.addEventListener('change',()=>setTimeout(forceLyricsReady,500));
  }

  // If the page starts with lyrics already restored, prepare them too.
  if(lyrics?.value.trim())setTimeout(forceLyricsReady,100);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.52';
})();
