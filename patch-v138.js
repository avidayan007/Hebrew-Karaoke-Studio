// Avi Karaoke Studio Web v1.138 — hard update recovery for stale iPhone PWA caches
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const CURRENT=139,SW='hks-v139';
  const $=s=>document.querySelector(s);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  async function pingSW(){
    return new Promise(resolve=>{
      const c=navigator.serviceWorker?.controller;if(!c)return resolve('');
      const ch=new MessageChannel(),t=setTimeout(()=>resolve(''),1200);
      ch.port1.onmessage=e=>{clearTimeout(t);resolve(String(e.data||''))};
      try{c.postMessage({type:'HKS_SW_VERSION'},[ch.port2])}catch(_){clearTimeout(t);resolve('')}
    });
  }

  async function hardUpdate(btn){
    if(window.__hksHardUpdating138)return;
    window.__hksHardUpdating138=true;
    const old=btn?.textContent||'רענן עדכון';
    try{
      if(btn){btn.disabled=true;btn.textContent='מעדכן לגרסה החדשה…'}
      try{setStatus('מנקה cache ישן ומביא את הגרסה החדשה…')}catch(_){}
      try{
        const keys=await caches.keys();
        await Promise.all(keys.filter(k=>/^hks-v/i.test(k)&&k!==SW).map(k=>caches.delete(k)));
      }catch(_){}

      if('serviceWorker' in navigator){
        try{const reg=await navigator.serviceWorker.register('sw.js?v=139',{updateViaCache:'none'});await reg.update()}catch(_){}
        for(let i=0;i<12;i++){
          if(await pingSW()===SW)break;
          await sleep(350);
        }
      }
      const u=new URL(location.href);u.searchParams.set('hksUpdate','139');u.searchParams.set('_',Date.now().toString());
      location.replace(u.href);
    }catch(e){
      window.__hksHardUpdating138=false;
      if(btn){btn.disabled=false;btn.textContent=old}
      try{setStatus('העדכון לא הושלם: '+(e?.message||e))}catch(_){}
    }
  }

  function bindUpdateButton(){
    const btn=[...document.querySelectorAll('button')].find(b=>/רענן\s*עדכון|עדכון\s*רענן/.test(String(b.textContent||'')));
    if(!btn||btn.dataset.hksUpdate138)return;
    btn.dataset.hksUpdate138='1';
    btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();hardUpdate(btn)},true);
  }
  bindUpdateButton();
  new MutationObserver(bindUpdateButton).observe(document.documentElement,{subtree:true,childList:true});

  window.__hksHardUpdate138=()=>hardUpdate(bindUpdateButton());
  const ver=$('.version');if(ver&&Number(window.__hksLoaderVersion||0)<139)ver.textContent='Web v1.138';
  try{navigator.serviceWorker?.register?.('sw.js?v=139',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
