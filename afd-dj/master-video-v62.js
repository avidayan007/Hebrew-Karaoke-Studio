(()=>{
 const frame=()=>document.getElementById('console');
 function fix(){
  let d;try{d=frame()?.contentDocument}catch(e){return}if(!d)return;
  const cross=d.getElementById('cross'),a=d.getElementById('masterA'),b=d.getElementById('masterB');
  if(!cross||!a||!b)return;
  const apply=()=>{const x=Math.max(0,Math.min(1,(+cross.value||0)/100));b.style.setProperty('opacity',String(1-x),'important');a.style.setProperty('opacity',String(x),'important')};
  a.style.setProperty('transition','opacity 60ms linear','important');b.style.setProperty('transition','opacity 60ms linear','important');
  if(!cross.dataset.afdMaster91){cross.dataset.afdMaster91='1';cross.addEventListener('input',()=>requestAnimationFrame(apply));cross.addEventListener('change',apply)}
  apply();
 }
 frame()?.addEventListener('load',()=>{setTimeout(fix,250);setTimeout(fix,900)});setTimeout(fix,500);setTimeout(fix,1400);
})();