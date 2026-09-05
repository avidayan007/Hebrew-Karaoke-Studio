// Avi Karaoke Studio Web v1.155 — Export Preview is the single source of truth for iPhone rendering
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const $=s=>document.querySelector(s);
  const exportPage=$('#export'),renderBtn=$('#dualExportBtn'),sourcePreview=$('#preview'),sourceLyrics=$('#lyricsPreview');
  if(!exportPage||!renderBtn||!sourcePreview||!sourceLyrics)return;
  window.__hksExportComposerParity155=true;

  const KEY='hksExportComposer155';
  const clone=v=>{try{return structuredClone(v)}catch(_){return JSON.parse(JSON.stringify(v))}};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
  const num=v=>Number.isFinite(parseFloat(v))?parseFloat(v):0;
  const saved=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){return null}})();
  let state={
    lyricsPx:clamp(saved?.lyricsPx||76,24,180),
    brandPx:clamp(saved?.brandPx||26,10,80),
    titlePx:clamp(saved?.titlePx||92,28,220),
    lyricsY:clamp(saved?.lyricsY??.58,.25,.82),
    titleY:clamp(saved?.titleY??.50,.20,.80),
    mode:saved?.mode==='title'?'title':'lyrics'
  };
  let previewUrl='',renderTimer=0,renderSeq=0,lastActual=null;

  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){} }
  function linesPerScreen(){
    const n=Number(window.__hksLyricsLayout99?.linesPerScreen||localStorage.getItem('hksLyricsLinesPerScreen99')||4);
    return [4,5,6].includes(n)?n:4;
  }
  function rawLines(){return String($('#lyricsText')?.value||'').replace(/\r/g,'').split('\n')}
  function firstTimed(){try{const w=(Array.isArray(words)?words:[]).find(x=>x&&x.time!=null&&Number.isFinite(Number(x.time)));return w?Number(w.time):0}catch(_){return 0}}
  function rowsForPreview(){
    const all=rawLines(),n=linesPerScreen();let start=0;
    try{
      const arr=Array.isArray(words)?words:[],t=Number($('#audio')?.currentTime)||0;
      let idx=-1;for(let i=0;i<arr.length;i++){const wt=Number(arr[i]?.time);if(Number.isFinite(wt)&&wt<=t)idx=i}
      if(idx>=0)start=Math.floor((Number(arr[idx]?.line)||0)/n)*n;
    }catch(_){}
    const out=[];for(let i=0;i<n;i++)out.push(all[start+i]??'');
    return out;
  }
  function titleText(){return String(window.__hksSongTitleState?.text||$('#hksSongTitleInput')?.value||$('#hksSongTitleText')?.textContent||'').trim()}
  function sourceLineRatio(){
    const cs=getComputedStyle(sourceLyrics),fs=num(cs.fontSize),lh=num(cs.lineHeight);
    return fs>0&&lh>0?lh/fs:1.15;
  }
  function metrics(){
    const left=sourcePreview.querySelector('.brandL'),right=sourcePreview.querySelector('.brandR');
    const lcs=left?getComputedStyle(left):null,rcs=right?getComputedStyle(right):null,tel=$('#hksSongTitleText'),tcs=tel?getComputedStyle(tel):null;
    return {
      width:1280,height:720,source:'export-preview-v155',capturedAt:Date.now(),
      lyrics:{fontH:state.lyricsPx/720,lineRatio:sourceLineRatio(),left:.04,right:.04,top:state.lyricsY,centerX:.5,centerY:state.lyricsY,width:.92,textShadow:getComputedStyle(sourceLyrics).textShadow||'none'},
      brandL:{fontH:state.brandPx/720,lineRatio:1,left:.025,right:0,top:.025,centerX:.025,centerY:.025+state.brandPx/1440,width:.45,textShadow:lcs?.textShadow||'none'},
      brandR:{fontH:state.brandPx/720,lineRatio:1,left:0,right:.025,top:.025,centerX:.975,centerY:.025+state.brandPx/1440,width:.45,textShadow:rcs?.textShadow||'none'},
      title:{fontH:state.titlePx/720,lineRatio:(()=>{const fs=num(tcs?.fontSize),lh=num(tcs?.lineHeight);return fs>0&&lh>0?lh/fs:1.12})(),left:.03,right:.03,top:state.titleY,centerX:.5,centerY:state.titleY,width:.94,textShadow:tcs?.textShadow||'none'}
    };
  }

  function inject(){
    const m=metrics();
    window.__hksPreviewMetrics152=clone(m);
    window.__hksExportComposerMetrics155=clone(m);
    try{window.__hksRenderMobile153?.capture?.()}catch(e){console.warn('[v155 capture renderer]',e)}
    return m;
  }

  let box=$('#hksExportComposer155');
  if(!box){
    box=document.createElement('div');box.id='hksExportComposer155';
    box.innerHTML=`
      <div class="hks155Head"><strong>תצוגה מדויקת לפני רינדור</strong><span>מה שאתה רואה כאן = מה שיוצא בקובץ</span></div>
      <div id="hksRenderStage155">
        <img id="hksRenderBg155" alt=""><video id="hksRenderVideo155" muted playsinline></video><img id="hksRenderOverlay155" alt="תצוגת שכבת הרינדור">
        <div id="hksRenderEmpty155">טען רקע ומילים כדי לראות את התוצאה</div>
      </div>
      <div class="hks155Modes"><button type="button" id="hksShowLyrics155">מילים</button><button type="button" id="hksShowTitle155">שם השיר</button></div>
      <div class="hks155Controls">
        <label><span>גודל מילים</span><button type="button" data-minus="lyricsPx">−</button><input id="hksLyricsRenderPx155" type="number" min="24" max="180" step="1"><button type="button" data-plus="lyricsPx">+</button><small>px ב־720p</small></label>
        <label><span>מיקום מילים</span><input id="hksLyricsY155" type="range" min="25" max="82" step="1"><b id="hksLyricsYVal155"></b></label>
        <label><span>גודל שם השיר</span><button type="button" data-minus="titlePx">−</button><input id="hksTitleRenderPx155" type="number" min="28" max="220" step="1"><button type="button" data-plus="titlePx">+</button><small>px ב־720p</small></label>
        <label><span>מיקום שם השיר</span><input id="hksTitleY155" type="range" min="20" max="80" step="1"><b id="hksTitleYVal155"></b></label>
        <label><span>גודל כיתוב עליון</span><button type="button" data-minus="brandPx">−</button><input id="hksBrandRenderPx155" type="number" min="10" max="80" step="1"><button type="button" data-plus="brandPx">+</button><small>px ב־720p</small></label>
        <label class="hks155Lines"><span>שורות במסך</span><button type="button" data-lines="4">4</button><button type="button" data-lines="5">5</button><button type="button" data-lines="6">6</button></label>
      </div>`;
    const estimate=$('#hksExportSizeEstimate127');
    if(estimate)estimate.insertAdjacentElement('beforebegin',box);else renderBtn.insertAdjacentElement('beforebegin',box);
  }

  if(!$('#hksExportComposerStyle155')){
    const st=document.createElement('style');st.id='hksExportComposerStyle155';st.textContent=`
      #hksExportComposer155{margin:8px 0 10px;padding:9px;border:1px solid #785a20;border-radius:12px;background:#080d14}
      #hksExportComposer155 .hks155Head{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:7px}
      #hksExportComposer155 .hks155Head strong{font-size:13px;color:#f3cd72}#hksExportComposer155 .hks155Head span{font-size:10px;color:#c7d3df;font-weight:800}
      #hksRenderStage155{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:10px;border:1px solid #40556a;background:#000;display:flex;align-items:center;justify-content:center}
      #hksRenderStage155>img,#hksRenderStage155>video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
      #hksRenderOverlay155{z-index:3;object-fit:fill!important;pointer-events:none}#hksRenderBg155,#hksRenderVideo155{z-index:1}#hksRenderVideo155{display:none}
      #hksRenderEmpty155{z-index:0;color:#70869a;font-size:11px;font-weight:800}
      .hks155Modes{display:flex;gap:6px;justify-content:center;margin:7px 0}.hks155Modes button{height:30px;padding:0 13px;border:1px solid #6f8296;border-radius:8px;background:#18293a;color:#fff;font-weight:900}.hks155Modes button.on{background:#6d3b91;border-color:#b679d0}
      .hks155Controls{display:grid;grid-template-columns:1fr 1fr;gap:6px}.hks155Controls label{min-height:38px;display:flex;align-items:center;gap:5px;padding:4px 6px;border:1px solid #263b4d;border-radius:8px;background:#101b26;color:#e7eef5;font-size:10px;font-weight:800}
      .hks155Controls label>span{min-width:78px}.hks155Controls input[type=number]{width:55px;height:29px;border:1px solid #647d92;border-radius:6px;background:#1b3043;color:#fff;text-align:center;font-weight:900}.hks155Controls input[type=range]{flex:1;min-width:70px}.hks155Controls button{width:29px;height:29px;padding:0;border:1px solid #79608b;border-radius:6px;background:#2c1c39;color:#fff;font-size:17px;font-weight:900}.hks155Controls small{font-size:8px;color:#93a8ba}.hks155Controls b{min-width:34px;text-align:left;color:#f2cf79;font-size:9px}.hks155Lines button.on{background:#9a6916;border-color:#e1b653}
      @media(max-width:620px){.hks155Controls{grid-template-columns:1fr}.hks155Controls label>span{min-width:92px}#hksExportComposer155{padding:7px}}
    `;document.head.appendChild(st);
  }

  const stage=$('#hksRenderStage155'),bg=$('#hksRenderBg155'),vid=$('#hksRenderVideo155'),ov=$('#hksRenderOverlay155'),empty=$('#hksRenderEmpty155');
  const inputs={lyricsPx:$('#hksLyricsRenderPx155'),brandPx:$('#hksBrandRenderPx155'),titlePx:$('#hksTitleRenderPx155'),lyricsY:$('#hksLyricsY155'),titleY:$('#hksTitleY155')};

  function syncControls(){
    inputs.lyricsPx.value=String(Math.round(state.lyricsPx));inputs.brandPx.value=String(Math.round(state.brandPx));inputs.titlePx.value=String(Math.round(state.titlePx));
    inputs.lyricsY.value=String(Math.round(state.lyricsY*100));inputs.titleY.value=String(Math.round(state.titleY*100));
    $('#hksLyricsYVal155').textContent=Math.round(state.lyricsY*100)+'%';$('#hksTitleYVal155').textContent=Math.round(state.titleY*100)+'%';
    $('#hksShowLyrics155')?.classList.toggle('on',state.mode==='lyrics');$('#hksShowTitle155')?.classList.toggle('on',state.mode==='title');
    box.querySelectorAll('[data-lines]').forEach(b=>b.classList.toggle('on',Number(b.dataset.lines)===linesPerScreen()));
  }
  function syncBackground(){
    const simg=$('#bgImg'),svid=$('#bgVideo');
    const hasImg=!!(simg&&!simg.hidden&&simg.src),hasVid=!!(svid&&!svid.hidden&&svid.src);
    if(hasVid){
      if(vid.src!==svid.src)vid.src=svid.src;vid.style.display='block';bg.style.display='none';empty.style.display='none';
      try{if(Number.isFinite(svid.currentTime)&&Math.abs((vid.currentTime||0)-svid.currentTime)>.2)vid.currentTime=svid.currentTime}catch(_){}
      try{vid.pause()}catch(_){}
    }else if(hasImg){bg.src=simg.src;bg.style.display='block';vid.style.display='none';empty.style.display='none'}
    else{bg.style.display='none';vid.style.display='none';empty.style.display='block'}
  }
  function previewSlide(){
    if(state.mode==='title')return {kind:'title',title:titleText(),lines:[]};
    return {kind:'lyrics',title:'',lines:rowsForPreview()};
  }
  async function renderPreview(){
    if(!exportPage.classList.contains('on'))return false;
    syncControls();syncBackground();inject();
    const api=window.__hksRenderMobile153;if(!api?.makeOverlayBlob)return false;
    const seq=++renderSeq;
    try{
      const blob=await api.makeOverlayBlob(previewSlide(),{width:1280,height:720,fps:30});
      if(seq!==renderSeq)return false;
      const url=URL.createObjectURL(blob);if(previewUrl)try{URL.revokeObjectURL(previewUrl)}catch(_){}previewUrl=url;ov.src=url;ov.style.display='block';
      lastActual=clone(window.__hksLastMobileOverlay153||null);window.__hksExportPreviewActual155=clone(lastActual);
      return true;
    }catch(e){console.warn('[v155 export preview]',e);return false}
  }
  function schedule(ms=90){clearTimeout(renderTimer);renderTimer=setTimeout(renderPreview,ms)}
  function commit(key,value){
    if(key==='lyricsPx')state.lyricsPx=clamp(value,24,180);
    if(key==='brandPx')state.brandPx=clamp(value,10,80);
    if(key==='titlePx')state.titlePx=clamp(value,28,220);
    if(key==='lyricsY')state.lyricsY=clamp(value/100,.25,.82);
    if(key==='titleY')state.titleY=clamp(value/100,.20,.80);
    save();syncControls();schedule(60);
  }

  inputs.lyricsPx.oninput=()=>commit('lyricsPx',inputs.lyricsPx.value);inputs.brandPx.oninput=()=>commit('brandPx',inputs.brandPx.value);inputs.titlePx.oninput=()=>commit('titlePx',inputs.titlePx.value);
  inputs.lyricsY.oninput=()=>commit('lyricsY',inputs.lyricsY.value);inputs.titleY.oninput=()=>commit('titleY',inputs.titleY.value);
  box.querySelectorAll('[data-minus],[data-plus]').forEach(b=>b.onclick=()=>{
    const key=b.dataset.minus||b.dataset.plus,delta=b.dataset.plus?1:-1;commit(key,Number(state[key])+delta);
  });
  $('#hksShowLyrics155').onclick=()=>{state.mode='lyrics';save();syncControls();schedule(0)};
  $('#hksShowTitle155').onclick=()=>{state.mode='title';save();syncControls();schedule(0)};
  box.querySelectorAll('[data-lines]').forEach(b=>b.onclick=()=>{
    const n=Number(b.dataset.lines),src=$(`#hksLinesPerScreen99 button[data-lines="${n}"]`);if(src)src.click();else try{localStorage.setItem('hksLyricsLinesPerScreen99',String(n))}catch(_){}
    syncControls();schedule(40);
  });

  // The renderer must always receive the Export Preview metrics LAST, after older fullscreen hooks.
  ['dualExportBtn','exportSetupStart'].forEach(id=>{
    const el=$('#'+id);if(!el)return;
    ['pointerdown','click'].forEach(evt=>el.addEventListener(evt,()=>{inject();try{window.__hksRenderMobile153?.capture?.()}catch(_){}},true));
  });
  document.querySelectorAll('[data-go="export"],.tab[data-page="export"]').forEach(el=>el.addEventListener('click',()=>setTimeout(()=>{syncControls();syncBackground();schedule(20)},80)));
  $('#audio')?.addEventListener('timeupdate',()=>{if(exportPage.classList.contains('on')&&state.mode==='lyrics')schedule(140)});
  $('#audio')?.addEventListener('seeked',()=>{if(exportPage.classList.contains('on')&&state.mode==='lyrics')schedule(30)});
  ['hksSongTitleInput','hksBrandLeftTextInput','hksBrandRightTextInput','hksLyricsFontSelect','hksSongTitleFont','hksBrandLeftFontSelect','hksBrandRightFontSelect','hksLyricsColor','hksBrandLeftColor','hksBrandRightColor','hksSongTitleColor'].forEach(id=>{
    const el=$('#'+id);['input','change'].forEach(evt=>el?.addEventListener(evt,()=>schedule(80)));
  });

  window.__hksExportComposer155={
    inject,renderPreview,get metrics(){return clone(metrics())},get state(){return clone(state)},
    set(key,value){commit(key,value)},showLyrics(){state.mode='lyrics';save();return renderPreview()},showTitle(){state.mode='title';save();return renderPreview()},
    get lastActual(){return clone(lastActual)}
  };
  syncControls();
  if(exportPage.classList.contains('on'))schedule(50);
  const ver=$('.version');if(ver)ver.textContent='Web v1.155';
  try{setStatus('v1.155 מוכן — מסך ה-Export הוא עכשיו מקור הגדלים והמיקומים של הרינדור.')}catch(_){}
})();
