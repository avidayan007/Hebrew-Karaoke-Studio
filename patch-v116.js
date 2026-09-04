// Avi Karaoke Studio Web v1.116 — whole-app zoom + fit-to-screen
(function(){
  const KEY='hksUiScale116';
  let scale=Math.max(.60,Math.min(1.20,Number(localStorage.getItem(KEY)||1)));

  const host=document.querySelector('header')||document.body;
  let box=document.getElementById('hksUiScale116');
  if(!box){
    box=document.createElement('div');
    box.id='hksUiScale116';
    box.innerHTML=`<span class="lbl">תצוגה</span><button type="button" id="hksUiMinus116">−</button><span id="hksUiVal116">100%</span><button type="button" id="hksUiPlus116">+</button><button type="button" id="hksUiFit116">התאם למסך</button>`;
    host.appendChild(box);
  }

  const style=document.createElement('style');
  style.textContent=`
    #hksUiScale116{display:flex;align-items:center;gap:4px;direction:rtl;margin:4px 6px;padding:4px 6px;border:1px solid #6f4b1a;border-radius:9px;background:#15110b;color:#fff;white-space:nowrap;z-index:50}
    #hksUiScale116 .lbl{font-size:10px;font-weight:900;color:#f2cf79}
    #hksUiScale116 button{height:28px;min-width:30px;padding:0 7px;border-radius:7px;border:1px solid #7b3ca8;background:#24142f;color:#fff;font-size:12px;font-weight:900}
    #hksUiScale116 #hksUiFit116{border-color:#c58b28;background:linear-gradient(180deg,#7a4b09,#3f2504);color:#fff4d5}
    #hksUiVal116{min-width:42px;text-align:center;font-size:11px;font-weight:900;color:#f2cf79;direction:ltr}
    @media(max-width:700px){#hksUiScale116{display:none!important}}
  `;
  document.head.appendChild(style);

  const val=document.getElementById('hksUiVal116');
  function apply(next,save=true){
    scale=Math.max(.60,Math.min(1.20,Math.round(Number(next)*20)/20));
    // CSS zoom changes the actual layout size, so the whole studio can fit on one monitor without vertical scrolling.
    document.body.style.zoom=String(scale);
    if(val)val.textContent=Math.round(scale*100)+'%';
    if(save)localStorage.setItem(KEY,String(scale));
    setTimeout(()=>{try{window.__hksDrawSyncWave?.()}catch(_){}},50);
  }
  function fit(){
    // Measure once at 100%, then choose the largest 5% step that fits the current monitor height.
    document.body.style.zoom='1';
    requestAnimationFrame(()=>{
      const contentH=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,1);
      const target=(window.innerHeight-8)/contentH;
      let chosen=Math.floor(Math.min(1,target)*20)/20;
      chosen=Math.max(.60,Math.min(1,chosen));
      apply(chosen,true);
      window.scrollTo({top:0,left:0,behavior:'instant'});
      try{setStatus(`התצוגה הותאמה למסך: ${Math.round(chosen*100)}%`)}catch(_){}
    });
  }

  document.getElementById('hksUiMinus116').onclick=()=>apply(scale-.05);
  document.getElementById('hksUiPlus116').onclick=()=>apply(scale+.05);
  document.getElementById('hksUiFit116').onclick=fit;
  apply(scale,false);

  window.__hksUiScale116={get scale(){return scale},set:apply,fit};
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.116';
})();