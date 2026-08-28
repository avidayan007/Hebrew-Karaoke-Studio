// Hebrew Karaoke Studio Web v1.35 — live lyrics font-size controls
(function(){
  const preview=document.getElementById('preview');
  const lyrics=document.getElementById('lyricsPreview');
  if(!preview||!lyrics)return;

  const KEY='hksLyricsFontSizePx';
  const MIN=18, MAX=110, STEP=4, DEFAULT=48;

  const style=document.createElement('style');
  style.textContent=`
    #hksFontControls{
      position:absolute;z-index:2147483600;right:10px;bottom:10px;
      display:flex;align-items:center;gap:6px;padding:6px;border-radius:14px;
      background:#000c;border:1px solid #ffffff66;box-shadow:0 2px 10px #0008;
      direction:ltr;-webkit-tap-highlight-color:transparent;
    }
    #hksFontControls button{
      min-width:44px;min-height:44px;padding:0 10px;border:1px solid #ffffff66;border-radius:10px;
      background:#20364acc;color:#fff;font-size:20px;font-weight:900;line-height:1;cursor:pointer;
    }
    #hksFontControls button:active{transform:scale(.96)}
    #hksFontValue{
      min-width:58px;text-align:center;color:#fff;font-size:12px;font-weight:800;direction:rtl;
    }
    #preview.hksPhoneFullscreen #hksFontControls{
      right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));
    }
    #preview.hksPhoneFullscreen #lyricsPreview{width:94%!important}
    @media(max-width:520px){
      #hksFontControls{right:7px;bottom:7px;padding:5px;gap:4px}
      #hksFontControls button{min-width:42px;min-height:42px;padding:0 8px}
      #hksFontValue{min-width:50px;font-size:11px}
    }
  `;
  document.head.appendChild(style);

  let controls=document.getElementById('hksFontControls');
  if(!controls){
    controls=document.createElement('div');
    controls.id='hksFontControls';
    controls.setAttribute('role','group');
    controls.setAttribute('aria-label','שליטה בגודל מילות הקריוקי');
    controls.innerHTML=`
      <button type="button" id="hksFontMinus" aria-label="הקטן אותיות" title="הקטן אותיות">A−</button>
      <span id="hksFontValue">48px</span>
      <button type="button" id="hksFontPlus" aria-label="הגדל אותיות" title="הגדל אותיות">A+</button>
    `;
    preview.appendChild(controls);
  }

  const minus=document.getElementById('hksFontMinus');
  const plus=document.getElementById('hksFontPlus');
  const value=document.getElementById('hksFontValue');

  function clamp(n){return Math.max(MIN,Math.min(MAX,Math.round(n)))}
  function read(){
    const saved=Number(localStorage.getItem(KEY));
    if(Number.isFinite(saved)&&saved>=MIN&&saved<=MAX)return saved;
    const css=parseFloat(getComputedStyle(lyrics).fontSize);
    return clamp(Number.isFinite(css)?css:DEFAULT);
  }
  let size=read();

  function apply(next,announce){
    size=clamp(next);
    lyrics.style.setProperty('font-size',size+'px','important');
    if(value)value.textContent=size+'px';
    try{localStorage.setItem(KEY,String(size))}catch(_){}
    if(announce){try{setStatus('גודל אותיות בתצוגה: '+size+'px')}catch(_){}}
  }

  function stop(e){e.preventDefault();e.stopPropagation()}
  minus?.addEventListener('click',e=>{stop(e);apply(size-STEP,true)});
  plus?.addEventListener('click',e=>{stop(e);apply(size+STEP,true)});

  // Double tap the size readout to restore the original size.
  value?.addEventListener('dblclick',e=>{stop(e);apply(DEFAULT,true)});

  apply(size,false);

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.35';
})();
