// Avi Karaoke Studio — v1.93 loader
(async()=>{
  const patches=[31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93];
  try{
    for(const n of patches) await import(`./patch-v${n}.js?v=93`);
  }catch(e){
    console.error('[v93]',e);
    try{setStatus('שגיאה בטעינת עדכון v1.93')}catch(_){}
  }
})();