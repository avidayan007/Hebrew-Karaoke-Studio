// Hebrew Karaoke Studio Web v1.47 — editable independent top-corner labels and fonts
(function(){
  const preview=document.getElementById('preview');
  const controls=document.getElementById('hksCornerBrandControls');
  const left=preview?.querySelector('.brandL');
  const right=preview?.querySelector('.brandR');
  if(!preview||!controls||!left||!right)return;

  const KEY_LT='hksBrandLeftText', KEY_RT='hksBrandRightText';
  const KEY_LF='hksBrandLeftFontFamily', KEY_RF='hksBrandRightFontFamily';
  const FONTS=[
    ['David / דוד','David Libre, David, serif'],['Heebo','Heebo, Arial, sans-serif'],
    ['Assistant','Assistant, Arial, sans-serif'],['Rubik','Rubik, Arial, sans-serif'],
    ['Alef','Alef, Arial, sans-serif'],['Frank Ruhl','Frank Ruhl Libre, serif'],
    ['Miriam','Miriam Libre, Arial, sans-serif'],['Noto Sans Hebrew','Noto Sans Hebrew, Arial, sans-serif'],
    ['Secular One','Secular One, Arial, sans-serif'],['Suez One','Suez One, serif'],
    ['Open Sans','Open Sans, Arial, sans-serif'],['Amatic SC','Amatic SC, cursive'],
    ['Arial','Arial, Helvetica, sans-serif'],['Arial Black','Arial Black, Arial, sans-serif'],
    ['Verdana','Verdana, Geneva, sans-serif'],['Tahoma','Tahoma, Arial, sans-serif'],
    ['Trebuchet','Trebuchet MS, Arial, sans-serif'],['Georgia','Georgia, Times New Roman, serif'],
    ['Times','Times New Roman, Times, serif'],['Courier','Courier New, Courier, monospace'],
    ['System','-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif']
  ];

  // Remove the old shared font selector so the two sides can be controlled independently.
  document.getElementById('hksCornerBrandFontWrap')?.remove();

  const style=document.createElement('style');
  style.textContent=`
    #hksCornerEditors{display:flex;gap:5px;flex-wrap:wrap;align-items:center;justify-content:center;width:100%}
    .hksCornerEditor{display:flex;gap:4px;align-items:center;min-width:0}
    .hksCornerEditor>span{font-size:10px;font-weight:900;white-space:nowrap}
    .hksCornerText{height:32px;width:155px;min-width:90px;padding:0 7px;border:1px solid #7890a5;border-radius:7px;background:#20364a;color:#fff;font-size:12px;font-weight:700}
    .hksCornerFont{height:32px;max-width:135px;min-width:100px;padding:0 5px;border:1px solid #7890a5;border-radius:7px;background:#20364a;color:#fff;font-size:12px;font-weight:700}
    @media(max-width:520px){#hksCornerEditors{align-items:stretch}.hksCornerEditor{width:100%}.hksCornerText{flex:1;width:auto}.hksCornerFont{width:125px;max-width:42%}}
  `;
  document.head.appendChild(style);

  let editors=document.getElementById('hksCornerEditors');
  if(!editors){
    editors=document.createElement('div');editors.id='hksCornerEditors';
    editors.innerHTML=`
      <label class="hksCornerEditor"><span>ימין</span><input id="hksBrandRightTextInput" class="hksCornerText" type="text" maxlength="80" aria-label="כיתוב צד ימין"><select id="hksBrandRightFontSelect" class="hksCornerFont" aria-label="פונט צד ימין"></select></label>
      <label class="hksCornerEditor"><span>שמאל</span><input id="hksBrandLeftTextInput" class="hksCornerText" type="text" maxlength="80" aria-label="כיתוב צד שמאל"><select id="hksBrandLeftFontSelect" class="hksCornerFont" aria-label="פונט צד שמאל"></select></label>`;
    controls.appendChild(editors);
  }

  const li=document.getElementById('hksBrandLeftTextInput'), ri=document.getElementById('hksBrandRightTextInput');
  const lf=document.getElementById('hksBrandLeftFontSelect'), rf=document.getElementById('hksBrandRightFontSelect');
  for(const sel of [lf,rf]){
    if(sel&&!sel.options.length)for(const [label,font] of FONTS){const o=document.createElement('option');o.value=font;o.textContent=label;sel.appendChild(o)}
  }
  const validFont=v=>FONTS.some(([,f])=>f===v)?v:FONTS[0][1];
  const oldShared=localStorage.getItem('hksCornerBrandFontFamily');
  let state={
    leftText:localStorage.getItem(KEY_LT)??left.textContent??'Avi Dayan The Show',
    rightText:localStorage.getItem(KEY_RT)??right.textContent??'אבי דיין ההופעה',
    leftFont:validFont(localStorage.getItem(KEY_LF)||oldShared),
    rightFont:validFont(localStorage.getItem(KEY_RF)||oldShared)
  };

  function save(){try{localStorage.setItem(KEY_LT,state.leftText);localStorage.setItem(KEY_RT,state.rightText);localStorage.setItem(KEY_LF,state.leftFont);localStorage.setItem(KEY_RF,state.rightFont)}catch(_){} window.__hksCornerBrandState={...state}}
  function apply(){
    left.textContent=state.leftText;right.textContent=state.rightText;
    left.style.setProperty('font-family',state.leftFont,'important');right.style.setProperty('font-family',state.rightFont,'important');
    if(li)li.value=state.leftText;if(ri)ri.value=state.rightText;if(lf)lf.value=state.leftFont;if(rf)rf.value=state.rightFont;
    save();
  }
  li?.addEventListener('input',()=>{state.leftText=li.value;apply()});
  ri?.addEventListener('input',()=>{state.rightText=ri.value;apply()});
  lf?.addEventListener('change',()=>{state.leftFont=validFont(lf.value);apply()});
  rf?.addEventListener('change',()=>{state.rightFont=validFont(rf.value);apply()});
  // Do not let Space trigger global sync while editing either corner label.
  [li,ri].forEach(el=>el?.addEventListener('keydown',e=>{if(e.code==='Space'||e.key===' ')e.stopPropagation()}));

  // Keep edited text and fonts in exported video too.
  try{
    const originalBuildAss=window.buildAss;
    if(typeof originalBuildAss==='function'&&!originalBuildAss.__hksCorner47){
      const wrapped=function(duration){
        let ass=originalBuildAss(duration), s=window.__hksCornerBrandState||state;
        const fontName=f=>String(f||'Arial').split(',')[0].replace(/["']/g,'').trim();
        ass=ass.replace(/(Style:\s*BrandL,)[^,]+,/i,`$1${fontName(s.leftFont)},`);
        ass=ass.replace(/(Style:\s*BrandR,)[^,]+,/i,`$1${fontName(s.rightFont)},`);
        ass=ass.replace(/(Dialogue:\s*0,[^\n]*?,BrandL,[^\n]*?,,)[^\n]*/i,`$1${assEscape(s.leftText)}`);
        ass=ass.replace(/(Dialogue:\s*0,[^\n]*?,BrandR,[^\n]*?,,)[^\n]*/i,`$1${assEscape(s.rightText)}`);
        return ass;
      };
      wrapped.__hksCorner47=true;window.buildAss=wrapped;
    }
  }catch(e){console.warn('[v47 corner branding export]',e)}

  apply();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.47';
})();
