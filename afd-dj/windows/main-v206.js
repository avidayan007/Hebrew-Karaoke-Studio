const fs=require('fs');
const path=require('path');

let src=fs.readFileSync(path.join(__dirname,'main-v205.js'),'utf8');
function rewrite(from,to,label){
  if(!src.includes(from))throw new Error('AFD v206 patch marker missing: '+label);
  src=src.replace(from,to);
}
rewrite(
  "RUNTIME_CONTROLLER_JS=readRuntime('runtime-v205.js')",
  "RUNTIME_CONTROLLER_JS=readRuntime('runtime-v206.js')",
  'controller runtime'
);
rewrite(
  "workstation.html?v=205&t=",
  "workstation.html?v=206&t=",
  'shell cache version'
);
rewrite(
  "title:'AFD DJ 1.5.5 STABLE'",
  "title:'AFD DJ 1.5.6 FIXED'",
  'window title'
);

new Function('require','__dirname','__filename','process','Buffer',src)(require,__dirname,__filename,process,Buffer);
