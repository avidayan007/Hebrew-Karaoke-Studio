const CACHE='hks-v137';
const PATCHES=[31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137];
const ASSETS=['./','index.html','app.js?v=30','patch-v17.js?v=30','patch-v18.js?v=30','patch-v20.js?v=30','patch-v21.js?v=30','patch-v25.js?v=30','patch-v27.js?v=30','patch-v28.js?v=30','patch-v29.js?v=30','patch-v30.js?v=137',...PATCHES.map(n=>`patch-v${n}.js?v=137`),'manifest.webmanifest','433A5E98-4A3F-40B9-A6D0-91B22FF5B848.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('message',e=>{if(e.data?.type==='HKS_SW_VERSION'&&e.ports?.[0])e.ports[0].postMessage(CACHE)});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url),p=u.pathname;
  if(p.startsWith('/api/'))return;
  // Critical on iPhone: do not proxy FFmpeg through the app cache. The WASM core is ~32 MB.
  // Let Safari use its normal HTTP cache so a fresh worker can reuse the same core immediately.
  if(p.includes('/vendor/ffmpeg/'))return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{let copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(e.request.method==='GET'){let copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)));
});