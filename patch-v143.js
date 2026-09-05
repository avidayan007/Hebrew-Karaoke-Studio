// Avi Karaoke Studio Web v1.143 — finish startup/update cleanly on iPhone
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const ver=document.querySelector('.version');
  if(ver)ver.textContent='Web v1.143';
  window.__hksHardUpdating138=false;
  const btn=[...document.querySelectorAll('button')].find(b=>/רענן\s*עדכון|עדכון\s*רענן|מעדכן\s*לגרסה/.test(String(b.textContent||'')));
  if(btn){btn.disabled=false;btn.textContent='רענן עדכון';}
  try{
    const u=new URL(location.href);
    if(u.searchParams.has('hksUpdate')||u.searchParams.has('_')){
      u.searchParams.delete('hksUpdate');u.searchParams.delete('_');
      history.replaceState(null,'',u.pathname+u.search+u.hash);
    }
  }catch(_){}
  try{setStatus('v1.143 מוכן — עלייה מהירה וללא לולאת עדכון.')}catch(_){}
  try{navigator.serviceWorker?.register?.('sw.js?v=143',{updateViaCache:'none'}).then(async r=>{try{await r.update?.()}catch(_){}}).catch(()=>{})}catch(_){}
})();
