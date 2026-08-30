(()=>{
  const load=(src)=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
  (async()=>{
    try{
      await load('./inline-youtube-core-v43.js?v=47');
      await load('./mixer-polish-v43.js?v=47');
      await load('./layout-balance-v45.js?v=47');
    }catch(e){console.error('AFD DJ loader error',e)}
  })();
})();