// Avi Karaoke Studio Web v1.105 — refresh/update without closing app
(function(){
  if(document.getElementById('hksRefresh105'))return;
  const btn=document.createElement('button');
  btn.id='hksRefresh105';btn.type='button';btn.textContent='↻ רענן עדכון';btn.title='טען את הגרסה החדשה ביותר בלי לסגור את האפליקציה';
  async function refresh(){
    btn.disabled=true;btn.textContent='↻ מעדכן...';
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(async r=>{try{await r.update()}catch(_){}}));
      }
      if('caches' in window){
        const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));
      }
    }catch(e){console.warn('[v105 refresh]',e)}
    const u=new URL(location.href);u.searchParams.set('_refresh',Date.now());location.replace(u.toString());
  }
  btn.onclick=refresh;
  const brand=document.getElementById('hksAfdBrand88');
  const header=brand?.parentElement||document.querySelector('header')||document.body;
  header.appendChild(btn);
  const s=document.createElement('style');s.textContent='#hksRefresh105{margin-inline-start:10px;padding:7px 12px;border:1px solid #d6a43a;border-radius:9px;background:linear-gradient(180deg,#d99a20,#845006);color:#fff8df;font-weight:900;cursor:pointer;white-space:nowrap}#hksRefresh105:disabled{opacity:.65;cursor:wait}';document.head.appendChild(s);
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.105';
})();