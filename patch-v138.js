// Avi Karaoke Studio Web v1.144 — smart update checker (no self-update loop)
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const $=s=>document.querySelector(s);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const currentVersion=()=>Math.max(138,Number(window.__hksLoaderVersion||0));

  async function latestVersion(){
    try{
      const r=await fetch(`./version.json?t=${Date.now()}`,{cache:'no-store'});
      if(!r.ok)throw new Error('version '+r.status);
      const j=await r.json();
      const v=Number(j?.version||0);
      return Number.isFinite(v)&&v>0?v:null;
    }catch(_){return null}
  }
  async function pingSW(){
    return new Promise(resolve=>{
      const c=navigator.serviceWorker?.controller;if(!c)return resolve('');
      const ch=new MessageChannel(),t=setTimeout(()=>resolve(''),1000);
      ch.port1.onmessage=e=>{clearTimeout(t);resolve(String(e.data||''))};
      try{c.postMessage({type:'HKS_SW_VERSION'},[ch.port2])}catch(_){clearTimeout(t);resolve('')}
    });
  }
  function restore(btn,text='רענן עדכון'){
    window.__hksHardUpdating138=false;
    if(btn){btn.disabled=false;btn.textContent=text}
  }

  async function hardUpdate(btn){
    if(window.__hksHardUpdating138)return;
    window.__hksHardUpdating138=true;
    const running=currentVersion();
    try{
      if(btn){btn.disabled=true;btn.textContent='בודק עדכון…'}
      try{setStatus('בודק אם קיימת גרסה חדשה…')}catch(_){}
      const latest=await latestVersion();
      if(!latest){restore(btn);try{setStatus('לא הצלחתי לבדוק עדכון כרגע. נסה שוב בעוד רגע.')}catch(_){};return}

      if(latest<=running){
        // Already current: never clear caches or reload the page.
        try{
          const wanted=`hks-v${running}`;
          if(await pingSW()!==wanted){
            const reg=await navigator.serviceWorker.register(`sw.js?v=${running}`,{updateViaCache:'none'});try{await reg.update()}catch(_){}
          }
        }catch(_){}
        restore(btn);
        try{setStatus(`אתה כבר בגרסה האחרונה — v1.${running}.`)}catch(_){}
        return;
      }

      const target=latest,sw=`hks-v${target}`;
      if(btn)btn.textContent=`מעדכן ל-v1.${target}…`;
      try{setStatus(`נמצאה גרסה חדשה v1.${target} — מעדכן…`)}catch(_){}
      if('serviceWorker' in navigator){
        try{const reg=await navigator.serviceWorker.register(`sw.js?v=${target}`,{updateViaCache:'none'});await reg.update()}catch(_){}
        for(let i=0;i<12;i++){if(await pingSW()===sw)break;await sleep(250)}
      }
      const u=new URL(location.href);u.searchParams.set('hksUpdate',String(target));u.searchParams.set('_',Date.now().toString());location.replace(u.href);
    }catch(e){
      restore(btn);
      try{setStatus('העדכון לא הושלם: '+(e?.message||e))}catch(_){}
    }
  }

  function bindUpdateButton(){
    const btn=[...document.querySelectorAll('button')].find(b=>/רענן\s*עדכון|עדכון\s*רענן|מעדכן\s*לגרסה|בודק\s*עדכון/.test(String(b.textContent||'')));
    if(!btn||btn.dataset.hksUpdate138)return btn;
    btn.dataset.hksUpdate138='1';
    btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();hardUpdate(btn)},true);
    return btn;
  }
  bindUpdateButton();new MutationObserver(bindUpdateButton).observe(document.documentElement,{subtree:true,childList:true});
  window.__hksHardUpdate138=()=>hardUpdate(bindUpdateButton());
  const ver=$('.version');if(ver&&Number(window.__hksLoaderVersion||0)<138)ver.textContent='Web v1.138';
})();
