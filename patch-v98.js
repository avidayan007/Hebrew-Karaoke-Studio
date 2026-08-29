// Avi Karaoke Studio Web v1.98 — live preview box for top branding outline controls
(function(){
  const panel=document.getElementById('hksBrandOutlineControls97');
  const colorInput=document.getElementById('hksBrandOutlineColor97');
  const sizeInput=document.getElementById('hksBrandOutlineSize97');
  if(!panel||!colorInput||!sizeInput)return;

  let preview=document.getElementById('hksBrandOutlinePreview98');
  if(!preview){
    preview=document.createElement('div');
    preview.id='hksBrandOutlinePreview98';
    preview.innerHTML=`
      <div class="hksOutlinePreviewTitle98">תצוגה מקדימה</div>
      <div class="hksOutlinePreviewScreen98">
        <span class="hksOutlinePreviewLeft98">Avi Dayan The Show</span>
        <span class="hksOutlinePreviewRight98">אבי דיין ההופעה</span>
        <div class="hksOutlinePreviewCenter98">כך זה ייראה על המסך</div>
      </div>
    `;
    panel.appendChild(preview);
  }

  const left=preview.querySelector('.hksOutlinePreviewLeft98');
  const right=preview.querySelector('.hksOutlinePreviewRight98');
  const screen=preview.querySelector('.hksOutlinePreviewScreen98');

  const style=document.createElement('style');
  style.id='hksBrandOutlinePreviewStyle98';
  style.textContent=`
    #hksBrandOutlinePreview98{width:100%;margin-top:6px}
    #hksBrandOutlinePreview98 .hksOutlinePreviewTitle98{font-size:11px;font-weight:900;color:#f2cf79;text-align:center;margin-bottom:5px}
    #hksBrandOutlinePreview98 .hksOutlinePreviewScreen98{
      position:relative;width:min(100%,520px);height:112px;margin:0 auto;border-radius:10px;overflow:hidden;
      border:1px solid #8a6125;
      background:
        radial-gradient(circle at 50% 76%,rgba(255,175,65,.35),transparent 24%),
        linear-gradient(180deg,#452448 0%,#1e1630 45%,#11131b 46%,#090c12 100%);
      box-shadow:inset 0 0 28px rgba(0,0,0,.35),0 3px 10px rgba(0,0,0,.24);
    }
    .hksOutlinePreviewLeft98,.hksOutlinePreviewRight98{
      position:absolute;top:9px;z-index:2;color:#d8ae55;font-size:15px;font-weight:900;line-height:1.1;white-space:nowrap;
    }
    .hksOutlinePreviewLeft98{left:10px;direction:ltr}
    .hksOutlinePreviewRight98{right:10px;direction:rtl}
    .hksOutlinePreviewCenter98{position:absolute;left:0;right:0;bottom:18px;text-align:center;color:#fff;font-size:15px;font-weight:900;text-shadow:0 2px 4px #000}
    @media(max-width:520px){
      #hksBrandOutlinePreview98 .hksOutlinePreviewScreen98{height:98px}
      .hksOutlinePreviewLeft98,.hksOutlinePreviewRight98{font-size:11px;top:8px}
      .hksOutlinePreviewCenter98{font-size:12px;bottom:15px}
    }
  `;
  document.head.appendChild(style);

  function shadowFor(size,color){
    size=Math.max(0,Number(size)||0);
    if(size<=0)return 'none';
    const d=size;
    const h=Math.max(.5,size*.72);
    return [
      `${d}px 0 0 ${color}`,`-${d}px 0 0 ${color}`,
      `0 ${d}px 0 ${color}`,`0 -${d}px 0 ${color}`,
      `${h}px ${h}px 0 ${color}`,`-${h}px ${h}px 0 ${color}`,
      `${h}px -${h}px 0 ${color}`,`-${h}px -${h}px 0 ${color}`
    ].join(',');
  }

  function updatePreview(){
    const size=Number(sizeInput.value)||0;
    const color=colorInput.value||'#ffffff';
    const shadow=shadowFor(size,color);
    [left,right].forEach(el=>el&&el.style.setProperty('text-shadow',shadow,'important'));
    if(screen)screen.style.setProperty('--hks-outline-size',size+'px');
  }

  colorInput.addEventListener('input',updatePreview);
  sizeInput.addEventListener('input',updatePreview);
  updatePreview();

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.98';
  console.log('[v98] Live corner branding outline preview enabled');
})();