// Hebrew Karaoke Studio Web v1.37 — bilingual artist title with size/color controls
(function(){
  const preview=document.getElementById('preview');
  const toolbar=document.getElementById('hksPreviewToolbar');
  if(!preview||!toolbar)return;

  const SIZE_KEY='hksArtistNameSizePx';
  const HE_COLOR_KEY='hksArtistNameHebrewColor';
  const EN_COLOR_KEY='hksArtistNameEnglishColor';
  const MIN=12, MAX=72, STEP=1, DEFAULT_SIZE=28;
  const DEFAULT_HE='#ffffff', DEFAULT_EN='#ffffff';

  const style=document.createElement('style');
  style.textContent=`
    #hksArtistTitle{
      position:absolute;z-index:40;top:10px;left:50%;transform:translateX(-50%);
      width:94%;text-align:center;pointer-events:none;line-height:1.08;
      font-weight:900;text-shadow:0 2px 4px #000,0 0 8px #000;
      overflow-wrap:anywhere;
    }
    #hksArtistTitleHe{direction:rtl}
    #hksArtistTitleEn{direction:ltr;font-size:.72em;margin-top:3px;letter-spacing:.02em}
    #hksNameControls{
      display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;
      min-height:54px;padding:5px 9px;border:1px solid #3b5368;border-radius:14px;
      background:#102233;color:#fff;direction:rtl;
    }
    #hksNameControls button{
      min-width:48px;min-height:42px;padding:0 10px;border:1px solid #7890a5;border-radius:10px;
      background:#20364a;color:#fff;font-size:16px;font-weight:900;cursor:pointer;
    }
    #hksNameSizeValue{min-width:48px;text-align:center;font-size:12px;font-weight:800;direction:ltr}
    .hksNameColorWrap{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:800;white-space:nowrap}
    .hksNameColorWrap input[type="color"]{
      width:44px;height:42px;padding:2px;border:1px solid #7890a5;border-radius:9px;background:#20364a;cursor:pointer;
    }
    #preview.hksPhoneFullscreen #hksArtistTitle{
      top:max(10px,env(safe-area-inset-top));width:92%;
    }
    @media(max-width:520px){
      #hksNameControls{width:100%;gap:5px;padding:5px}
      #hksNameControls button{min-height:44px;min-width:46px;padding:0 8px}
      .hksNameColorWrap{font-size:11px}
      .hksNameColorWrap input[type="color"]{width:42px;height:42px}
    }
  `;
  document.head.appendChild(style);

  let title=document.getElementById('hksArtistTitle');
  if(!title){
    title=document.createElement('div');
    title.id='hksArtistTitle';
    title.setAttribute('aria-label','אבי דיין, Avi Dayan');
    title.innerHTML='<div id="hksArtistTitleHe">אבי דיין</div><div id="hksArtistTitleEn">Avi Dayan</div>';
    preview.appendChild(title);
  }

  let controls=document.getElementById('hksNameControls');
  if(!controls){
    controls=document.createElement('div');
    controls.id='hksNameControls';
    controls.setAttribute('role','group');
    controls.setAttribute('aria-label','שליטה בשם אבי דיין');
    controls.innerHTML=`
      <span style="font-weight:900;font-size:13px">שם</span>
      <button type="button" id="hksNameMinus" aria-label="הקטן את השם">A−</button>
      <span id="hksNameSizeValue">28px</span>
      <button type="button" id="hksNamePlus" aria-label="הגדל את השם">A+</button>
      <label class="hksNameColorWrap">עברית <input id="hksNameHebrewColor" type="color" aria-label="צבע אבי דיין בעברית"></label>
      <label class="hksNameColorWrap">English <input id="hksNameEnglishColor" type="color" aria-label="Color of Avi Dayan in English"></label>
    `;
    const full=document.getElementById('hksBelowFull');
    if(full)toolbar.insertBefore(controls,full);
    else toolbar.appendChild(controls);
  }

  const he=document.getElementById('hksArtistTitleHe');
  const en=document.getElementById('hksArtistTitleEn');
  const minus=document.getElementById('hksNameMinus');
  const plus=document.getElementById('hksNamePlus');
  const value=document.getElementById('hksNameSizeValue');
  const heColor=document.getElementById('hksNameHebrewColor');
  const enColor=document.getElementById('hksNameEnglishColor');

  function clamp(n){return Math.max(MIN,Math.min(MAX,Math.round(n)))}
  function goodColor(v,fallback){return /^#[0-9a-f]{6}$/i.test(v||'')?v:fallback}

  let size=clamp(Number(localStorage.getItem(SIZE_KEY))||DEFAULT_SIZE);
  let hc=goodColor(localStorage.getItem(HE_COLOR_KEY),DEFAULT_HE);
  let ec=goodColor(localStorage.getItem(EN_COLOR_KEY),DEFAULT_EN);

  function applySize(next,announce){
    size=clamp(next);
    title.style.fontSize=size+'px';
    if(value)value.textContent=size+'px';
    try{localStorage.setItem(SIZE_KEY,String(size))}catch(_){}
    if(announce){try{setStatus('גודל השם: '+size+'px')}catch(_){}}
  }
  function applyColors(){
    hc=goodColor(heColor?.value||hc,DEFAULT_HE);
    ec=goodColor(enColor?.value||ec,DEFAULT_EN);
    if(he)he.style.color=hc;
    if(en)en.style.color=ec;
    if(heColor)heColor.value=hc;
    if(enColor)enColor.value=ec;
    try{localStorage.setItem(HE_COLOR_KEY,hc);localStorage.setItem(EN_COLOR_KEY,ec)}catch(_){}
  }
  function stop(e){e.preventDefault();e.stopPropagation()}

  minus?.addEventListener('click',e=>{stop(e);applySize(size-STEP,true)});
  plus?.addEventListener('click',e=>{stop(e);applySize(size+STEP,true)});
  heColor?.addEventListener('input',applyColors);
  enColor?.addEventListener('input',applyColors);

  if(heColor)heColor.value=hc;
  if(enColor)enColor.value=ec;
  applySize(size,false);
  applyColors();

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.37';
})();
