// Hebrew Karaoke Studio Web v1.34 — phone live-preview fullscreen mode
(function(){
  const preview=document.getElementById('preview');
  const fullBtn=document.getElementById('fullBtn');
  if(!preview||!fullBtn)return;

  const style=document.createElement('style');
  style.textContent=`
    #preview.hksPhoneFullscreen{
      position:fixed!important;
      inset:0!important;
      width:100vw!important;
      height:100dvh!important;
      max-width:none!important;
      max-height:none!important;
      aspect-ratio:auto!important;
      margin:0!important;
      border:0!important;
      border-radius:0!important;
      z-index:2147483000!important;
      background:#000!important;
    }
    #preview.hksPhoneFullscreen img,
    #preview.hksPhoneFullscreen video{width:100%!important;height:100%!important;object-fit:cover!important}
    #preview.hksPhoneFullscreen .lyricsPreview{font-size:clamp(26px,6vw,64px)!important;width:94%!important}
    #hksExitPreviewFull{
      display:none;position:absolute;z-index:2147483647;left:max(12px,env(safe-area-inset-left));
      top:max(12px,env(safe-area-inset-top));min-width:48px;min-height:48px;border:1px solid #ffffff88;
      border-radius:14px;background:#000b;color:#fff;font-size:26px;font-weight:900;line-height:1;cursor:pointer;
    }
    #preview.hksPhoneFullscreen #hksExitPreviewFull{display:block}
    body.hksPreviewFullscreenOpen{overflow:hidden!important;touch-action:none}
    @supports not (height:100dvh){#preview.hksPhoneFullscreen{height:100vh!important}}
  `;
  document.head.appendChild(style);

  let exit=document.getElementById('hksExitPreviewFull');
  if(!exit){
    exit=document.createElement('button');
    exit.id='hksExitPreviewFull';
    exit.type='button';
    exit.setAttribute('aria-label','סגור מסך מלא');
    exit.title='סגור מסך מלא';
    exit.textContent='✕';
    preview.appendChild(exit);
  }

  function nativeFullscreenElement(){return document.fullscreenElement||document.webkitFullscreenElement||null}
  function enterCss(){preview.classList.add('hksPhoneFullscreen');document.body.classList.add('hksPreviewFullscreenOpen');fullBtn.textContent='✕ צא ממסך מלא';try{setStatus('תצוגה חיה במסך מלא')}catch(_){}}
  function leaveCss(){preview.classList.remove('hksPhoneFullscreen');document.body.classList.remove('hksPreviewFullscreenOpen');fullBtn.textContent='▣ מסך מלא'}

  async function enter(){
    enterCss();
    try{
      const req=preview.requestFullscreen||preview.webkitRequestFullscreen;
      if(req)await req.call(preview);
    }catch(_){/* iPhone/iPad fallback is the CSS full-screen mode above */}
  }
  async function leave(){
    try{
      if(nativeFullscreenElement()){
        const ex=document.exitFullscreen||document.webkitExitFullscreen;
        if(ex)await ex.call(document);
      }
    }catch(_){}
    leaveCss();
  }
  function toggle(){preview.classList.contains('hksPhoneFullscreen')?leave():enter()}

  fullBtn.onclick=toggle;
  exit.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();leave()});
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)leaveCss()});
  document.addEventListener('webkitfullscreenchange',()=>{if(!document.webkitFullscreenElement)leaveCss()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&preview.classList.contains('hksPhoneFullscreen'))leave()});

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.34';
})();
