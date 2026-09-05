// Avi Karaoke Studio Web v1.152 — live preview/fullscreen/export share one proportional 16:9 typography layout
(function(){
  const preview=document.getElementById('preview');
  if(!preview)return;
  window.__hksPreviewParity152=true;

  const lyrics=document.getElementById('lyricsPreview');
  const brandL=preview.querySelector('.brandL');
  const brandR=preview.querySelector('.brandR');
  const titleSlide=document.getElementById('hksSongTitleSlide');
  const titleText=document.getElementById('hksSongTitleText')||titleSlide;
  const TARGET_W=1920,TARGET_H=1080;
  let last=null,fullscreenRestore=null,resizeTimer=0;

  // The small live monitor is now the same aspect ratio as the exported video.
  // Fullscreen remains a centered 16:9 stage instead of stretching to the iPhone screen ratio.
  if(!document.getElementById('hksPreviewParityStyle152')){
    const st=document.createElement('style');st.id='hksPreviewParityStyle152';
    st.textContent=`
      #preview{aspect-ratio:16/9!important}
      #preview:fullscreen,#preview:-webkit-full-screen{
        position:fixed!important;inset:0!important;
        width:min(100vw,calc(100vh * 1.7777778))!important;
        height:min(100vh,calc(100vw * .5625))!important;
        max-width:100vw!important;max-height:100vh!important;
        margin:auto!important;border-radius:0!important;
        background:#000!important;
      }
    `;
    document.head.appendChild(st);
  }

  const num=v=>Number.isFinite(parseFloat(v))?parseFloat(v):0;
  function lineRatio(cs,fs){const lh=num(cs.lineHeight);return lh>0&&fs>0?lh/fs:null}
  function metric(el){
    if(!el)return null;
    const pr=preview.getBoundingClientRect(),r=el.getBoundingClientRect(),cs=getComputedStyle(el),fs=num(cs.fontSize);
    if(!(pr.width>0&&pr.height>0&&fs>0))return null;
    return {
      fontPx:fs,fontH:fs/pr.height,
      lineRatio:lineRatio(cs,fs),
      left:(r.left-pr.left)/pr.width,
      right:(pr.right-r.right)/pr.width,
      top:(r.top-pr.top)/pr.height,
      centerX:((r.left+r.width/2)-pr.left)/pr.width,
      centerY:((r.top+r.height/2)-pr.top)/pr.height,
      width:r.width/pr.width,
      textShadow:cs.textShadow||'none'
    };
  }
  function capture(force=false){
    if(!force&&(document.fullscreenElement===preview||document.webkitFullscreenElement===preview))return last;
    const pr=preview.getBoundingClientRect();if(!(pr.width>0&&pr.height>0))return last;
    last={
      width:pr.width,height:pr.height,
      lyrics:metric(lyrics),brandL:metric(brandL),brandR:metric(brandR),title:metric(titleText),
      capturedAt:Date.now()
    };
    window.__hksPreviewMetrics152=last;
    return last;
  }
  function saveInline(el){if(!el)return null;return {fontSize:el.style.fontSize,lineHeight:el.style.lineHeight,textShadow:el.style.textShadow,left:el.style.left,right:el.style.right,top:el.style.top,width:el.style.width}}
  function restoreInline(el,s){if(!el||!s)return;for(const k of Object.keys(s))el.style[k]=s[k]}
  function scaleShadow(shadow,f){
    if(!shadow||shadow==='none'||!Number.isFinite(f)||f<=0)return shadow||'none';
    return String(shadow).replace(/(-?\d*\.?\d+)px/g,(m,n)=>(Number(n)*f).toFixed(2)+'px');
  }
  function applyMetric(el,m,pr,kind){
    if(!el||!m)return;
    const factor=pr.height/Math.max(1,last?.height||pr.height);
    el.style.fontSize=(m.fontH*pr.height).toFixed(2)+'px';
    if(m.lineRatio)el.style.lineHeight=String(m.lineRatio);
    el.style.textShadow=scaleShadow(m.textShadow,factor);
    if(kind==='left'){
      el.style.left=(m.left*100).toFixed(4)+'%';el.style.right='auto';el.style.top=(m.top*100).toFixed(4)+'%';
    }else if(kind==='right'){
      el.style.right=(m.right*100).toFixed(4)+'%';el.style.left='auto';el.style.top=(m.top*100).toFixed(4)+'%';
    }else if(kind==='lyrics'&&m.width>0){
      el.style.width=(m.width*100).toFixed(4)+'%';
    }
  }
  function enterFullscreen(){
    if(!last)capture(true);if(!last)return;
    fullscreenRestore={lyrics:saveInline(lyrics),brandL:saveInline(brandL),brandR:saveInline(brandR),title:saveInline(titleText)};
    requestAnimationFrame(()=>{
      const pr=preview.getBoundingClientRect();
      applyMetric(lyrics,last.lyrics,pr,'lyrics');applyMetric(brandL,last.brandL,pr,'left');applyMetric(brandR,last.brandR,pr,'right');applyMetric(titleText,last.title,pr,'title');
    });
  }
  function leaveFullscreen(){
    if(fullscreenRestore){restoreInline(lyrics,fullscreenRestore.lyrics);restoreInline(brandL,fullscreenRestore.brandL);restoreInline(brandR,fullscreenRestore.brandR);restoreInline(titleText,fullscreenRestore.title);fullscreenRestore=null}
    requestAnimationFrame(()=>capture(true));
  }
  function fullChange(){
    const active=document.fullscreenElement===preview||document.webkitFullscreenElement===preview;
    active?enterFullscreen():leaveFullscreen();
  }
  document.addEventListener('fullscreenchange',fullChange);
  document.addEventListener('webkitfullscreenchange',fullChange);
  document.getElementById('fullBtn')?.addEventListener('pointerdown',()=>capture(true),true);
  document.getElementById('fullBtn')?.addEventListener('click',()=>capture(true),true);

  // Re-capture only after controls that can change preview typography/style.
  const looksLikePreviewControl=el=>{
    const id=String(el?.id||'');
    return /(?:font|title|brand|corner|outline|size|plus|minus)/i.test(id)||!!el?.closest?.('#hksCornerBrandControls,#hksBrandOutlineControls97');
  };
  ['click','input','change'].forEach(evt=>document.addEventListener(evt,e=>{if(looksLikePreviewControl(e.target))setTimeout(()=>capture(),80)},true));
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>capture(),140)});
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(()=>capture(),900));

  function assStyle(ass,name,fn){
    const re=new RegExp('^(Style:\\s*'+name+',[^\\n]*)$','gmi');
    return ass.replace(re,line=>{const p=line.split(',');try{fn(p)}catch(_){}return p.join(',')});
  }
  const assSize=m=>Math.max(8,Math.min(600,Math.round((m?.fontH||0)*TARGET_H)));
  const marginX=v=>Math.max(0,Math.round(Math.max(0,Math.min(1,Number(v)||0))*TARGET_W));
  const marginY=v=>Math.max(0,Math.round(Math.max(0,Math.min(1,Number(v)||0))*TARGET_H));
  function escAss(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\{/g,'\\{').replace(/\}/g,'\\}').replace(/\r?\n/g,'\\N')}
  function at(t){t=Math.max(0,Number(t)||0);const h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;return `${h}:${String(m).padStart(2,'0')}:${s.toFixed(2).padStart(5,'0')}`}
  function currentTitle(){return String(window.__hksSongTitleState?.text||document.getElementById('hksSongTitleInput')?.value||titleText?.textContent||'').trim()}
  function firstSync(duration){
    try{for(const w of words){const t=Number(w?.time);if(Number.isFinite(t))return Math.max(.05,Math.min(Number(duration)||t,t))}}catch(_){}
    return 0;
  }

  try{
    const prev=window.buildAss;
    if(typeof prev==='function'&&!prev.__hksPreviewParity152){
      const wrapped=function(duration){
        let ass=prev(duration);const m=capture(true)||last;if(!m)return ass;
        // All font sizes and top-brand positions come from the same live 16:9 monitor proportions.
        ass=assStyle(ass,'Lyrics',p=>{if(p.length>22){p[2]=String(assSize(m.lyrics));p[18]='5'}});
        ass=assStyle(ass,'BrandL',p=>{if(p.length>22){p[2]=String(assSize(m.brandL));p[18]='7';p[19]=String(marginX(m.brandL?.left));p[21]=String(marginY(m.brandL?.top))}});
        ass=assStyle(ass,'BrandR',p=>{if(p.length>22){p[2]=String(assSize(m.brandR));p[18]='9';p[20]=String(marginX(m.brandR?.right));p[21]=String(marginY(m.brandR?.top))}});
        ass=assStyle(ass,'SongTitle',p=>{if(p.length>22){p[2]=String(assSize(m.title));p[18]='5'}});

        // Older project states may have a title on the live monitor but no SongTitle style/event in ASS.
        const title=currentTitle(),end=firstSync(duration);
        if(title&&end>0&&!/^Style:\s*SongTitle,/mi.test(ass)){
          const base=`Style: SongTitle,Noto Sans Hebrew,${assSize(m.title)||96},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,5,0,5,70,70,30,1`;
          ass=ass.replace(/\n\[Events\]/,'\n'+base+'\n\n[Events]');
        }
        if(title&&end>0&&!/Dialogue:[^\n]*,SongTitle,/i.test(ass)){
          const event=`Dialogue: 0,0:00:00.00,${at(end)},SongTitle,,0,0,0,,${escAss(title)}`;
          const marker='Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n';
          ass=ass.replace(marker,marker+event+'\n');
        }
        window.__hksLastAssMetrics152={lyrics:assSize(m.lyrics),brandL:assSize(m.brandL),brandR:assSize(m.brandR),title:assSize(m.title),brandLeft:marginX(m.brandL?.left),brandRight:marginX(m.brandR?.right),brandTopL:marginY(m.brandL?.top),brandTopR:marginY(m.brandR?.top)};
        return ass;
      };
      wrapped.__hksPreviewParity152=true;window.buildAss=wrapped;
    }
  }catch(e){console.warn('[v152 export parity]',e)}

  // Public test/debug API; also useful for the export renderer to re-capture right before rendering.
  window.__hksPreviewParity152Api={capture:()=>capture(true),get metrics(){return last},target:{width:TARGET_W,height:TARGET_H}};
  [0,150,600,1400].forEach(ms=>setTimeout(()=>capture(true),ms));
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.152';
  try{setStatus('v1.152 מוכן — התצוגה החיה, מסך מלא וה-Export משתמשים באותם יחסי גודל 16:9.')}catch(_){}
})();
