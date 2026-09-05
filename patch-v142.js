// Avi Karaoke Studio Web v1.142 — fast iPhone startup/cache layer
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const ver=document.querySelector('.version');
  if(ver)ver.textContent='Web v1.142';
  try{setStatus('v1.142 מוכן — טעינת פתיחה מואצת לאייפון.')}catch(_){}
  try{navigator.serviceWorker?.register?.('sw.js?v=142',{updateViaCache:'none'}).then(async r=>{try{await r.update?.()}catch(_){}}).catch(()=>{})}catch(_){}
})();
