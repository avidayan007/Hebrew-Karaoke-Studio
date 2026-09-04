// Avi Karaoke Studio — v1.128 loader (v1.116 layout + restore sync + stable resync + lightweight drag + final playback + external/export match + deep zoom + title match + render size estimate + waveform playback follow)
(async()=>{
  const patches=[31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,119,120,121,122,123,124,125,126,127,128];
  try{
    for(const n of patches) await import(`./patch-v${n}.js?v=128`);
  }catch(e){
    console.error('[v128]',e);
    try{setStatus('שגיאה בטעינת עדכון v1.128')}catch(_){}
  }
})();