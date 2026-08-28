// Hebrew Karaoke Studio — v1.40 loader
import('./patch-v31.js?v=40')
  .then(()=>import('./patch-v32.js?v=40'))
  .then(()=>import('./patch-v33.js?v=40'))
  .then(()=>import('./patch-v34.js?v=40'))
  .then(()=>import('./patch-v35.js?v=40'))
  .then(()=>import('./patch-v36.js?v=40'))
  .then(()=>import('./patch-v37.js?v=40'))
  .then(()=>import('./patch-v38.js?v=40'))
  .then(()=>import('./patch-v39.js?v=40'))
  .then(()=>import('./patch-v40.js?v=40'))
  .catch(e=>{console.error('[v40]',e);try{setStatus('שגיאה בטעינת עדכון v1.40')}catch(_){} });
