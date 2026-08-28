// Hebrew Karaoke Studio Web v1.41 — expanded fonts, colors, compact controls and audio under preview
(function(){
  const preview=document.getElementById('preview');
  const lyrics=document.getElementById('lyricsPreview');
  const toolbar=document.getElementById('hksPreviewToolbar');
  const left=document.querySelector('#preview .brandL');
  const right=document.querySelector('#preview .brandR');
  const wave=document.getElementById('wave');
  const audio=document.getElementById('audio');
  if(!preview||!lyrics||!toolbar)return;

  // Load a richer Hebrew-capable font collection.
  if(!document.getElementById('hksHebrewFonts41')){
    const link=document.createElement('link');
    link.id='hksHebrewFonts41';
    link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Alef:wght@400;700&family=Amatic+SC:wght@400;700&family=Assistant:wght@400;600;700;800&family=David+Libre:wght@400;500;700&family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@400;600;700;800;900&family=Miriam+Libre:wght@400;700&family=Noto+Sans+Hebrew:wght@400;600;700;800;900&family=Open+Sans:wght@400;600;700;800&family=Rubik:wght@400;600;700;800;900&family=Secular+One&family=Suez+One&display=swap';
    document.head.appendChild(link);
  }

  const FONTS=[
    ['David / דוד','David Libre, David, serif'],
    ['Heebo','Heebo, Arial, sans-serif'],
    ['Assistant','Assistant, Arial, sans-serif'],
    ['Rubik','Rubik, Arial, sans-serif'],
    ['Alef','Alef, Arial, sans-serif'],
    ['Frank Ruhl','Frank Ruhl Libre, serif'],
    ['Miriam','Miriam Libre, Arial, sans-serif'],
    ['Noto Sans Hebrew','Noto Sans Hebrew, Arial, sans-serif'],
    ['Secular One','Secular One, Arial, sans-serif'],
    ['Suez One','Suez One, serif'],
    ['Open Sans','Open Sans, Arial, sans-serif'],
    ['Amatic SC','Amatic SC, cursive'],
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
    /* Compact all text/font controls below the preview. */
    #hksPreviewToolbar{gap:5px!important;padding:6px 2px 2px!important}
    #hksFontControls,#hksCornerBrandControls{min-height:38px!important;padding:3px 5px!important;gap:4px!important;border-radius:10px!important}
    #hksFontControls button,#hksCornerBrandControls button{min-width:34px!important;min-height:32px!important;height:32px!important;padding:0 6px!important;font-size:14px!important;border-radius:8px!important}
    #hksFontValue,#hksCornerBrandSizeValue{min-width:38px!important;font-size:10px!important}
    #hksFontControls .hksFontSelectWrap,#hksCornerBrandFontWrap{font-size:10px!important;gap:4px!important}
    #hksLyricsFontSelect,#hksCornerBrandFontSelect{min-height:32px!important;height:32px!important;max-width:145px!important;padding:0 6px!important;font-size:13px!important;margin:0!important;border-radius:7px!important}
    #hksBelowFull{min-height:38px!important;height:38px!important;padding:0 12px!important;font-size:13px!important;border-radius:9px!important}

    #hksColorControls{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap;direction:rtl;
      min-height:38px;padding:3px 6px;border:1px solid #3b5368;border-radius:10px;background:#102233;color:#fff}
    .hksColorPick{display:flex;align-items:center;gap:3px;font-size:10px;font-weight:800;white-space:nowrap}
    .hksColorPick input[type=color]{width:32px;height:28px;min-height:28px;padding:1px;margin:0;border:1px solid #7890a5;border-radius:7px;background:#20364a}

    /* Audio/wave card placed directly under the big preview. */
    #hksPreviewAudioCard{margin:7px 0 0!important;padding:7px!important;border-radius:10px!important}
    #hksPreviewAudioCard .wave{height:92px!important;margin:0!important}
    #hksPreviewAudioCard audio{margin:5px 0 0!important;height:38px!important}
    #hksAudioTransport{display:flex;gap:5px;margin-top:5px;direction:rtl}
    #hksAudioTransport .gbtn{min-height:34px!important;height:34px!important;border-radius:8px!important;font-size:12px!important;box-shadow:1px 3px 2px #010509!important;flex:1;padding:0 7px!important}
    #hksPreviewAudioCard #clock{margin-top:4px;text-align:center}

    body.hksPreviewFullscreenOpen #hksColorControls{display:none!important}
    @media(max-width:520px){
      #hksFontControls,#hksCornerBrandControls,#hksColorControls{width:100%!important}
      #hksLyricsFontSelect,#hksCornerBrandFontSelect{max-width:none!important;min-width:100px!important}
      #hksPreviewAudioCard .wave{height:78px!important}
    }
  `;
  document.head.appendChild(style);

  function refillSelect(select,key,defaultFont){
    if(!select)return;
    const old=localStorage.getItem(key)||select.value||defaultFont;
    select.innerHTML='';
    for(const [label,value] of FONTS){const o=document.createElement('option');o.value=value;o.textContent=label;select.appendChild(o)}
    const chosen=FONTS.some(([,v])=>v===old)?old:defaultFont;
    select.value=chosen;
    try{localStorage.setItem(key,chosen)}catch(_){}
    return chosen;
  }

  const lyricsSelect=document.getElementById('hksLyricsFontSelect');
  const brandSelect=document.getElementById('hksCornerBrandFontSelect');
  const lyricsFont=refillSelect(lyricsSelect,'hksLyricsFontFamily',FONTS[0][1]);
  const brandFont=refillSelect(brandSelect,'hksCornerBrandFontFamily',FONTS[0][1]);
  if(lyricsFont)lyrics.style.setProperty('font-family',lyricsFont,'important');
  if(left&&right&&brandFont){left.style.setProperty('font-family',brandFont,'important');right.style.setProperty('font-family',brandFont,'important')}

  // Replace prior change handlers safely by adding v41 handlers that persist/apply the expanded values.
  lyricsSelect?.addEventListener('change',()=>{
    lyrics.style.setProperty('font-family',lyricsSelect.value,'important');
    try{localStorage.setItem('hksLyricsFontFamily',lyricsSelect.value)}catch(_){}
    try{setStatus('פונט מילות הקריוקי שונה')}catch(_){}
  });
  brandSelect?.addEventListener('change',()=>{
    if(left)left.style.setProperty('font-family',brandSelect.value,'important');
    if(right)right.style.setProperty('font-family',brandSelect.value,'important');
    try{localStorage.setItem('hksCornerBrandFontFamily',brandSelect.value)}catch(_){}
    try{setStatus('פונט הכיתוב בצדדים שונה')}catch(_){}
  });

  // Color controls for left/right corner branding and live lyrics.
  let colors=document.getElementById('hksColorControls');
  if(!colors){
    colors=document.createElement('div');
    colors.id='hksColorControls';
    colors.innerHTML=`
      <span style="font-weight:900;font-size:10px">צבעים</span>
      <label class="hksColorPick">ימין <input id="hksBrandRightColor" type="color" aria-label="צבע הכיתוב הימני"></label>
      <label class="hksColorPick">שמאל <input id="hksBrandLeftColor" type="color" aria-label="צבע הכיתוב השמאלי"></label>
      <label class="hksColorPick">ליריקס <input id="hksLyricsColor" type="color" aria-label="צבע מילות הליריקס"></label>
    `;
    const full=document.getElementById('hksBelowFull');
    if(full)toolbar.insertBefore(colors,full);else toolbar.appendChild(colors);
  }

  function bindColor(id,key,target,fallback,label){
    const input=document.getElementById(id);if(!input||!target)return;
    const saved=localStorage.getItem(key)||fallback;
    input.value=/^#[0-9a-f]{6}$/i.test(saved)?saved:fallback;
    target.style.setProperty('color',input.value,'important');
    input.addEventListener('input',()=>{
      target.style.setProperty('color',input.value,'important');
      try{localStorage.setItem(key,input.value)}catch(_){}
      try{setStatus(label+' שונה')}catch(_){}
    });
  }
  bindColor('hksBrandRightColor','hksBrandRightColor',right,'#2584e6','צבע הכיתוב הימני');
  bindColor('hksBrandLeftColor','hksBrandLeftColor',left,'#2584e6','צבע הכיתוב השמאלי');
  bindColor('hksLyricsColor','hksLyricsColor',lyrics,'#ffffff','צבע הליריקס');

  // Move waveform/audio directly below the large preview and put transport controls there too.
  if(wave&&audio){
    const oldCard=wave.closest('.card');
    const previewCard=preview.closest('.card');
    if(oldCard&&previewCard){
      oldCard.id='hksPreviewAudioCard';
      preview.insertAdjacentElement('afterend',oldCard);
      // Keep the settings toolbar below the audio strip.
      oldCard.insertAdjacentElement('afterend',toolbar);

      let transport=document.getElementById('hksAudioTransport');
      if(!transport){transport=document.createElement('div');transport.id='hksAudioTransport';audio.insertAdjacentElement('afterend',transport)}
      ['startBtn','playBtn','stopBtn'].forEach(id=>{const b=document.getElementById(id);if(b)transport.appendChild(b)});
      const clock=document.getElementById('clock');if(clock)oldCard.appendChild(clock);
    }
  }

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.41';
})();
