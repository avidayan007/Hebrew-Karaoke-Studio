const fs=require('fs');
const path=require('path');

let src=fs.readFileSync(path.join(__dirname,'main-v203.js'),'utf8');
function rewrite(from,to,label){
  if(!src.includes(from))throw new Error('AFD v205 patch marker missing: '+label);
  src=src.replace(from,to);
}
rewrite(
  "RUNTIME_STABLE_JS=readRuntime('runtime-v201.js'),RUNTIME_FULL_JS=readRuntime('runtime-v203.js'),SPOTIFY_PLAYBACK_LOCAL_JS=",
  "RUNTIME_STABLE_JS=readRuntime('runtime-v201.js'),RUNTIME_FULL_JS=readRuntime('runtime-v203.js'),RUNTIME_CONTROLLER_JS=readRuntime('runtime-v205.js'),SPOTIFY_PLAYBACK_LOCAL_JS=",
  'controller runtime constant'
);
rewrite(
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_STABLE_JS,RUNTIME_FULL_JS])await w.webContents.executeJavaScript(js,true)',
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_FULL_JS,RUNTIME_CONTROLLER_JS])await w.webContents.executeJavaScript(js,true)',
  'single controller injection'
);
rewrite(
  "w.loadURL('https://afd-dj.vercel.app/workstation.html?v=203&t='+Date.now());",
  "w.loadURL('https://afd-dj.vercel.app/workstation.html?v=205&t='+Date.now());",
  'shell cache version'
);
rewrite(
  "title:'AFD DJ 1.5.4 FULL'",
  "title:'AFD DJ 1.5.5 STABLE'",
  'window title'
);

new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);
