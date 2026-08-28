// Hebrew Karaoke Studio — v1.37 loader
import('./patch-v31.js?v=37')
  .then(()=>import('./patch-v32.js?v=37'))
  .then(()=>import('./patch-v33.js?v=37'))
  .then(()=>import('./patch-v34.js?v=37'))
  .then(()=>import('./patch-v35.js?v=37'))
  .then(()=>import('./patch-v36.js?v=37'))
  .then(()=>import('./patch-v37.js?v=37'))
  .catch(e=>{console.error('[v37]',e);try{setStatus('שגיאה בטעינת עדכון v1.37')}catch(_){} });
