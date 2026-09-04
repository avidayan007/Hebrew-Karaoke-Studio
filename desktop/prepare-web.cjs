const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const out=path.join(__dirname,'app');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const fixed=['index.html','app.js','manifest.webmanifest','sw.js','433A5E98-4A3F-40B9-A6D0-91B22FF5B848.png'];
for(const name of fixed){const src=path.join(root,name);if(fs.existsSync(src))fs.copyFileSync(src,path.join(out,name));}
for(const name of fs.readdirSync(root)){
  if(/^patch-v\d+\.js$/i.test(name))fs.copyFileSync(path.join(root,name),path.join(out,name));
}
console.log('Desktop web assets prepared in',out);
