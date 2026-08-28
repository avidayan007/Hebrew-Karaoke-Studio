// Hebrew Karaoke Studio — v1.38 loader
import('./patch-v31.js?v=38')
  .then(()=>import('./patch-v32.js?v=38'))
  .then(()=>import('./patch-v33.js?v=38'))
  .then(()=>import('./patch-v34.js?v=38'))
  .then(()=>import('./patch-v35.js?v=38'))
  .then(()=>import('./patch-v36.js?v=38'))
  .then(()=>import('./patch-v37.js?v=38'))
  .then(()=>import('./patch-v38.js?v=38'))
  .catch(e=>{console.error('[v38]',e);try{setStatus('שגיאה בטעינת עדכון v1.38')}catch(_){} });
