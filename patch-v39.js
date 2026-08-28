// Hebrew Karaoke Studio Web v1.39 — control the existing top-corner branding, remove center title
(function(){
  const preview=document.getElementById('preview');
  const toolbar=document.getElementById('hksPreviewToolbar');
  const left=document.querySelector('#preview .brandL');
  const right=document.querySelector('#preview .brandR');
  if(!preview||!toolbar||!left||!right)return;

  // Remove the center title and its controls added in v1.37/v1.38.
  document.getElementById('hksArtistTitle')?.remove();
  document.getElementById('hksNameControls')?.remove();
  document.getElementById('hksNameFontSelect')?.closest('.hksFontSelectWrap')?.remove();

  const SIZE_KEY='hksCornerBrandSizePx';
  const FONT_KEY='hksCornerBrandFontFamily';
  const MIN=8, MAX=48, STEP=1, DEFAULT_SIZE=18;
  const FONTS=[
    ['Arial','Arial, Helvetica, sans-serif'],
    ['Arial Black','Arial Black, Arial, sans-serif'],
    ['Verdana','Verdana, Geneva, sans-serif'],
    ['Tahoma','Tahoma, Arial, sans-serif'],
    ['Trebuchet','Trebuchet MS, Arial, sans-serif'],
    ['Georgia','Georgia, Times New Roman, serif'],
    ['Times','Times New Roman, Times, serif'],
    ['Courier','Courier New, Courier, monospace'],
    ['System','-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif']
  ];

  const style=document.createElement('style');
  style.textContent=`
    #hksCornerBrandControls{
      display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;
      min-height:54px;padding:5px 9px;border:1px solid #3b5368;border-radius:14px;
      background:#102233;color:#fff;direction:rtl;
    }
    #hksCornerBrandControls button{
      min-width:48px;min-height:42px;padding:0 10px;border:1px solid #7890a5;border-radius:10px;
      background:#20364a;color:#fff;font-size:16px;font-weight:900;cursor:pointer;
    }
    #hksCornerBrandSizeValue{min-width:48px;text-align:center;font-size:12px;font-weight:800;direction:ltr}
    #hksCornerBrandFontWrap{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;white-space:nowrap}
    #hksCornerBrandFontSelect{
      min-height:42px;max-width:170px;padding:0 10px;border:1px solid #7890a5;border-radius:9px;
      background:#20364a;color:#fff;font-size:16px;font-weight:700;margin:0;
    }
    body.hksPreviewFullscreenOpen #hksCornerBrandControls{display:none!important}
    @media(max-width:520px){
      #hksCornerBrandControls{width:100%;gap:5px;padding:5px}
      #hksCornerBrandControls button{min-height:44px;min-width:46px;padding:0 8px}
      #hksCornerBrandFontWrap{width:100%;justify-content:center}
      #hksCornerBrandFontSelect{flex:1;max-width:none;min-width:0}
    }
  `;
  document.head.appendChild(style);

  let controls=document.getElementById('hksCornerBrandControls');
  if(!controls){
    controls=document.createElement('div');
    controls.id='hksCornerBrandControls';
    controls.setAttribute('role','group');
    controls.setAttribute('aria-label','שליטה בכיתוב העליון בצדדים');
    controls.innerHTML=`
      <span style="font-weight:900;font-size:13px">כיתוב צדדים</span>
      <button type="button" id="hksCornerBrandMinus" aria-label="הקטן כיתוב צדדים">A−</button>
      <span id="hksCornerBrandSizeValue">18px</span>
      <button type="button" id="hksCornerBrandPlus" aria-label="הגדל כיתוב צדדים">A+</button>
      <label id="hksCornerBrandFontWrap"><span>פונט</span><select id="hksCornerBrandFontSelect" aria-label="פונט כיתוב צדדים"></select></label>
    `;
    const full=document.getElementById('hksBelowFull');
    if(full)toolbar.insertBefore(controls,full);else toolbar.appendChild(controls);
  }

  const minus=document.getElementById('hksCornerBrandMinus');
  const plus=document.getElementById('hksCornerBrandPlus');
  const value=document.getElementById('hksCornerBrandSizeValue');
  const select=document.getElementById('hksCornerBrandFontSelect');

  if(select && !select.options.length){
    for(const [label,font] of FONTS){
      const opt=document.createElement('option');
      opt.value=font; opt.textContent=label; select.appendChild(opt);
    }
  }

  function clamp(n){return Math.max(MIN,Math.min(MAX,Math.round(n)))}
  function knownFont(v){return FONTS.some(([,font])=>font===v)?v:FONTS[0][1]}

  let size=clamp(Number(localStorage.getItem(SIZE_KEY))||DEFAULT_SIZE);
  let font=knownFont(localStorage.getItem(FONT_KEY));

  function applySize(next,announce){
    size=clamp(next);
    left.style.setProperty('font-size',size+'px','important');
    right.style.setProperty('font-size',size+'px','important');
    if(value)value.textContent=size+'px';
    try{localStorage.setItem(SIZE_KEY,String(size))}catch(_){}
    if(announce){try{setStatus('גודל הכיתוב בצדדים: '+size+'px')}catch(_){}}
  }

  function applyFont(next,announce){
    font=knownFont(next);
    left.style.setProperty('font-family',font,'important');
    right.style.setProperty('font-family',font,'important');
    if(select)select.value=font;
    try{localStorage.setItem(FONT_KEY,font)}catch(_){}
    if(announce){try{setStatus('פונט הכיתוב בצדדים שונה')}catch(_){}}
  }

  function stop(e){e.preventDefault();e.stopPropagation()}
  minus?.addEventListener('click',e=>{stop(e);applySize(size-STEP,true)});
  plus?.addEventListener('click',e=>{stop(e);applySize(size+STEP,true)});
  select?.addEventListener('change',()=>applyFont(select.value,true));

  applySize(size,false);
  applyFont(font,false);

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.39';
})();
