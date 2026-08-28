// Hebrew Karaoke Studio Web v1.48 — lyrics are automatically ready for synchronization
(function(){
  const lyrics=document.getElementById('lyricsText');
  const prepareBtn=document.getElementById('prepareBtn');
  if(!lyrics||!prepareBtn)return;

  // The old "prepare for sync" step is no longer needed in the UI.
  prepareBtn.hidden=true;
  prepareBtn.style.display='none';
  prepareBtn.setAttribute('aria-hidden','true');

  let timer=null;
  let lastPrepared='';
  function autoPrepare(force){
    const text=lyrics.value;
    if(!text.trim()){
      if(force||lastPrepared){
        try{prepare()}catch(_){}
        lastPrepared='';
      }
      return;
    }
    if(!force&&text===lastPrepared)return;
    try{
      prepare();
      lastPrepared=text;
      try{setStatus('המילים מוכנות לסנכרון אוטומטית')}catch(_){}
    }catch(e){console.warn('[v48 auto prepare]',e)}
  }

  // Prepare automatically shortly after typing/pasting, so no extra button press is required.
  lyrics.addEventListener('input',()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>autoPrepare(false),180);
  });
  lyrics.addEventListener('paste',()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>autoPrepare(true),20);
  });
  lyrics.addEventListener('change',()=>autoPrepare(false));

  // If lyrics were already present when this patch loaded, make them ready immediately.
  if(lyrics.value.trim())setTimeout(()=>autoPrepare(true),0);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.48';
})();
