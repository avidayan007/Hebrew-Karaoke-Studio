const fs=require('fs');
const path=require('path');

let src=fs.readFileSync(path.join(__dirname,'main-v200.js'),'utf8');
function rewrite(from,to,label){
  if(!src.includes(from))throw new Error('AFD full v203 patch marker missing: '+label);
  src=src.replace(from,to);
}
rewrite(
  "RUNTIME_STABLE_JS=readRuntime('runtime-v201.js'),SPOTIFY_PLAYBACK_LOCAL_JS=",
  "RUNTIME_STABLE_JS=readRuntime('runtime-v201.js'),RUNTIME_FULL_JS=readRuntime('runtime-v203.js'),SPOTIFY_PLAYBACK_LOCAL_JS=",
  'full runtime constant'
);
rewrite(
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_STABLE_JS])await w.webContents.executeJavaScript(js,true)',
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_STABLE_JS,RUNTIME_FULL_JS])await w.webContents.executeJavaScript(js,true)',
  'full runtime injection'
);
rewrite(
  "w.loadURL('https://afd-dj.vercel.app/workstation.html?v=201&t='+Date.now());",
  "w.loadURL('https://afd-dj.vercel.app/workstation.html?v=203&t='+Date.now());",
  'shell cache version'
);
rewrite(
  "new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);",
  "patch(\"title:'AFD DJ'\",\"title:'AFD DJ 1.5.4 FULL'\",'window title');new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);",
  'window title patch'
);

new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);
