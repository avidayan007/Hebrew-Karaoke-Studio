const CACHE='afd-dj-offline-v135';
const CORE=['./','./index.html','./workstation.html','./ultra.html','./manifest.webmanifest','./inline-youtube.js','./offline-v121.js','./edit-control-v72.js','./inline-youtube-core-v43.js','./mixer-polish-v43.js','./ui-library-v49.js','./library-automix-v52.js','./controls-v54.js','./native-folder-web-v55.js','./library-view-v59.js','./master-video-v62.js','./master-sync-v70.js','./floating-master-v75.js','./apple-deck-controls-v78.js','./apple-music-v77.js','./spotify-inline-v79.js','./spotify-playback-v82.js','./spotify-workspace-v85.js','./spotify-playlists-v101.js','./spotify-playlist-workspace-v102.js','./ipad-load-performance-v106.js','./stability-v108.js','./deck-transport-v109.js','./online-drag-v111.js','./youtube-halfscreen-v113.js','./youtube-view-v114.js','./youtube-drag-master-v116.js','./session-memory-v117.js','./deck-replace-guard-v123.js','./deck-bpm-sync-video-v126.js','./deck-independent-v127.js','./dual-deck-master-v129.js','./deck-bpm-display-v130.js','./deck-eq-volume-layout-v131.js','./deck-compact-mixer-v132.js','./deck-one-row-v133.js','./deck-control-row-v134.js','./layout-master-automix-v135.js'];
async function precache(){const c=await caches.open(CACHE);await Promise.allSettled(CORE.map(async p=>{try{const r=await fetch(p,{cache:'reload'});if(r.ok)await c.put(p,r.clone())}catch(e){}}))}
self.addEventListener('install',e=>e.waitUntil(precache().then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('afd-dj-offline-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function cached(path){return await caches.match(path,{ignoreSearch:true})}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 e.respondWith((async()=>{
  try{const r=await fetch(e.request,{cache:'no-store'});if(r&&r.ok){const c=await caches.open(CACHE);c.put(e.request,r.clone()).catch(()=>{});return r}}
  catch(err){}
  let hit=await caches.match(e.request,{ignoreSearch:true});if(hit)return hit;
  if(u.pathname.endsWith('/ultra.html')){hit=await cached('./ultra.html');if(hit)return hit}
  if(e.request.mode==='navigate'){hit=await cached('./workstation.html')||await cached('./index.html');if(hit)return hit}
  return new Response('Offline resource unavailable',{status:503,statusText:'Offline'});
 })())
});