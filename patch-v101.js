// Avi Karaoke Studio Web v1.101 — open saved project by double-click via installed PWA file handler
(function(){
  const load=document.getElementById('loadProject');
  if(!load)return;

  async function handProjectFileToExistingLoader(file){
    try{
      const dt=new DataTransfer();
      dt.items.add(file);
      load.files=dt.files;
      load.dispatchEvent(new Event('change',{bubbles:true}));
    }catch(e){
      console.error('[v101 auto-open project]',e);
      try{setStatus('לא הצלחתי לפתוח את קובץ הפרויקט אוטומטית')}catch(_){ }
    }
  }

  if('launchQueue' in window && window.launchQueue?.setConsumer){
    window.launchQueue.setConsumer(async launchParams=>{
      const files=launchParams?.files||[];
      if(!files.length)return;
      try{
        const file=await files[0].getFile();
        try{setStatus('פותח את פרויקט Avi Karaoke…')}catch(_){ }
        await handProjectFileToExistingLoader(file);
      }catch(e){
        console.error('[v101 launchQueue]',e);
        try{setStatus('לא הצלחתי לקרוא את קובץ הפרויקט שנפתח')}catch(_){ }
      }
    });
  }

  // Keep manual Open compatible with the associated project format as well.
  if(load.accept&&!load.accept.includes('.avikaraoke')) load.accept='.avikaraoke,'+load.accept;

  // Small hint shown only on desktop-capable browsers.
  if('launchQueue' in window){
    const host=document.getElementById('hksProjectHomeActions')||document.getElementById('hksCompactToolbar80')||load.closest('.card');
    if(host&&!document.getElementById('hksFileHandlerHint101')){
      const hint=document.createElement('div');
      hint.id='hksFileHandlerHint101';
      hint.textContent='קובץ פרויקט: לאחר התקנת Avi Karaoke כאפליקציה, לחיצה כפולה על הקובץ תפתח אותו אוטומטית.';
      hint.style.cssText='width:100%;font-size:10px;font-weight:700;opacity:.72;text-align:center;margin-top:4px;';
      host.appendChild(hint);
    }
  }

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.101';
  console.log('[v101] PWA project-file auto-open enabled');
})();
