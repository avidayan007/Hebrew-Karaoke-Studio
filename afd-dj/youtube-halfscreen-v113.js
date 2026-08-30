(()=>{
 const $=id=>document.getElementById(id);
 function ensureStyle(){if($('afdYTHalf113Style'))return;const s=document.createElement('style');s.id='afdYTHalf113Style';s.textContent=`
 body.afdYTHalf113 .view{height:50vh!important;min-height:360px!important;max-height:50vh!important}
 body.afdYTHalf113 #online{display:grid!important;grid-template-columns:1fr!important;height:100%!important;overflow:hidden!important;padding:8px!important}
 body.afdYTHalf113 #online>.card{display:none!important}
 body.afdYTHalf113 #online>.card:first-child{display:flex!important;height:100%!important;min-height:0!important}
 body.afdYTHalf113 #afdYTInlineResults{flex:1!important;min-height:0!important;max-height:none!important;overflow:auto!important}
 @media(max-width:900px){body.afdYTHalf113 .view{height:50dvh!important;max-height:50dvh!important;min-height:320px!important}}
 `;document.head.appendChild(s)}
 function openHalf(){ensureStyle();document.body.classList.add('afdYTHalf113')}
 function closeHalf(){document.body.classList.remove('afdYTHalf113')}
 function bind(){ensureStyle();const b=$('ytBtn'),i=$('ytSearch');if(b&&!b.dataset.afdHalf113){b.dataset.afdHalf113='1';b.addEventListener('click',openHalf,true)}if(i&&!i.dataset.afdHalf113){i.dataset.afdHalf113='1';i.addEventListener('keydown',e=>{if(e.key==='Enter')openHalf()},true)}document.querySelectorAll('.tabBtn').forEach(t=>{if(t.dataset.afdHalf113)return;t.dataset.afdHalf113='1';t.addEventListener('click',()=>{if(t.dataset.view!=='online')closeHalf()})})}
 window.AFDYouTubeHalfOpen=openHalf;window.AFDYouTubeHalfClose=closeHalf;bind();setInterval(bind,1500);
})();