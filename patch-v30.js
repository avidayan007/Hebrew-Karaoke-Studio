// Hebrew Karaoke Studio — v1.34 loader
import('./patch-v31.js?v=34')
  .then(()=>import('./patch-v32.js?v=34'))
  .then(()=>import('./patch-v33.js?v=34'))
  .then(()=>import('./patch-v34.js?v=34'))
  .catch(e=>{console.error('[v34]',e);try{setStatus('שגיאה בטעינת עדכון v1.34')}catch(_){} });
