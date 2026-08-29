// Avi Karaoke Studio Web v1.97 — control outline color/thickness around top corner branding text
(function(){
  const preview=document.getElementById('preview');
  const controls=document.getElementById('hksCornerBrandControls');
  const left=preview?.querySelector('.brandL');
  const right=preview?.querySelector('.brandR');
  if(!preview||!controls||!left||!right)return;

  const KEY_COLOR='hksBrandOutlineColor97';
  const KEY_SIZE='hksBrandOutlineSize97';
  let outlineColor=localStorage.getItem(KEY_COLOR)||'#ffffff';
  let outlineSize=Math.max(0,Math.min(6,Number(localStorage.getItem(KEY_SIZE)||1)));

  let panel=document.getElementById('hksBrandOutlineControls97');
  if(!panel){
    panel=document.createElement('div');
    panel.id='hksBrandOutlineControls97';
    panel.innerHTML=`
      <span class="hksOutlineTitle97">מסגרת סביב הכיתוב העליון</span>
      <label>צבע <input id="hksBrandOutlineColor97" type="color"></label>
      <label>עובי <input id="hksBrandOutlineSize97" type="range" min="0" max="6" step="0.5"><strong id="hksBrandOutlineValue97"></strong></label>
    `;
    controls.appendChild(panel);
  }

  const colorInput=document.getElementById('hksBrandOutlineColor97');
  const sizeInput=document.getElementById('hksBrandOutlineSize97');
  const value=document.getElementById('hksBrandOutlineValue97');

  const style=document.createElement('style');
  style.id='hksBrandOutlineStyle97';
  style.textContent=`
    #hksBrandOutlineControls97{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;width:100%;margin-top:6px;padding-top:7px;border-top:1px solid rgba(216,174,85,.28)}
    #hksBrandOutlineControls97 .hksOutlineTitle97{font-size:11px;font-weight:900;color:#f2cf79}
    #hksBrandOutlineControls97 label{display:flex;gap:5px;align-items:center;font-size:11px;font-weight:800;color:#f4f1f7}
    #hksBrandOutlineColor97{width:38px;height:28px;padding:1px;border:1px solid #d8ae55;border-radius:6px;background:#15131a}
    #hksBrandOutlineSize97{width:110px;accent-color:#d8ae55}
    #hksBrandOutlineValue97{min-width:28px;color:#f2cf79;font-size:11px}
  `;
  document.head.appendChild(style);

  function shadowFor(size,color){
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

  function apply(){
    const shadow=shadowFor(outlineSize,outlineColor);
    [left,right].forEach(el=>el.style.setProperty('text-shadow',shadow,'important'));
    if(colorInput)colorInput.value=outlineColor;
    if(sizeInput)sizeInput.value=String(outlineSize);
    if(value)value.textContent=outlineSize+'px';
    try{localStorage.setItem(KEY_COLOR,outlineColor);localStorage.setItem(KEY_SIZE,String(outlineSize))}catch(_){}
    window.__hksBrandOutline97={color:outlineColor,size:outlineSize};
  }

  colorInput?.addEventListener('input',()=>{outlineColor=colorInput.value;apply()});
  sizeInput?.addEventListener('input',()=>{outlineSize=Number(sizeInput.value)||0;apply()});

  // Try to carry the same outline settings into ASS export BrandL/BrandR styles.
  try{
    const originalBuildAss=window.buildAss;
    if(typeof originalBuildAss==='function'&&!originalBuildAss.__hksOutline97){
      const wrapped=function(duration){
        let ass=originalBuildAss(duration);
        const s=window.__hksBrandOutline97||{color:outlineColor,size:outlineSize};
        const hex=String(s.color||'#ffffff').replace('#','');
        const rr=hex.slice(0,2),gg=hex.slice(2,4),bb=hex.slice(4,6);
        const assColor=`&H00${bb}${gg}${rr}`.toUpperCase();
        const width=Math.max(0,Math.round(Number(s.size)||0));
        ass=ass.replace(/^(Style:\s*BrandL,[^\n]*)$/gmi,line=>{const p=line.split(',');if(p.length>17){p[3]=assColor;p[16]=String(width);return p.join(',')}return line});
        ass=ass.replace(/^(Style:\s*BrandR,[^\n]*)$/gmi,line=>{const p=line.split(',');if(p.length>17){p[3]=assColor;p[16]=String(width);return p.join(',')}return line});
        return ass;
      };
      wrapped.__hksOutline97=true;window.buildAss=wrapped;
    }
  }catch(e){console.warn('[v97 brand outline export]',e)}

  apply();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.97';
  console.log('[v97] Corner branding outline controls enabled');
})();