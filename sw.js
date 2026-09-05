const CACHE='hks-v143';
const CORE=['./','index.html','app.js?v=30','patch-v17.js?v=30','patch-v18.js?v=30','patch-v20.js?v=30','patch-v21.js?v=30','patch-v25.js?v=30','patch-v27.js?v=30','patch-v28.js?v=30','patch-v29.js?v=30','patch-v30.js?v=143','patch-v138.js?v=143','patch-v139.js?v=143','patch-v140.js?v=143','patch-v141.js?v=143','patch-v142.js?v=143','patch-v143.js?v=143','manifest.webmanifest','433A5E98-4A3F-40B9-A6D0-91B22FF5B848.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.allSettled(CORE.map(async a=>{try{const r=await fetch(a,{cache:'reload'});if(r&&r.ok)await c.put(a,r.clone())}catch(_){}}))})())});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('message',e=>{if(e.data?.type==='HKS_SW_VERSION'&&e.ports?.[0])e.ports[0].postMessage(CACHE)});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url),p=u.pathname;
  if(p.startsWith('/api/'))return;
  if(p.includes('/vendor/ffmpeg/'))return;
  const isPatch=/\/patch-v\d+\.js$/.test(p);
  if(isPatch){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE);
      const hit=await c.match(e.request,{ignoreSearch:true});
      if(hit)return hit;
      try{const r=await fetch(e.request,{cache:'force-cache'});if(r&&r.ok)await c.put(e.request,r.clone());return r}catch(err){const stale=await caches.match(e.request,{ignoreSearch:true});if(stale)return stale;throw err}
    })());return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(e.request.method==='GET'){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});