const fs=require('fs');
const path=require('path');

let src=fs.readFileSync(path.join(__dirname,'main-v205.js'),'utf8');
function rewrite(from,to,label){
  if(!src.includes(from))throw new Error('AFD v207 patch marker missing: '+label);
  src=src.replace(from,to);
}
rewrite(
  "RUNTIME_CONTROLLER_JS=readRuntime('runtime-v205.js')",
  "RUNTIME_CONTROLLER_JS=readRuntime('runtime-v206.js'),RUNTIME_POST_JS=readRuntime('runtime-v207.js').replace(/__AFD_VERSION__/g,JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'),'utf8')).version)",
  'controller and recovery runtimes'
);
rewrite(
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_FULL_JS,RUNTIME_CONTROLLER_JS])await w.webContents.executeJavaScript(js,true)',
  'RUNTIME_SPOTIFY_JS,RUNTIME_GUARD_JS,RUNTIME_FULL_JS,RUNTIME_CONTROLLER_JS,RUNTIME_POST_JS])await w.webContents.executeJavaScript(js,true)',
  'recovery injection'
);
rewrite(
  "workstation.html?v=205&t=",
  "workstation.html?v=207&t=",
  'shell cache version'
);
rewrite(
  "title:'AFD DJ 1.5.5 STABLE'",
  "title:'AFD DJ 1.5.7 RECOVERY'",
  'window title'
);

new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);
