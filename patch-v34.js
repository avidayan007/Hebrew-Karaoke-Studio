// Hebrew Karaoke Studio Web v1.34 — phone live-preview fullscreen mode
(function(){
  const preview=document.getElementById('preview');
  const fullBtn=document.getElementById('fullBtn');
  if(!preview)return;

  const style=document.createElement('style');
  style.textContent=`
    #preview{position:relative}
    #hksPreviewExpand{
      position:absolute;z-index:50;left:10px;bottom:10px;min-width:52px;min-height:52px;
      padding:0 13px;border:1px solid #ffffff88;border-radius:14px;background:#000c;color:#fff;
      font-size:25px;font-weight:900;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent;
      box-shadow:0 2px 10px #0008;
    }
    #hksPreviewExpand .hksExpandText{font-size:12px;margin-inline-start:6px;vertical-align:2px}
    #preview.hksPhoneFullscreen{
      position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;
      max-width:none!important;max-height:none!important;aspect-ratio:auto!important;margin:0!important;
      border:0!important;border-radius:0!important;z-index:2147483000!important;background:#000!important;
    }
    #preview.hksPhoneFullscreen img,#preview.hksPhoneFullscreen video{width:100%!important;height:100%!important;object-fit:cover!important}
    #preview.hksPhoneFullscreen .lyricsPreview{font-size:clamp(26px,6vw,64px)!important;width:94%!important}
    #hksExitPreviewFull{
      display:none;position:absolute;z-index:2147483647;left:max(12px,env(safe-area-inset-left));
      top:max(12px,env(safe-area-inset-top));min-width:52px;min-height:52px;border:1px solid #ffffff88;
      border-radius:14px;background:#000c;color:#fff;font-size:26px;font-weight:900;line-height:1;cursor:pointer;
    }
    #preview.hksPhoneFullscreen #hksExitPreviewFull{display:block}
    #preview.hksPhoneFullscreen #hksPreviewExpand{display:none}
    body.hksPreviewFullscreenOpen{overflow:hidden!important;touch-action:none}
    @supports not (height:100dvh){#preview.hksPhoneFullscreen{height:100vh!important}}
  `;
  document.head.appendChild(style);

  let expand=document.getElementById('hksPreviewExpand');
  if(!expand){
    expand=document.createElement('button');
    expand.id='hksPreviewExpand';
    expand.type='button';
    expand.setAttribute('aria-label','הגדל תצוגה למסך מלא');
    expand.title='מסך מלא';
    expand.innerHTML='⛶<span class="hksExpandText">מסך מלא</span>';
    preview.appendChild(expand);
  }

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
  function enterCss(){
    preview.classList.add('hksPhoneFullscreen');
    document.body.classList.add('hksPreviewFullscreenOpen');
    if(fullBtn)fullBtn.textContent='✕ צא ממסך מלא';
    try{setStatus('תצוגה חיה במסך מלא')}catch(_){}
  }
  function leaveCss(){
    preview.classList.remove('hksPhoneFullscreen');
    document.body.classList.remove('hksPreviewFullscreenOpen');
    if(fullBtn)fullBtn.textContent='▣ מסך מלא';
  }
  async function enter(){
    enterCss();
    try{
      const req=preview.requestFullscreen||preview.webkitRequestFullscreen;
      if(req)await req.call(preview);
    }catch(_){ }
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

  expand.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();enter()});
  if(fullBtn)fullBtn.onclick=toggle;
  exit.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();leave()});
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)leaveCss()});
  document.addEventListener('webkitfullscreenchange',()=>{if(!document.webkitFullscreenElement)leaveCss()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&preview.classList.contains('hksPhoneFullscreen'))leave()});

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.34';
})();
