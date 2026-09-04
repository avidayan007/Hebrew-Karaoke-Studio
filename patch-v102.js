// Avi Karaoke Studio Web v1.102 — detachable external audience display
(function(){
  const preview=document.getElementById('preview');
  if(!preview)return;
  let ext=null;
  let timer=null;

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function snapshot(){
    const lp=document.getElementById('lyricsPreview');
    const l=document.querySelector('.brandL'),r=document.querySelector('.brandR');
    const im=document.getElementById('bgImg'),v=document.getElementById('bgVideo');
    return {lyrics:lp?.innerHTML||'',left:l?.textContent||'',right:r?.textContent||'',leftStyle:l?.getAttribute('style')||'',rightStyle:r?.getAttribute('style')||'',image:im&&!im.hidden?im.src:'',video:v&&!v.hidden?v.src:'',videoTime:v?.currentTime||0,videoPaused:v?.paused??true};
  }
  function send(){if(!ext||ext.closed){ext=null;return}try{ext.postMessage({type:'hks-audience-102',data:snapshot()},location.origin)}catch(_){}}
  function openExternal(){
    ext=window.open('','avi-karaoke-audience','popup=yes,width=1280,height=720');
    if(!ext){alert('הדפדפן חסם את חלון המסך החיצוני. אשר חלונות קופצים ונסה שוב.');return}
    ext.document.open();ext.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>Avi Karaoke — External Display</title><style>
      html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000;font-family:Arial,"Noto Sans Hebrew",sans-serif;color:#fff}
      #stage{position:fixed;inset:0;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden}
      #bg,#vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}#vid{display:none}
      #shade{position:absolute;inset:0;background:rgba(0,0,0,.08)}
      .brand{position:absolute;z-index:3;top:2.2%;font-weight:900;font-size:clamp(16px,2vw,34px);color:#2584e6;text-shadow:1px 1px #fff,-1px -1px #fff}.left{left:2.5%;direction:ltr}.right{right:2.5%}
      #lyrics{position:relative;z-index:4;width:90%;text-align:center;font-size:clamp(32px,5vw,82px);font-weight:900;line-height:1.2;text-shadow:0 3px 8px #000,2px 2px 2px #000,-2px -2px 2px #000}
      #fs{position:fixed;right:12px;bottom:12px;z-index:9;padding:10px 14px;border:1px solid #d9a52d;border-radius:9px;background:#17120a;color:#f6d36f;font-weight:900;opacity:.8}#fs:hover{opacity:1}
    </style></head><body><div id="stage"><img id="bg"><video id="vid" muted playsinline></video><div id="shade"></div><div id="bl" class="brand left"></div><div id="br" class="brand right"></div><div id="lyrics"></div></div><button id="fs">⛶ מסך מלא</button><script>
      const bg=document.getElementById('bg'),vid=document.getElementById('vid'),ly=document.getElementById('lyrics'),bl=document.getElementById('bl'),br=document.getElementById('br');
      addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='hks-audience-102')return;const d=e.data.data||{};ly.innerHTML=d.lyrics||'';bl.textContent=d.left||'';br.textContent=d.right||'';if(d.leftStyle)bl.setAttribute('style',d.leftStyle);if(d.rightStyle)br.setAttribute('style',d.rightStyle);if(d.video){if(vid.src!==d.video)vid.src=d.video;vid.style.display='block';bg.style.display='none';if(Math.abs((vid.currentTime||0)-(d.videoTime||0))>.5)try{vid.currentTime=d.videoTime||0}catch(_){ }if(!d.videoPaused)vid.play().catch(()=>{});else vid.pause()}else if(d.image){bg.src=d.image;bg.style.display='block';vid.style.display='none';vid.pause()}else{bg.style.display='none';vid.style.display='none'}});
      document.getElementById('fs').onclick=()=>document.documentElement.requestFullscreen?.();
    <\/script></body></html>`);ext.document.close();
    setTimeout(send,150);clearInterval(timer);timer=setInterval(send,80);ext.focus();
  }

  let btn=document.getElementById('hksExternalDisplay102');
  if(!btn){btn=document.createElement('button');btn.id='hksExternalDisplay102';btn.type='button';btn.textContent='🖥 מסך חיצוני';btn.title='פתח תצוגת קהל בחלון נפרד למסך חיצוני';const card=preview.closest('.card')||preview.parentElement;card?.insertBefore(btn,preview);}
  btn.onclick=openExternal;
  const style=document.createElement('style');style.textContent='#hksExternalDisplay102{margin:0 0 7px 7px;padding:7px 12px;border-radius:9px;border:1px solid #d6a43a;background:linear-gradient(180deg,#d99a20,#8b5004);color:#fff8df;font-weight:900;cursor:pointer}';document.head.appendChild(style);
  window.addEventListener('beforeunload',()=>{try{ext?.close()}catch(_){}});
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.102';
})();