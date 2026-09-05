// Avi Karaoke Studio Web v1.141 — resilient iPhone update/bootstrap layer
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;

  window.__hksLoadedPatches141=window.__hksLoadedPatches141||[];
  window.__hksLoadedPatches141.push(141);

  const ver=document.querySelector('.version');
  const failed=Array.isArray(window.__hksLoaderFailedPatches)?window.__hksLoaderFailedPatches:[];
  if(ver)ver.textContent=failed.length?`Web v1.141 (${failed.length} קבצים בטעינה חוזרת)`:'Web v1.141';

  const status=document.querySelector('#status');
  if(status&&!failed.length&&/Importing a module script failed|שגיאה בטעינת עדכון/i.test(status.textContent||'')){
    status.textContent='v1.141 נטען — מנגנון העדכון תוקן ומוכן.';
  }

  try{
    navigator.serviceWorker?.register?.('sw.js?v=141',{updateViaCache:'none'}).then(async r=>{
      try{await r.update?.()}catch(_){}
    }).catch(()=>{});
  }catch(_){}
})();
