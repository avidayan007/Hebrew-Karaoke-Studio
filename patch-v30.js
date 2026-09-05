// Avi Karaoke Studio — v1.145 responsive resilient loader
(async()=>{
  const started=performance.now();
  window.__hksLoaderVersion=145;
  window.__hksLoaderFailedPatches=[];
  const patches=[31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const yieldUI=()=>new Promise(r=>requestAnimationFrame(()=>r()));
  const ver=document.querySelector('.version');
  if(ver)ver.textContent='Web v1.145 — טוען…';

  async function loadPatch(n){
    let lastErr=null;
    for(let attempt=1;attempt<=3;attempt++){
      try{
        const suffix=attempt===1?'':`&retry=${attempt}`;
        await import(`./patch-v${n}.js?v=145${suffix}`);
        return true;
      }catch(e){
        lastErr=e;
        console.warn(`[v145 loader] patch ${n} attempt ${attempt} failed`,e);
        await sleep(120*attempt);
      }
    }
    window.__hksLoaderFailedPatches.push(n);
    console.error(`[v145 loader] patch ${n} failed after retries`,lastErr);
    return false;
  }

  for(let i=0;i<patches.length;i++){
    await loadPatch(patches[i]);
    if(ver && (i%12===0 || i===patches.length-1)) ver.textContent=`Web v1.145 — ${Math.round((i+1)/patches.length*100)}%`;
    // Let Safari paint and handle taps instead of monopolizing the main thread.
    if((i+1)%6===0)await yieldUI();
  }

  window.__hksStartupMs145=Math.round(performance.now()-started);
  const failed=window.__hksLoaderFailedPatches;
  if(failed.length){
    if(ver)ver.textContent=`Web v1.145 (${failed.length} קבצים חסרים)`;
    try{setStatus(`עדכון v1.145 נטען חלקית: ${failed.join(', ')}`)}catch(_){}
  }else{
    if(ver)ver.textContent='Web v1.145';
    try{setStatus(`v1.145 מוכן — עלה ב-${(window.__hksStartupMs145/1000).toFixed(1)} שניות.`)}catch(_){}
  }
})();