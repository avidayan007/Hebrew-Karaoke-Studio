(()=>{
 const $=id=>document.getElementById(id);
 const showOnline=()=>{try{if(typeof window.viewsShow==='function')window.viewsShow('online');else document.querySelector('.tabBtn[data-view="online"]')?.click()}catch(e){}};
 function killEmbed(){try{document.querySelectorAll('script[data-afd-sp-embed],script[src*="open.spotify.com/embed/iframe-api"]').forEach(s=>s.remove());delete window.onSpotifyIframeApiReady;delete window.SpotifyIframeApi;const d=$('console')?.contentDocument;if(d){d.querySelectorAll('[id^="afdSPDeck"]').forEach(x=>x.remove())}}catch(e){}}
 function bind(){const inp=$('spSearch'),btn=$('spBtn');if(!inp||!btn)return;killEmbed();
  if(!btn.dataset.afd83){btn.dataset.afd83='1';btn.addEventListener('click',e=>{showOnline();sessionStorage.setItem('afdSPKeepOnline','1');sessionStorage.setItem('afdSPPendingQuery',inp.value.trim());setTimeout(showOnline,0);setTimeout(showOnline,100);setTimeout(showOnline,500)},true)}
  if(!inp.dataset.afd83){inp.dataset.afd83='1';inp.addEventListener('keydown',e=>{if(e.key==='Enter'||e.keyCode===13){e.preventDefault();e.stopPropagation();sessionStorage.setItem('afdSPKeepOnline','1');sessionStorage.setItem('afdSPPendingQuery',inp.value.trim());showOnline();btn.click();setTimeout(showOnline,0);setTimeout(showOnline,150)}},true)}
 }
 if(sessionStorage.getItem('afdSPKeepOnline')){showOnline();setTimeout(showOnline,100);setTimeout(showOnline,700)}
 setTimeout(bind,50);setTimeout(bind,500);setInterval(bind,1500);
})();