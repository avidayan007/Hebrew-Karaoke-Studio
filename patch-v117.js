// Avi Karaoke Studio Web v1.117 compatibility — fill width when scaled, DO NOT rearrange studio columns
(function(){
  const studio=document.getElementById('studio');
  if(!studio)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(isiOS){
    document.body.style.removeProperty('zoom');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('max-width');
    document.documentElement.style.removeProperty('overflow-x');
    studio.style.removeProperty('max-width');
    studio.style.removeProperty('width');
    window.__hksWideLayout117={fillWidth:()=>{}};
    return;
  }
  function fillWidth(){
    const z=Math.max(.01,Number(document.body.style.zoom)||1);
    document.body.style.width=(100/z)+'%';
    document.body.style.maxWidth='none';
    document.documentElement.style.overflowX='hidden';
    studio.style.setProperty('max-width','none','important');
    studio.style.setProperty('width','calc(100vw - 16px)','important');
  }
  fillWidth();
  ['hksUiMinus116','hksUiPlus116','hksUiFit116'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(fillWidth,80)));
  window.addEventListener('resize',()=>setTimeout(fillWidth,60));
  window.__hksWideLayout117={fillWidth};
})();