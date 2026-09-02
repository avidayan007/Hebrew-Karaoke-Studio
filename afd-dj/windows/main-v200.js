const fs=require('fs');
const path=require('path');

let src=fs.readFileSync(path.join(__dirname,'main-v184.js'),'utf8');
function patch(from,to,label){
  if(!src.includes(from))throw new Error('AFD v200 patch marker missing: '+label);
  src=src.replace(from,to);
}

patch(
  "const RUNTIME_BASE_JS=readRuntime('runtime-v167.js'),RUNTIME_FIX_JS=readRuntime('runtime-v168.js'),RUNTIME_PERSIST_JS=readRuntime('runtime-v169.js'),RUNTIME_LIBRARY_JS=readRuntime('runtime-v170.js'),RUNTIME_LIBRARY_FIX_JS=readRuntime('runtime-v171.js'),RUNTIME_TEXT_SCROLL_JS=readRuntime('runtime-v172.js'),RUNTIME_KEY_JS=readRuntime('runtime-v184.js'),RUNTIME_MEDIA_PLAYLIST_JS=readRuntime('runtime-v177.js'),RUNTIME_LOAD_JS=readRuntime('runtime-v185.js'),RUNTIME_EJECT_JS=readRuntime('runtime-v175.js');",
  "const RUNTIME_BASE_JS=readRuntime('runtime-v167.js'),RUNTIME_FIX_JS=readRuntime('runtime-v168.js'),RUNTIME_PERSIST_JS=readRuntime('runtime-v169.js'),RUNTIME_LIBRARY_JS=readRuntime('runtime-v170.js'),RUNTIME_LIBRARY_FIX_JS=readRuntime('runtime-v171.js'),RUNTIME_TEXT_SCROLL_JS=readRuntime('runtime-v172.js'),RUNTIME_KEY_JS=readRuntime('runtime-v184.js'),RUNTIME_MEDIA_PLAYLIST_JS=readRuntime('runtime-v177.js'),RUNTIME_LOAD_JS=readRuntime('runtime-v185.js'),RUNTIME_EJECT_JS=readRuntime('runtime-v175.js'),RUNTIME_UNIFIED_JS=readRuntime('runtime-v194.js'),RUNTIME_CORE_JS=readRuntime('runtime-v195.js'),RUNTIME_SPOTIFY_JS=readRuntime('runtime-v196.js'),RUNTIME_GUARD_JS=readRuntime('runtime-v200.js');",
  'runtime constants'
);

patch(
  "for(const js of [RUNTIME_BASE_JS,RUNTIME_FIX_JS,RUNTIME_PERSIST_JS,RUNTIME_LIBRARY_JS,RUNTIME_LIBRARY_FIX_JS,RUNTIME_TEXT_SCROLL_JS,RUNTIME_KEY_JS,RUNTIME_MEDIA_PLAYLIST_JS,RUNTIME_LOAD_JS,RUNTIME_EJECT_JS])await w.webContents.executeJavaScript(js,true)",
  "for(const js of [RUNTIME_BASE_JS,RUNTIME_FIX_JS,RUNTIME_PERSIST_JS,RUNTIME_LIBRARY_JS,RUNTIME_LIBRARY_FIX_JS,RUNTIME_TEXT_SCROLL_JS,RUNTIME_KEY_JS,RUNTIME_MEDIA_PLAYLIST_JS,RUNTIME_LOAD_JS,RUNTIME_EJECT_JS,RUNTIME_UNIFIED_JS,RUNTIME_CORE_JS,RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS])await w.webContents.executeJavaScript(js,true)",
  'inject order'
);

patch(
  "w.loadURL('https://afd-dj.vercel.app/workstation.html?v=186&t='+Date.now());",
  "w.loadURL('https://afd-dj.vercel.app/workstation.html?v=200&t='+Date.now());",
  'shell cache version'
);

patch(
  "await session.defaultSession.clearCache().catch(()=>{});",
  "session.defaultSession.webRequest.onBeforeRequest({urls:['https://api.spotify.com/v1/search*']},(details,cb)=>{try{const u=new URL(details.url);if(u.searchParams.has('limit')){const n=Number(u.searchParams.get('limit'));if(!Number.isFinite(n)||n<1||n>10)u.searchParams.delete('limit');else u.searchParams.set('limit',String(Math.min(10,Math.max(1,Math.floor(n)))));const safe=u.toString();if(safe!==details.url){console.log('[AFD Spotify firewall]',details.url,'=>',safe);return cb({redirectURL:safe})}}}catch(e){console.warn('[AFD Spotify firewall]',e)}cb({})});await session.defaultSession.clearCache().catch(()=>{});",
  'Spotify request firewall'
);

new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);
