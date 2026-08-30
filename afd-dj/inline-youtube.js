(()=>{
 const load=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
 (async()=>{try{await load('./inline-youtube-core-v43.js?v=51');await load('./mixer-polish-v43.js?v=51');await load('./layout-balance-v45.js?v=51');await load('./ui-library-v49.js?v=51')}catch(e){console.error('AFD DJ loader error',e)}})();
})();