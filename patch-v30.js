// Hebrew Karaoke Studio — v1.36 loader
import('./patch-v31.js?v=36')
  .then(()=>import('./patch-v32.js?v=36'))
  .then(()=>import('./patch-v33.js?v=36'))
  .then(()=>import('./patch-v34.js?v=36'))
  .then(()=>import('./patch-v35.js?v=36'))
  .then(()=>import('./patch-v36.js?v=36'))
  .catch(e=>{console.error('[v36]',e);try{setStatus('שגיאה בטעינת עדכון v1.36')}catch(_){} });
