// Hebrew Karaoke Studio Web v1.51 — small fullscreen button below live preview
(function(){
  const preview=document.getElementById('preview');
  const old=document.getElementById('hksPreviewFullscreenFixed');
  if(!preview)return;

  // Remove the large button that v1.50 placed inside the picture.
  old?.remove();

  let row=document.getElementById('hksFullscreenBelowRow');
  if(!row){
    row=document.createElement('div');
    row.id='hksFullscreenBelowRow';
    row.innerHTML='<button id="hksFullscreenBelowSmall" type="button" aria-label="מסך מלא" title="מסך מלא">⛶ <span>מסך מלא</span></button>';
    preview.insertAdjacentElement('afterend',row);
  }
  const btn=document.getElementById('hksFullscreenBelowSmall');
  const style=document.createElement('style');
  style.textContent=`
    #hksPreviewFullscreenFixed{display:none!important}
    #hksFullscreenBelowRow{display:flex;justify-content:flex-start;align-items:center;margin:6px 4px 2px;direction:rtl}
    #hksFullscreenBelowSmall{height:30px;padding:0 9px;border:1px solid #71889d;border-radius:7px;background:#1a3043;color:#eef6ff;font-size:12px;font-weight:800;display:inline-flex;gap:5px;align-items:center;justify-content:center;box-shadow:none;-webkit-tap-highlight-color:transparent}
    #hksFullscreenBelowSmall span{font-size:11px}
    #hksFullscreenBelowSmall:active{transform:scale(.96)}
  `;
  document.head.appendChild(style);

  btn?.addEventListener('click',()=>{
    const phone=document.getElementById('hksPreviewExpand');
    if(phone){phone.click();return}
    if(document.fullscreenElement){document.exitFullscreen?.();return}
    preview.requestFullscreen?.().catch?.(()=>{});
  });

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.51';
})();
