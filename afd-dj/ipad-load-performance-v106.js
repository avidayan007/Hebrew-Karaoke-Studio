(()=>{
 const frame=()=>document.getElementById('console');
 const doc=()=>{try{return frame()?.contentDocument}catch(e){return null}};
 function bind(){const d=doc();if(!d)return;['A','B'].forEach(deck=>{const m=d.getElementById('vid'+deck);if(!m||m.dataset.afdPerf106)return;m.dataset.afdPerf106='1';m.setAttribute('preload','metadata');m.addEventListener('loadstart',()=>{m.dataset.afdLoading106='1'},{passive:true});m.addEventListener('loadedmetadata',()=>{delete m.dataset.afdLoading106},{passive:true});m.addEventListener('canplay',()=>{delete m.dataset.afdLoading106},{passive:true})})}
 function deferNonCritical(){const d=doc();if(!d)return;const playing=['A','B'].some(k=>{const m=d.getElementById('vid'+k);return m&&!m.paused&&!m.ended&&m.readyState>=2});document.documentElement.classList.toggle('afdDeckPlaying106',playing)}
 frame()?.addEventListener('load',()=>setTimeout(bind,100));setTimeout(bind,250);setTimeout(bind,900);setInterval(()=>{bind();deferNonCritical()},1200);
})();