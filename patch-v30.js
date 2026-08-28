// Hebrew Karaoke Studio — v1.42 loader
import('./patch-v31.js?v=42')
  .then(()=>import('./patch-v32.js?v=42'))
  .then(()=>import('./patch-v33.js?v=42'))
  .then(()=>import('./patch-v34.js?v=42'))
  .then(()=>import('./patch-v35.js?v=42'))
  .then(()=>import('./patch-v36.js?v=42'))
  .then(()=>import('./patch-v37.js?v=42'))
  .then(()=>import('./patch-v38.js?v=42'))
  .then(()=>import('./patch-v39.js?v=42'))
  .then(()=>import('./patch-v40.js?v=42'))
  .then(()=>import('./patch-v41.js?v=42'))
  .then(()=>import('./patch-v42.js?v=42'))
  .catch(e=>{console.error('[v42]',e);try{setStatus('שגיאה בטעינת עדכון v1.42')}catch(_){} });
