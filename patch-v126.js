// Avi Karaoke Studio Web v1.126 — song title on external display/export matches live preview
(function(){
  const preview=document.getElementById('preview');
  const lyrics=document.getElementById('lyricsPreview');
  const slide=document.getElementById('hksSongTitleSlide');
  const titleText=document.getElementById('hksSongTitleText');
  const extBtn=document.getElementById('hksExternalDisplay102');
  if(!preview)return;

  const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&Number(getComputedStyle(el).opacity||1)>0;
  const px=n=>Number.isFinite(parseFloat(n))?parseFloat(n):0;

  // External audience window: use the ACTUAL title text element and its ACTUAL live style.
  if(extBtn&&lyrics&&slide&&titleText){
    let ext=null,timer=null;
    function styleFor(el){
      const cs=getComputedStyle(el),ph=Math.max(1,preview.clientHeight),pw=Math.max(1,preview.clientWidth);
      const fs=px(cs.fontSize)||48;
      let lh=px(cs.lineHeight);if(!lh)lh=fs*1.12;
      return {
        fontVh:(fs/ph)*100,
        lineHeight:lh/fs,
        widthPct:Math.max(1,Math.min(100,(el.clientWidth||preview.clientWidth)/pw*100)),
        fontFamily:cs.fontFamily,
        fontWeight:cs.fontWeight,
        color:cs.color,
        textShadow:cs.textShadow,
        textAlign:cs.textAlign||'center'
      };
    }
    function snap(){
      const l=document.querySelector('.brandL'),r=document.querySelector('.brandR');
      const im=document.getElementById('bgImg'),v=document.getElementById('bgVideo');
      return {
        lyrics:lyrics.innerHTML||'',lyricsVisible:visible(lyrics),lyricsStyle:styleFor(lyrics),
        title:titleText.textContent||'',titleVisible:visible(slide),titleStyle:styleFor(titleText),
        left:l?.textContent||'',right:r?.textContent||'',leftStyle:l?.getAttribute('style')||'',rightStyle:r?.getAttribute('style')||'',
        image:im&&!im.hidden?im.src:'',video:v&&!v.hidden?v.src:'',videoTime:v?.currentTime||0,videoPaused:v?.paused??true
      };
    }
    function send(){if(!ext||ext.closed){ext=null;return}try{ext.postMessage({type:'hks-audience-126',data:snap()},location.origin)}catch(_){}}
    function openExternal(){
      ext=window.open('','avi-karaoke-audience','popup=yes,width=1280,height=720');
      if(!ext){alert('הדפדפן חסם את חלון המסך החיצוני. אשר חלונות קופצים ונסה שוב.');return}
      ext.document.open();
      ext.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>Avi Karaoke — External Display</title><style>
        html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000;color:#fff}
        #stage{position:fixed;inset:0;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden}
        #bg,#vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}#vid{display:none}
        #shade{position:absolute;inset:0;background:rgba(0,0,0,.08)}
        .brand{position:absolute;z-index:3;top:2.2%;font-weight:900;font-size:clamp(16px,2vw,34px)}.left{left:2.5%;direction:ltr}.right{right:2.5%}
        #lyrics,#title{position:relative;z-index:4;text-align:center;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box}
        #title{position:absolute;inset:0;width:100%;padding:4% 5%}
        #fs{position:fixed;right:12px;bottom:12px;z-index:9;padding:10px 14px;border:1px solid #d9a52d;border-radius:9px;background:#17120a;color:#f6d36f;font-weight:900;opacity:.8}
      </style></head><body><div id="stage"><img id="bg"><video id="vid" muted playsinline></video><div id="shade"></div><div id="bl" class="brand left"></div><div id="br" class="brand right"></div><div id="lyrics"></div><div id="title"></div></div><button id="fs">⛶ מסך מלא</button><script>
        const bg=document.getElementById('bg'),vid=document.getElementById('vid'),ly=document.getElementById('lyrics'),ti=document.getElementById('title'),bl=document.getElementById('bl'),br=document.getElementById('br');
        function applyStyle(el,s){s=s||{};el.style.fontSize=(s.fontVh||8)+'vh';el.style.lineHeight=String(s.lineHeight||1.12);el.style.fontFamily=s.fontFamily||'Arial';el.style.fontWeight=s.fontWeight||'900';el.style.color=s.color||'#fff';el.style.textShadow=s.textShadow||'0 3px 8px #000';el.style.textAlign=s.textAlign||'center'}
        addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='hks-audience-126')return;const d=e.data.data||{};ly.innerHTML=d.lyrics||'';ly.style.display=d.lyricsVisible?'flex':'none';ly.style.width=((d.lyricsStyle||{}).widthPct||90)+'%';applyStyle(ly,d.lyricsStyle);ti.textContent=d.title||'';ti.style.display=d.titleVisible?'flex':'none';applyStyle(ti,d.titleStyle);bl.textContent=d.left||'';br.textContent=d.right||'';if(d.leftStyle)bl.setAttribute('style',d.leftStyle);if(d.rightStyle)br.setAttribute('style',d.rightStyle);if(d.video){if(vid.src!==d.video)vid.src=d.video;vid.style.display='block';bg.style.display='none';if(Math.abs((vid.currentTime||0)-(d.videoTime||0))>.5)try{vid.currentTime=d.videoTime||0}catch(_){ }if(!d.videoPaused)vid.play().catch(()=>{});else vid.pause()}else if(d.image){bg.src=d.image;bg.style.display='block';vid.style.display='none';vid.pause()}else{bg.style.display='none';vid.style.display='none'}});
        document.getElementById('fs').onclick=()=>document.documentElement.requestFullscreen?.();
      <\/script></body></html>`);
      ext.document.close();setTimeout(send,100);clearInterval(timer);timer=setInterval(send,90);ext.focus();
    }
    // Replace older audience opener so title sizing is guaranteed to use #hksSongTitleText.
    extBtn.onclick=openExternal;
    const mo=new MutationObserver(()=>send());
    try{mo.observe(titleText,{attributes:true,childList:true,characterData:true,subtree:true});mo.observe(slide,{attributes:true});mo.observe(lyrics,{attributes:true,childList:true,subtree:true})}catch(_){}
    ['hksSongTitleMinus','hksSongTitlePlus','hksSongTitleColor','hksSongTitleFont','hksSongTitleInput','hksFontMinus','hksFontPlus'].forEach(id=>{
      const el=document.getElementById(id);el?.addEventListener('input',()=>setTimeout(send,0));el?.addEventListener('change',()=>setTimeout(send,0));el?.addEventListener('click',()=>setTimeout(send,0));
    });
    window.__hksExternalDisplay126={open:openExternal,send};
  }

  // Export: SongTitle font size is scaled from the live preview to ASS 1080p coordinates,
  // just like the lyric size added in v1.125.
  if(titleText){
    try{
      const original=window.buildAss;
      if(typeof original==='function'&&!original.__hksTitleMatch126){
        const wrapped=function(duration){
          let ass=original(duration);
          try{
            const cs=getComputedStyle(titleText),fs=px(cs.fontSize)||72,ph=Math.max(1,preview.clientHeight||1);
            const assSize=Math.max(24,Math.min(520,Math.round((fs/ph)*1080)));
            const fontName=String(cs.fontFamily||'Arial').split(',')[0].replace(/["']/g,'').trim();
            const m=String(cs.color||'rgb(255,255,255)').match(/rgba?\((\d+)\D+(\d+)\D+(\d+)/i);
            const assColor=m?'&H00'+[Number(m[3]),Number(m[2]),Number(m[1])].map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase():null;
            ass=ass.replace(/^(Style:\s*SongTitle,[^\n]*)$/gmi,line=>{const p=line.split(',');if(p.length>5){p[1]=fontName;p[2]=String(assSize);if(assColor)p[3]=assColor;return p.join(',')}return line});
          }catch(e){console.warn('[v126 title export match]',e)}
          return ass;
        };
        wrapped.__hksTitleMatch126=true;window.buildAss=wrapped;
      }
    }catch(e){console.warn('[v126 export wrapper]',e)}
  }

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.126';
})();