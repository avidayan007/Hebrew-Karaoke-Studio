(()=>{
 const frame=()=>document.getElementById('console');
 function fix(){
  let d;try{d=frame()?.contentDocument}catch(e){return}if(!d)return;
  const cross=d.getElementById('cross'),a=d.getElementById('masterA'),b=d.getElementById('masterB');
  if(!cross||!a||!b)return;
  let st=d.getElementById('afdMasterSquare125');if(!st){st=d.createElement('style');st.id='afdMasterSquare125';d.head.appendChild(st)}
  st.textContent=`.masterScreen{width:min(100%,440px)!important;aspect-ratio:1/1!important;height:auto!important;min-height:0!important;margin-left:auto!important;margin-right:auto!important;background:#000!important;overflow:hidden!important}.masterScreen video,.masterScreen iframe,#masterA,#masterB{width:100%!important;height:100%!important;object-fit:contain!important;background:#000!important}`;
  const apply=()=>{const x=Math.max(0,Math.min(1,(+cross.value||0)/100));b.style.setProperty('opacity',String(1-x),'important');a.style.setProperty('opacity',String(x),'important')};
  a.style.setProperty('transition','opacity 60ms linear','important');b.style.setProperty('transition','opacity 60ms linear','important');
  a.style.setProperty('object-fit','contain','important');b.style.setProperty('object-fit','contain','important');
  if(!cross.dataset.afdMaster91){cross.dataset.afdMaster91='1';cross.addEventListener('input',()=>requestAnimationFrame(apply));cross.addEventListener('change',apply)}
  apply();
 }
 frame()?.addEventListener('load',()=>{setTimeout(fix,250);setTimeout(fix,900)});setTimeout(fix,500);setTimeout(fix,1400);
})();