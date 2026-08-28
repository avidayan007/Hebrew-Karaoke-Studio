// Hebrew Karaoke Studio Web v1.42 — song-title intro slide until the first synced word
(function(){
  const preview=document.getElementById('preview');
  const toolbar=document.getElementById('hksPreviewToolbar');
  if(!preview||!toolbar)return;

  const KEY_TEXT='hksSongTitleText';
  const KEY_FONT='hksSongTitleFontFamily';
  const KEY_COLOR='hksSongTitleColor';
  const KEY_SIZE='hksSongTitleSizePx';
  const MIN=28,MAX=140,STEP=1,DEFAULT_SIZE=72;
  const FONTS=[
    ['David / דוד','David Libre, David, serif'],
    ['Frank Ruhl','Frank Ruhl Libre, serif'],
    ['Suez One','Suez One, serif'],
    ['Heebo','Heebo, Arial, sans-serif'],
    ['Assistant','Assistant, Arial, sans-serif'],
    ['Rubik','Rubik, Arial, sans-serif'],
    ['Alef','Alef, Arial, sans-serif'],
    ['Miriam','Miriam Libre, Arial, sans-serif'],
    ['Noto Sans Hebrew','Noto Sans Hebrew, Arial, sans-serif'],
    ['Secular One','Secular One, Arial, sans-serif'],
    ['Open Sans','Open Sans, Arial, sans-serif'],
    ['Amatic SC','Amatic SC, cursive'],
    ['Arial','Arial, Helvetica, sans-serif'],
    ['Arial Black','Arial Black, Arial, sans-serif'],
    ['Georgia','Georgia, Times New Roman, serif'],
    ['Times','Times New Roman, Times, serif']
  ];

  const style=document.createElement('style');
  style.textContent=`
    #hksSongTitleSlide{position:absolute;z-index:2;inset:0;display:flex;align-items:center;justify-content:center;
      padding:11% 7% 8%;text-align:center;direction:rtl;pointer-events:none;
      background:radial-gradient(circle at center,#06101a55 0%,#06101a33 42%,#0000001f 72%,#00000045 100%);
      opacity:1;transition:opacity .18s ease}
    #hksSongTitleSlide[hidden]{display:none!important}
    #hksSongTitleFrame{position:relative;max-width:90%;padding:24px 38px 22px;border-radius:24px;
      background:linear-gradient(135deg,#06101aa8,#12263ab8);border:1px solid #ffffff55;
      box-shadow:0 12px 38px #0009,inset 0 0 34px #ffffff0c}
    #hksSongTitleFrame:before,#hksSongTitleFrame:after{content:'';position:absolute;left:12%;right:12%;height:2px;
      background:linear-gradient(90deg,transparent,#ffffff99,transparent)}
    #hksSongTitleFrame:before{top:12px}#hksSongTitleFrame:after{bottom:12px}
    #hksSongTitleNote{font-size:22px;line-height:1;margin-bottom:8px;color:#ffffffcc;text-shadow:0 2px 8px #000}
    #hksSongTitleText{font-weight:900;line-height:1.12;overflow-wrap:anywhere;text-shadow:0 3px 4px #000,0 0 18px currentColor}

    #hksSongTitleControls{display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap;direction:rtl;
      min-height:38px;padding:3px 6px;border:1px solid #3b5368;border-radius:10px;background:#102233;color:#fff}
    #hksSongTitleInput{height:32px;min-width:190px;max-width:300px;padding:0 8px;border:1px solid #7890a5;border-radius:7px;
      background:#20364a;color:#fff;font-size:13px;font-weight:700;direction:rtl}
    #hksSongTitleFont{height:32px;max-width:140px;padding:0 5px;border:1px solid #7890a5;border-radius:7px;
      background:#20364a;color:#fff;font-size:12px;font-weight:700}
    #hksSongTitleControls button{min-width:32px!important;min-height:32px!important;height:32px!important;padding:0 5px!important;
      border:1px solid #7890a5;border-radius:7px;background:#20364a;color:#fff;font-size:13px!important;font-weight:900}
    #hksSongTitleSize{min-width:38px;text-align:center;font-size:10px;font-weight:800;direction:ltr}
    #hksSongTitleColor{width:32px;height:28px;min-height:28px;padding:1px;margin:0;border:1px solid #7890a5;border-radius:7px;background:#20364a}
    .hksSongTiny{font-size:10px;font-weight:800;white-space:nowrap;display:flex;align-items:center;gap:3px}
    body.hksPreviewFullscreenOpen #hksSongTitleControls{display:none!important}
    @media(max-width:520px){
      #hksSongTitleFrame{max-width:94%;padding:18px 22px 17px;border-radius:18px}
      #hksSongTitleControls{width:100%}
      #hksSongTitleInput{flex:1;min-width:150px;max-width:none}
      #hksSongTitleFont{max-width:125px}
    }
  `;
  document.head.appendChild(style);

  let slide=document.getElementById('hksSongTitleSlide');
  if(!slide){
    slide=document.createElement('div');slide.id='hksSongTitleSlide';
    slide.innerHTML='<div id="hksSongTitleFrame"><div id="hksSongTitleNote">♪</div><div id="hksSongTitleText"></div></div>';
    const lyrics=document.getElementById('lyricsPreview');
    if(lyrics)preview.insertBefore(slide,lyrics);else preview.appendChild(slide);
  }

  let controls=document.getElementById('hksSongTitleControls');
  if(!controls){
    controls=document.createElement('div');controls.id='hksSongTitleControls';
    controls.innerHTML=`
      <span style="font-weight:900;font-size:10px">שם השיר</span>
      <input id="hksSongTitleInput" type="text" maxlength="120" placeholder="כתוב כאן את שם השיר" aria-label="שם השיר">
      <select id="hksSongTitleFont" aria-label="פונט שם השיר"></select>
      <button type="button" id="hksSongTitleMinus" aria-label="הקטן שם השיר">A−</button>
      <span id="hksSongTitleSize">72px</span>
      <button type="button" id="hksSongTitlePlus" aria-label="הגדל שם השיר">A+</button>
      <label class="hksSongTiny">צבע <input id="hksSongTitleColor" type="color" aria-label="צבע שם השיר"></label>`;
    toolbar.insertBefore(controls,toolbar.firstChild);
  }

  const titleEl=document.getElementById('hksSongTitleText');
  const input=document.getElementById('hksSongTitleInput');
  const fontSel=document.getElementById('hksSongTitleFont');
  const minus=document.getElementById('hksSongTitleMinus');
  const plus=document.getElementById('hksSongTitlePlus');
  const sizeEl=document.getElementById('hksSongTitleSize');
  const colorEl=document.getElementById('hksSongTitleColor');

  for(const [label,value] of FONTS){const o=document.createElement('option');o.value=value;o.textContent=label;fontSel.appendChild(o)}
  const validFont=v=>FONTS.some(([,x])=>x===v)?v:FONTS[0][1];
  const clamp=n=>Math.max(MIN,Math.min(MAX,Math.round(Number(n)||DEFAULT_SIZE)));
  let state={
    text:localStorage.getItem(KEY_TEXT)||'',
    font:validFont(localStorage.getItem(KEY_FONT)),
    color:/^#[0-9a-f]{6}$/i.test(localStorage.getItem(KEY_COLOR)||'')?localStorage.getItem(KEY_COLOR):'#ffffff',
    size:clamp(localStorage.getItem(KEY_SIZE)||DEFAULT_SIZE)
  };
  window.__hksSongTitleState=state;

  function firstWordSynced(){
    try{return Array.isArray(words)&&words.length>0&&Number.isFinite(words[0]?.time)}catch(_){return false}
  }
  function apply(){
    titleEl.textContent=state.text;
    titleEl.style.setProperty('font-family',state.font,'important');
    titleEl.style.setProperty('font-size',state.size+'px','important');
    titleEl.style.setProperty('color',state.color,'important');
    input.value=state.text;fontSel.value=state.font;colorEl.value=state.color;sizeEl.textContent=state.size+'px';
    slide.hidden=!state.text.trim()||firstWordSynced();
  }
  function save(){
    try{localStorage.setItem(KEY_TEXT,state.text);localStorage.setItem(KEY_FONT,state.font);localStorage.setItem(KEY_COLOR,state.color);localStorage.setItem(KEY_SIZE,String(state.size))}catch(_){}
    window.__hksSongTitleState=state;
  }
  function updateVisibility(){slide.hidden=!state.text.trim()||firstWordSynced()}

  input.addEventListener('input',()=>{state.text=input.value;save();apply()});
  fontSel.addEventListener('change',()=>{state.font=validFont(fontSel.value);save();apply()});
  colorEl.addEventListener('input',()=>{state.color=colorEl.value;save();apply()});
  minus.addEventListener('click',()=>{state.size=clamp(state.size-STEP);save();apply()});
  plus.addEventListener('click',()=>{state.size=clamp(state.size+STEP);save();apply()});

  // Syncing the first word hides the title immediately. Undo/reset can show it again if word 1 is unsynced.
  ['syncBtn','syncBtn2','undoBtn','resetBtn','startBtn','startBtn2','prepareBtn'].forEach(id=>{
    document.getElementById(id)?.addEventListener('click',()=>setTimeout(updateVisibility,0));
  });
  document.addEventListener('keydown',e=>{if(e.code==='Space')setTimeout(updateVisibility,0)});
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(updateVisibility,80));

  // Add the title slide to exported ASS video from 00:00 until the first synced word.
  try{
    const originalBuildAss=window.buildAss;
    if(typeof originalBuildAss==='function'&&!originalBuildAss.__hksTitle42){
      const wrapped=function(duration){
        let ass=originalBuildAss(duration);
        const text=(window.__hksSongTitleState?.text||'').trim();
        let end=0;try{end=Array.isArray(words)&&Number.isFinite(words[0]?.time)?Number(words[0].time):0}catch(_){}
        if(!text||!(end>0))return ass;
        const s=window.__hksSongTitleState||state;
        const rgb=(s.color||'#ffffff').replace('#','');
        const rr=rgb.slice(0,2),gg=rgb.slice(2,4),bb=rgb.slice(4,6);
        const assColor='&H00'+bb+gg+rr;
        const fontName=String(s.font||'David Libre').split(',')[0].replace(/["']/g,'').trim();
        const fs=Math.max(30,Math.min(150,Math.round(Number(s.size)||72)));
        const styleLine=`Style: SongTitle,${fontName},${fs},${assColor},${assColor},&H00000000,&H66000000,-1,0,0,0,100,100,0,0,1,5,2,5,90,90,40,1`;
        ass=ass.replace('\n[Events]','\n'+styleLine+'\n\n[Events]');
        const event=`Dialogue: 2,0:00:00.00,${assTime(end)},SongTitle,,0,0,0,,${assEscape(text)}`;
        const marker='Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n';
        ass=ass.replace(marker,marker+event+'\n');
        return ass;
      };
      wrapped.__hksTitle42=true;window.buildAss=wrapped;
    }
  }catch(e){console.warn('[v42 title export]',e)}

  apply();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.42';
})();
