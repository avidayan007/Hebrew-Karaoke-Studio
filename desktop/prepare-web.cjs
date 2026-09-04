const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const out=path.join(__dirname,'app');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const fixed=['index.html','app.js','manifest.webmanifest','sw.js','433A5E98-4A3F-40B9-A6D0-91B22FF5B848.png'];
for(const name of fixed){const src=path.join(root,name);if(!fs.existsSync(src))throw new Error('Missing required web asset: '+name);fs.copyFileSync(src,path.join(out,name));}
for(const name of fs.readdirSync(root))if(/^patch-v\d+\.js$/i.test(name))fs.copyFileSync(path.join(root,name),path.join(out,name));

// The Windows app must contain exactly the same patch chain used by the web/iPad/iPhone app.
const loader=fs.readFileSync(path.join(root,'patch-v30.js'),'utf8');
const m=loader.match(/const\s+patches\s*=\s*\[([^\]]+)\]/s);
if(!m)throw new Error('Could not read patch list from patch-v30.js');
const patches=m[1].split(',').map(x=>Number(x.trim())).filter(Number.isFinite);
const missing=[];
for(const n of patches){const name=`patch-v${n}.js`;if(!fs.existsSync(path.join(out,name)))missing.push(name);}
if(missing.length)throw new Error('Windows build is missing web features: '+missing.join(', '));
for(const early of [17,18,20,21,25,27,28,29,30]){const name=`patch-v${early}.js`;if(!fs.existsSync(path.join(root,name)))throw new Error('Missing base patch: '+name);fs.copyFileSync(path.join(root,name),path.join(out,name));}
console.log(`Desktop web assets prepared: ${patches.length} dynamic patches + base patches. Full web parity verified.`);
