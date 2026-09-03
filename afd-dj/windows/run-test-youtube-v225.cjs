const fs=require('fs');

(async()=>{
  const source=fs.readFileSync('test-youtube-v225.js','utf8');
  await eval('(async()=>{\n'+source+'\n})()');
})().catch(e=>{
  console.error(e);
  process.exit(1);
});
