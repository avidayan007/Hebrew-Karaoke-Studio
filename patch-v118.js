// Avi Karaoke Studio Web v1.118 — keep LEFT controls untouched; move only player/wave card beside live preview
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

  // IMPORTANT: controlsColumn is never moved or resized here.
  let wrap=document.getElementById('hksPreviewPlayerWrap118');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='hksPreviewPlayerWrap118';
    previewColumn.insertBefore(wrap,previewCard);
  }
  if(!wrap.contains(previewCard))wrap.appendChild(previewCard);
  if(!wrap.contains(playerCard))wrap.appendChild(playerCard);

  const style=document.createElement('style');
  style.id='hksPreviewPlayerLayout118';
  style.textContent=`
    #hksPreviewPlayerWrap118{display:block;width:100%;min-width:0}
    #hksPreviewPlayerWrap118>.card{width:100%;min-width:0}
    @media(min-width:1200px){
      #hksPreviewPlayerWrap118{
        display:grid!important;
        grid-template-columns:minmax(0,1fr) minmax(280px,.48fr)!important;
        gap:10px!important;
        align-items:start!important;
        direction:ltr!important;
      }
      #hksPreviewPlayerWrap118>.card{direction:rtl!important;margin-bottom:0!important}
      #hksPreviewPlayerWrap118>.card:has(#preview){grid-column:1!important}
      #hksPreviewPlayerWrap118>.card:has(#audio){grid-column:2!important}
      #hksPreviewPlayerWrap118 #preview{width:100%!important;max-width:none!important}
    }
    @media(min-width:1700px){
      #hksPreviewPlayerWrap118{grid-template-columns:minmax(0,1fr) minmax(320px,.42fr)!important;gap:14px!important}
    }
    @media(max-width:1199px){
      #hksPreviewPlayerWrap118>.card:has(#audio){margin-top:0!important}
    }
  `;
  document.head.appendChild(style);

  const refresh=()=>setTimeout(()=>{try{window.__hksDrawSyncWave?.();drawWave?.()}catch(_){}},50);
  window.addEventListener('resize',refresh);
  ['hksUiMinus116','hksUiPlus116','hksUiFit116'].forEach(id=>document.getElementById(id)?.addEventListener('click',refresh));
  refresh();

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.118';
})();