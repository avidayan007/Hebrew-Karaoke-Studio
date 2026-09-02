(()=>{
function patch(){
  const f=document.getElementById('console');
  let d;try{d=f?.contentDocument}catch(e){return}
  if(!d)return;
  if(!d.getElementById('tracks')){
    const sink=d.createElement('div');
    sink.id='tracks';
    sink.style.display='none';
    (d.querySelector('.browser')||d.body).appendChild(sink);
  }
  d.querySelectorAll('#tracks .row').forEach(r=>r.remove());
}
window.__afdWin171={patch};
document.getElementById('console')?.addEventListener('load',()=>setTimeout(patch,200));
patch();setTimeout(patch,600);setInterval(patch,1500);
})();