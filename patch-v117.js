// Avi Karaoke Studio Web v1.117 — fill monitor width when scaled + move player/waveform beside live preview
(function(){
  const studio=document.getElementById('studio');
  const desktop=studio?.querySelector('.desktop');
  if(!studio||!desktop)return;
  const previewColumn=desktop.children[0];
  const controlsColumn=desktop.children[1];
  if(!previewColumn||!controlsColumn)return;
  const previewCard=[...previewColumn.children].find(x=>x.querySelector?.('#preview'));
  const playerCard=[...previewColumn.children].find(x=>x.querySelector?.('#audio'));
  if(!previewCard||!playerCard)return;

  // v1.116 uses CSS zoom. Compensate the layout width so shrinking the UI does NOT leave dead space at the sides.
  function fillWidth(){
    const z=Math.max(.01,Number(document.body.style.zoom)||1);
    const wanted=(100/z)+'%';
    if(document.body.style.width!==wanted)document.body.style.width=wanted;
    document.body.style.maxWidth='none';
    document.documentElement.style.overflowX='hidden';
  }
  let internal=false;
  const obs=new MutationObserver(()=>{if(internal)return;internal=true;fillWidth();requestAnimationFrame(()=>internal=false)});
  obs.observe(document.body,{attributes:true,attributeFilter:['style']});
  fillWidth();

  let side=document.getElementById('hksPlayerSide117');
  if(!side){side=document.createElement('div');side.id='hksPlayerSide117';side.className='hksPlayerSide117';desktop.appendChild(side)}

  function arrange(){
    // On a wide desktop, use three columns: controls | live preview | waveform/player.
    const wide=window.innerWidth>=1450;
    studio.classList.toggle('hksWide117',wide);
    if(wide){
      if(!side.contains(playerCard))side.appendChild(playerCard);
    }else{
      if(!previewColumn.contains(playerCard))previewColumn.appendChild(playerCard);
    }
    setTimeout(()=>{try{window.__hksDrawSyncWave?.();drawWave?.()}catch(_){}},40);
  }

  const style=document.createElement('style');
  style.id='hksWideLayout117';
  style.textContent=`
    #studio{max-width:none!important;width:calc(100vw - 16px)!important;margin-inline:auto!important}
    #studio .desktop{max-width:none!important;width:100%!important}
    #hksPlayerSide117{display:none;min-width:0}
    @media(min-width:1450px){
      #studio.hksWide117 .desktop{
        display:grid!important;
        direction:ltr!important;
        grid-template-columns:minmax(360px,.72fr) minmax(620px,1.45fr) minmax(300px,.60fr)!important;
        gap:10px!important;
        align-items:start!important;
        width:100%!important;
        max-width:none!important;
      }
      #studio.hksWide117 .desktop > :first-child{
        grid-column:2!important;grid-row:1!important;direction:rtl!important;min-width:0!important;
      }
      #studio.hksWide117 .desktop > :nth-child(2){
        grid-column:1!important;grid-row:1!important;direction:rtl!important;min-width:0!important;
      }
      #studio.hksWide117 #hksPlayerSide117{
        display:block!important;grid-column:3!important;grid-row:1!important;direction:rtl!important;min-width:0!important;
      }
      #studio.hksWide117 #hksPlayerSide117>.card{margin:0!important;width:100%!important}
      #studio.hksWide117 .desktop > :first-child>.card:has(#preview){margin-bottom:0!important}
      #studio.hksWide117 #preview{width:100%!important;max-width:none!important}
    }
    @media(min-width:1800px){
      #studio.hksWide117 .desktop{grid-template-columns:minmax(420px,.72fr) minmax(760px,1.55fr) minmax(340px,.62fr)!important;gap:14px!important}
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('resize',()=>setTimeout(()=>{fillWidth();arrange()},60));
  // Re-run after UI scale +/- / fit buttons change zoom.
  ['hksUiMinus116','hksUiPlus116','hksUiFit116'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(()=>{fillWidth();arrange()},80)));
  arrange();
  window.__hksWideLayout117={arrange,fillWidth};
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.117';
})();