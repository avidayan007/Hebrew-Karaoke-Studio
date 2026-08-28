// Hebrew Karaoke Studio Web v1.50 — clean empty preview and fixed fullscreen button on preview
(function(){
  const preview=document.getElementById('preview');
  const lyricsPreview=document.getElementById('lyricsPreview');
  if(!preview||!lyricsPreview)return;

  // Remove the old instructional placeholder ("טען שיר והכנס מילים" etc.).
  function cleanPlaceholder(){
    const text=(lyricsPreview.textContent||'').trim();
    if(!text||/טען\s*שיר|הכנס\s*מילים|טען.*מילים/.test(text))lyricsPreview.textContent='';
  }
  cleanPlaceholder();
  const obs=new MutationObserver(cleanPlaceholder);
  obs.observe(lyricsPreview,{childList:true,subtree:true,characterData:true});

  // A permanent fullscreen control directly on the live preview.
  let btn=document.getElementById('hksPreviewFullscreenFixed');
  if(!btn){
    btn=document.createElement('button');
    btn.id='hksPreviewFullscreenFixed';
    btn.type='button';
    btn.textContent='⛶';
    btn.setAttribute('aria-label','מסך מלא');
    btn.title='מסך מלא';
    preview.appendChild(btn);
  }
  const style=document.createElement('style');
  style.textContent=`#hksPreviewFullscreenFixed{position:absolute;left:10px;bottom:10px;z-index:20;width:46px;height:46px;border:1px solid #8ba4ba;border-radius:12px;background:#172b3dcc;color:#fff;font-size:27px;font-weight:900;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px #0008;-webkit-tap-highlight-color:transparent}#hksPreviewFullscreenFixed:active{transform:scale(.94)}`;
  document.head.appendChild(style);

  btn.addEventListener('click',()=>{
    // On iPhone use the custom preview fullscreen overlay first; native Fullscreen API is not reliable there.
    const phone=document.getElementById('hksPreviewExpand');
    if(phone){phone.click();return}
    if(document.fullscreenElement){document.exitFullscreen?.();return}
    preview.requestFullscreen?.().catch?.(()=>{});
  });

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.50';
})();
