(()=>{
 const load=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
 (async()=>{try{await load('./inline-youtube-core-v43.js?v=58');await load('./mixer-polish-v43.js?v=58');await load('./layout-balance-v45.js?v=58');await load('./ui-library-v49.js?v=58');await load('./library-automix-v52.js?v=58');await load('./controls-v54.js?v=58');await load('./native-folder-web-v55.js?v=58')}catch(e){console.error('AFD DJ loader error',e)}})();
})();