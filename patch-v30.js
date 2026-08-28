// Hebrew Karaoke Studio — v1.35 loader
import('./patch-v31.js?v=35')
  .then(()=>import('./patch-v32.js?v=35'))
  .then(()=>import('./patch-v33.js?v=35'))
  .then(()=>import('./patch-v34.js?v=35'))
  .then(()=>import('./patch-v35.js?v=35'))
  .catch(e=>{console.error('[v35]',e);try{setStatus('שגיאה בטעינת עדכון v1.35')}catch(_){} });
