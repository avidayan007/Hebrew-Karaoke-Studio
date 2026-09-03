const fs=require('fs');
const path=require('path');

let src=fs.readFileSync(path.join(__dirname,'main-v207.js'),'utf8');
function rewrite(from,to,label){
  if(!src.includes(from))throw new Error('AFD v209 patch marker missing: '+label);
  src=src.replace(from,to);
}
rewrite(
  "RUNTIME_POST_JS=readRuntime('runtime-v207.js').replace(/__AFD_VERSION__/g,JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version)",
  "RUNTIME_POST_JS=readRuntime('runtime-v207.js').replace(/__AFD_VERSION__/g,JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version),RUNTIME_UI208_JS=readRuntime('runtime-v208.js').replace(/__AFD_VERSION__/g,JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version)",
  'unified UI runtime constant'
);
rewrite(
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_FULL_JS,RUNTIME_CONTROLLER_JS,RUNTIME_POST_JS])await w.webContents.executeJavaScript(js,true)',
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_FULL_JS,RUNTIME_CONTROLLER_JS,RUNTIME_POST_JS,RUNTIME_UI208_JS])await w.webContents.executeJavaScript(js,true)',
  'unified UI runtime injection'
);
rewrite(
  'workstation.html?v=207&t=',
  'workstation.html?v=209&t=',
  'shell cache version'
);
rewrite(
  "title:'AFD DJ 1.5.7 RECOVERY'",
  "title:'AFD DJ 1.5.9 UNIFIED FIX'",
  'window title'
);

new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);
