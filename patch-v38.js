// Hebrew Karaoke Studio Web v1.38 — font selectors for lyrics and artist title
(function(){
  const lyrics=document.getElementById('lyricsPreview');
  const title=document.getElementById('hksArtistTitle');
  const toolbar=document.getElementById('hksPreviewToolbar');
  const nameControls=document.getElementById('hksNameControls');
  const fontControls=document.getElementById('hksFontControls');
  if(!lyrics||!toolbar)return;

  const LYRICS_FONT_KEY='hksLyricsFontFamily';
  const NAME_FONT_KEY='hksArtistFontFamily';

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
    .hksFontSelectWrap{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;white-space:nowrap}
    .hksFontSelectWrap select{
      min-height:42px;max-width:170px;padding:0 10px;border:1px solid #7890a5;border-radius:9px;
      background:#20364a;color:#fff;font-size:16px;font-weight:700;
    }
    @media(max-width:520px){
      .hksFontSelectWrap{width:100%;justify-content:center}
      .hksFontSelectWrap select{flex:1;max-width:none;min-width:0}
    }
  `;
  document.head.appendChild(style);

  function buildSelect(id,labelText){
    const wrap=document.createElement('label');
    wrap.className='hksFontSelectWrap';
    wrap.innerHTML='<span>'+labelText+'</span>';
    const select=document.createElement('select');
    select.id=id;
    select.setAttribute('aria-label',labelText);
    for(const [label,value] of FONTS){
      const opt=document.createElement('option');opt.value=value;opt.textContent=label;select.appendChild(opt);
    }
    wrap.appendChild(select);
    return {wrap,select};
  }

  let lyricsSelect=document.getElementById('hksLyricsFontSelect');
  if(!lyricsSelect){
    const made=buildSelect('hksLyricsFontSelect','פונט מילים');
    lyricsSelect=made.select;
    if(fontControls)fontControls.appendChild(made.wrap);else toolbar.prepend(made.wrap);
  }

  let nameSelect=document.getElementById('hksNameFontSelect');
  if(!nameSelect){
    const made=buildSelect('hksNameFontSelect','פונט שם');
    nameSelect=made.select;
    if(nameControls)nameControls.appendChild(made.wrap);else toolbar.prepend(made.wrap);
  }

  function knownOrDefault(v){
    return FONTS.some(([,value])=>value===v)?v:FONTS[0][1];
  }
  let lyricsFont=knownOrDefault(localStorage.getItem(LYRICS_FONT_KEY));
  let nameFont=knownOrDefault(localStorage.getItem(NAME_FONT_KEY));

  function applyLyricsFont(v,announce){
    lyricsFont=knownOrDefault(v);
    lyrics.style.setProperty('font-family',lyricsFont,'important');
    lyricsSelect.value=lyricsFont;
    try{localStorage.setItem(LYRICS_FONT_KEY,lyricsFont)}catch(_){}
    if(announce){try{setStatus('פונט מילות הקריוקי שונה')}catch(_){}}
  }
  function applyNameFont(v,announce){
    nameFont=knownOrDefault(v);
    if(title)title.style.setProperty('font-family',nameFont,'important');
    nameSelect.value=nameFont;
    try{localStorage.setItem(NAME_FONT_KEY,nameFont)}catch(_){}
    if(announce){try{setStatus('פונט השם שונה')}catch(_){}}
  }

  lyricsSelect.addEventListener('change',()=>applyLyricsFont(lyricsSelect.value,true));
  nameSelect.addEventListener('change',()=>applyNameFont(nameSelect.value,true));
  applyLyricsFont(lyricsFont,false);
  applyNameFont(nameFont,false);

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.38';
})();
