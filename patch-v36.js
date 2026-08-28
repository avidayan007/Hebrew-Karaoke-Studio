// Hebrew Karaoke Studio Web v1.36 — controls below live preview, clean fullscreen
(function(){
  const preview=document.getElementById('preview');
  const fontControls=document.getElementById('hksFontControls');
  const fullBtn=document.getElementById('fullBtn');
  if(!preview)return;

  const style=document.createElement('style');
  style.textContent=`
    #hksPreviewToolbar{
      display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;
      width:100%;padding:9px 4px 2px;direction:rtl;
    }
    #hksPreviewToolbar #hksFontControls{
      position:static!important;inset:auto!important;display:flex!important;
      background:#102233!important;border:1px solid #3b5368!important;
      box-shadow:none!important;margin:0!important;
    }
    #hksBelowFull{
      min-height:54px;padding:0 18px;border:1px solid #7890a5;border-radius:12px;
      background:linear-gradient(#814ab0,#43245e);color:#fff;font-size:16px;font-weight:900;
      cursor:pointer;box-shadow:2px 5px 3px #010509;
    }
    #hksPreviewExpand{display:none!important}
    body.hksPreviewFullscreenOpen #hksPreviewToolbar{display:none!important}
    @media(max-width:520px){
      #hksPreviewToolbar{gap:6px;padding-top:8px}
      #hksBelowFull{min-height:52px;padding:0 14px;font-size:15px;flex:1;min-width:130px}
      #hksPreviewToolbar #hksFontControls{flex:1;justify-content:center;min-width:180px}
    }
  `;
  document.head.appendChild(style);

  let toolbar=document.getElementById('hksPreviewToolbar');
  if(!toolbar){
    toolbar=document.createElement('div');
    toolbar.id='hksPreviewToolbar';
    toolbar.setAttribute('aria-label','כלי תצוגה');
    preview.insertAdjacentElement('afterend',toolbar);
  }

  if(fontControls)toolbar.appendChild(fontControls);

  let belowFull=document.getElementById('hksBelowFull');
  if(!belowFull){
    belowFull=document.createElement('button');
    belowFull.id='hksBelowFull';
    belowFull.type='button';
    belowFull.textContent='⛶ מסך מלא';
    belowFull.setAttribute('aria-label','הגדל את התצוגה למסך מלא');
    toolbar.appendChild(belowFull);
  }

  belowFull.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    if(fullBtn) fullBtn.click();
    else document.getElementById('hksPreviewExpand')?.click();
  };

  // Keep the older general fullscreen button available but remove the duplicate from the main grid.
  if(fullBtn) fullBtn.style.display='none';

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.36';
})();
