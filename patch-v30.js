// Hebrew Karaoke Studio — v1.32 loader
import('./patch-v31.js?v=32')
  .then(()=>import('./patch-v32.js?v=32'))
  .catch(e=>{console.error('[v32]',e);try{setStatus('שגיאה בטעינת שמירת/ייצוא v1.32')}catch(_){} });
