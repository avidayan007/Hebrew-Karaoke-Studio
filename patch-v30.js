// Avi Karaoke Studio — v1.141 resilient loader
(async()=>{
  window.__hksLoaderVersion=141;
  window.__hksLoaderFailedPatches=[];
  const patches=[31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function loadPatch(n){
    let lastErr=null;
    for(let attempt=1;attempt<=3;attempt++){
      try{
        await import(`./patch-v${n}.js?v=141&r=${attempt}`);
        return true;
      }catch(e){
        lastErr=e;
        console.warn(`[v141 loader] patch ${n} attempt ${attempt} failed`,e);
        await sleep(250*attempt);
      }
    }
    window.__hksLoaderFailedPatches.push(n);
    console.error(`[v141 loader] patch ${n} failed after retries`,lastErr);
    return false;
  }
  for(const n of patches) await loadPatch(n);
  const failed=window.__hksLoaderFailedPatches;
  const ver=document.querySelector('.version');
  if(failed.length){
    if(ver)ver.textContent=`Web v1.141 (${failed.length} קבצים חסרים)`;
    try{setStatus(`עדכון v1.141 נטען חלקית. מנסה להשלים אוטומטית: ${failed.join(', ')}`)}catch(_){}
  }else{
    if(ver)ver.textContent='Web v1.141';
    try{if(/Importing a module script failed|שגיאה בטעינת עדכון/i.test(document.querySelector('#status')?.textContent||''))setStatus('v1.141 נטען בהצלחה — מנגנון העדכון יציב.')}catch(_){}
  }
})();