// Avi Karaoke Studio Web v1.145 — iPhone responsiveness + paint finalizer
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  window.__hksPerfFix145=true;
  window.__hksHardUpdating138=false;

  // Safari/iPhone: never scale the root document with CSS zoom. Historical
  // desktop patches used body zoom/width and can leave large white paint gaps.
  document.body.style.removeProperty('zoom');
  document.body.style.removeProperty('width');
  document.body.style.removeProperty('max-width');
  document.documentElement.style.removeProperty('overflow-x');
  const studio=document.getElementById('studio');
  if(studio){studio.style.removeProperty('width');studio.style.removeProperty('max-width')}

  // Keep a real dark color under the gradient so a Safari compositor repaint
  // can never expose the browser's default white page between layers.
  let paintStyle=document.getElementById('hksIOSPaint145');
  if(!paintStyle){
    paintStyle=document.createElement('style');paintStyle.id='hksIOSPaint145';
    paintStyle.textContent='html,body{background-color:#0b0a0e!important;min-height:100%!important}body{min-width:100%!important}';
    document.head.appendChild(paintStyle);
  }

  const ver=document.querySelector('.version');
  if(ver)ver.textContent='Web v1.145';
  const btn=[...document.querySelectorAll('button')].find(b=>/רענן\s*עדכון|עדכון\s*רענן|מעדכן\s*לגרסה|בודק\s*עדכון/.test(String(b.textContent||'')));
  if(btn){btn.disabled=false;if(btn.textContent!=='רענן עדכון')btn.textContent='רענן עדכון'}
  try{
    const u=new URL(location.href);
    if(u.searchParams.has('hksUpdate')||u.searchParams.has('_')){
      u.searchParams.delete('hksUpdate');u.searchParams.delete('_');
      history.replaceState(null,'',u.pathname+u.search+u.hash);
    }
  }catch(_){}
  try{setStatus('v1.145 מוכן — זום גוף הדף ולולאות ה-DOM ב-iPhone בוטלו.')}catch(_){}
  try{navigator.serviceWorker?.register?.('sw.js?v=145',{updateViaCache:'none'}).then(async r=>{try{await r.update?.()}catch(_){}}).catch(()=>{})}catch(_){}
})();
