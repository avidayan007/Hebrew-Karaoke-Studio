// Hebrew Karaoke Studio — v1.33 loader
import('./patch-v31.js?v=33')
  .then(()=>import('./patch-v32.js?v=33'))
  .then(()=>import('./patch-v33.js?v=33'))
  .catch(e=>{console.error('[v33]',e);try{setStatus('שגיאה בטעינת עדכון v1.33')}catch(_){} });
