// Avi Karaoke Studio — v1.143 fast resilient loader
(async()=>{
  const started=performance.now();
  window.__hksLoaderVersion=143;
  window.__hksLoaderFailedPatches=[];
  const patches=[31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const ver=document.querySelector('.version');
  if(ver)ver.textContent='Web v1.143 — טוען…';

  // Preload only the patches ahead of the current execution point, and do it in
  // the background. Do not block startup waiting for the whole patch history.
  const warmUrls=patches.slice(6).map(n=>`./patch-v${n}.js?v=143`);
  let nextWarm=0;
  async function warmer(){
    while(nextWarm<warmUrls.length){
      const i=nextWarm++;
      try{await fetch(warmUrls[i],{cache:'force-cache'})}catch(_){}
    }
  }
  Promise.all(Array.from({length:6},warmer)).catch(()=>{});

  async function loadPatch(n){
    let lastErr=null;
    for(let attempt=1;attempt<=3;attempt++){
      try{
        const suffix=attempt===1?'':`&retry=${attempt}`;
        await import(`./patch-v${n}.js?v=143${suffix}`);
        return true;
      }catch(e){
        lastErr=e;
        console.warn(`[v143 loader] patch ${n} attempt ${attempt} failed`,e);
        await sleep(150*attempt);
      }
    }
    window.__hksLoaderFailedPatches.push(n);
    console.error(`[v143 loader] patch ${n} failed after retries`,lastErr);
    return false;
  }

  for(let i=0;i<patches.length;i++){
    await loadPatch(patches[i]);
    if(ver && (i%12===0 || i===patches.length-1)) ver.textContent=`Web v1.143 — ${Math.round((i+1)/patches.length*100)}%`;
  }

  window.__hksStartupMs143=Math.round(performance.now()-started);
  const failed=window.__hksLoaderFailedPatches;
  if(failed.length){
    if(ver)ver.textContent=`Web v1.143 (${failed.length} קבצים חסרים)`;
    try{setStatus(`עדכון v1.143 נטען חלקית: ${failed.join(', ')}`)}catch(_){}
  }else{
    if(ver)ver.textContent='Web v1.143';
    try{setStatus(`v1.143 מוכן — עלה ב-${(window.__hksStartupMs143/1000).toFixed(1)} שניות.`)}catch(_){}
  }
})();