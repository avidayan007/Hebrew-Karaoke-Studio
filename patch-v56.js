// Hebrew Karaoke Studio Web v1.56 — visible waveform with editable sync markers
(function(){
  const syncPage=document.getElementById('sync');
  const wordList=document.getElementById('wordList');
  const audioEl=document.getElementById('audio');
  const mainWave=document.getElementById('wave');
  if(!syncPage||!wordList||!audioEl)return;

  const style=document.createElement('style');
  style.textContent=`
    #hksSyncWaveEditor{margin:8px 0 10px;padding:8px;border:1px solid #31485c;border-radius:10px;background:#08131f}
    #hksSyncWaveEditor .hksWaveTitle{font-size:12px;font-weight:900;margin-bottom:5px;display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap}
    #hksSyncWaveCanvas{display:block;width:100%;height:150px;border-radius:8px;background:#050d16;touch-action:pan-y}
    #hksSyncWaveHelp{font-size:10px;color:#9fb1c3;margin-top:5px}
    #hksSyncWaveEdit{display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-top:6px;direction:rtl}
    #hksSyncWaveEdit button{height:32px;min-width:68px;padding:0 9px;border:1px solid #71889d;border-radius:7px;background:#173047;color:#fff;font-size:12px;font-weight:800}
    #hksSyncWaveSelected{font-size:12px;font-weight:800;min-width:150px;flex:1}
    @media(max-width:520px){#hksSyncWaveCanvas{height:125px}#hksSyncWaveEdit button{min-width:62px}}
  `;
  document.head.appendChild(style);

  let editor=document.getElementById('hksSyncWaveEditor');
  if(!editor){
    editor=document.createElement('div');
    editor.id='hksSyncWaveEditor';
    editor.innerHTML=`
      <div class="hksWaveTitle"><span>גל הקול + נקודות הסנכרון</span><span id="hksSyncWaveCount"></span></div>
      <canvas id="hksSyncWaveCanvas" aria-label="גל הקול ונקודות הסנכרון"></canvas>
      <div id="hksSyncWaveHelp">הקווים הכתומים הם מילים מסונכרנות. לחץ על נקודה כדי לבחור אותה, וגרור ימינה/שמאלה כדי לתקן את זמן הסנכרון.</div>
      <div id="hksSyncWaveEdit"><span id="hksSyncWaveSelected">לא נבחרה מילה</span><button type="button" id="hksSyncMinus50">− 0.05 שנ׳</button><button type="button" id="hksSyncPlus50">+ 0.05 שנ׳</button></div>`;
    wordList.parentElement?.insertBefore(editor,wordList);
  }

  const canvas2=document.getElementById('hksSyncWaveCanvas');
  const count=document.getElementById('hksSyncWaveCount');
  const selectedText=document.getElementById('hksSyncWaveSelected');
  const minus=document.getElementById('hksSyncMinus50');
  const plus=document.getElementById('hksSyncPlus50');
  if(!canvas2)return;
  const c=canvas2.getContext('2d');
  let selected=-1,dragging=-1;

  const isTimed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  function duration(){return Number(audioEl.duration)||Number(audioBuffer?.duration)||0}
  function synced(){try{return Array.isArray(words)?words.map((w,i)=>({w,i})).filter(x=>isTimed(x.w)):[]}catch(_){return[]}}
  function clampTime(i,t){
    const d=duration();let min=0,max=d||Math.max(0,t);
    try{
      for(let p=i-1;p>=0;p--){if(isTimed(words[p])){min=Number(words[p].time)+0.001;break}}
      for(let n=i+1;n<words.length;n++){if(isTimed(words[n])){max=Math.min(max,Number(words[n].time)-0.001);break}}
    }catch(_){}
    if(max<min)max=min;
    return Math.max(min,Math.min(max,Number(t)||0));
  }
  function formatTime(t){
    t=Math.max(0,Number(t)||0);const m=Math.floor(t/60),s=Math.floor(t%60),ms=Math.floor((t%1)*1000);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(3,'0')}`;
  }
  function updateSelected(){
    let w=null;try{w=words?.[selected]}catch(_){}
    selectedText.textContent=isTimed(w)?`מילה: ${w.t} — ${formatTime(w.time)}`:'לא נבחרה מילה';
    minus.disabled=plus.disabled=!isTimed(w);
  }

  function draw(){
    const r=canvas2.getBoundingClientRect(),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height)),dpr=window.devicePixelRatio||1;
    if(canvas2.width!==Math.round(w*dpr)||canvas2.height!==Math.round(h*dpr)){canvas2.width=Math.round(w*dpr);canvas2.height=Math.round(h*dpr)}
    c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.fillStyle='#050d16';c.fillRect(0,0,w,h);

    try{
      if(audioBuffer){
        const data=audioBuffer.getChannelData(0),step=Math.max(1,Math.floor(data.length/w));
        c.strokeStyle='#45a5e8';c.lineWidth=1;c.beginPath();
        for(let x=0;x<w;x++){
          let mn=1,mx=-1,base=x*step;
          for(let j=0;j<step;j++){const v=data[base+j]||0;if(v<mn)mn=v;if(v>mx)mx=v}
          c.moveTo(x,(1+mn)*h/2);c.lineTo(x,(1+mx)*h/2);
        }
        c.stroke();
      }else{
        c.fillStyle='#9fb1c3';c.font='12px Arial';c.textAlign='center';c.fillText('טען קובץ מוזיקה כדי לראות את גל הקול',w/2,h/2);
      }
    }catch(e){console.warn('[v56 waveform draw]',e)}

    const dur=duration(),marks=synced();
    count.textContent=marks.length?`${marks.length} נקודות מסונכרנות`:'אין עדיין נקודות סנכרון';
    if(dur>0){
      for(const {w:mw,i} of marks){
        const x=Math.max(0,Math.min(w,(Number(mw.time)/dur)*w));
        c.strokeStyle=i===selected?'#ffd36a':'#ff9f1c';c.lineWidth=i===selected?3:1.5;c.beginPath();c.moveTo(x,5);c.lineTo(x,h-5);c.stroke();
        c.fillStyle=i===selected?'#ffd36a':'#ff9f1c';c.beginPath();c.arc(x,10,i===selected?6:4,0,Math.PI*2);c.fill();
        if(i===selected){c.font='bold 12px Arial';c.textAlign=x>w-90?'right':x<90?'left':'center';c.fillText(String(mw.t||''),x,h-8)}
      }
      const px=Math.max(0,Math.min(w,(Number(audioEl.currentTime||0)/dur)*w));
      c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(px,0);c.lineTo(px,h);c.stroke();
    }
    updateSelected();
  }

  function nearestMarker(clientX){
    const r=canvas2.getBoundingClientRect(),dur=duration();if(!dur)return -1;
    let best=-1,bestDist=18;
    for(const {w:mw,i} of synced()){
      const x=r.left+(Number(mw.time)/dur)*r.width,dist=Math.abs(clientX-x);
      if(dist<=bestDist){bestDist=dist;best=i}
    }
    return best;
  }
  function timeFromX(clientX){const r=canvas2.getBoundingClientRect(),dur=duration();return Math.max(0,Math.min(dur,((clientX-r.left)/Math.max(1,r.width))*dur))}

  canvas2.addEventListener('pointerdown',e=>{
    const hit=nearestMarker(e.clientX);
    if(hit>=0){selected=dragging=hit;canvas2.setPointerCapture?.(e.pointerId);audioEl.currentTime=Number(words[hit].time)||0;draw();return}
    const t=timeFromX(e.clientX);audioEl.currentTime=t;draw();
  });
  canvas2.addEventListener('pointermove',e=>{
    if(dragging<0)return;
    const t=clampTime(dragging,timeFromX(e.clientX));
    try{words[dragging].time=t;current=dragging;renderWords();updateSyncPreview();window.__hksRefreshIntroVisibility?.()}catch(_){}
    audioEl.currentTime=t;draw();e.preventDefault();
  });
  function endDrag(e){
    if(dragging<0)return;
    try{canvas2.releasePointerCapture?.(e.pointerId)}catch(_){}
    try{setStatus(`זמן הסנכרון של "${words[dragging]?.t||''}" עודכן ל־${formatTime(words[dragging]?.time)}`)}catch(_){}
    dragging=-1;draw();
  }
  canvas2.addEventListener('pointerup',endDrag);canvas2.addEventListener('pointercancel',endDrag);

  function nudge(delta){
    if(selected<0)return;
    try{
      const w=words[selected];if(!isTimed(w))return;
      w.time=clampTime(selected,Number(w.time)+delta);audioEl.currentTime=w.time;current=selected;renderWords();updateSyncPreview();draw();setStatus(`זמן "${w.t}" עודכן ל־${formatTime(w.time)}`);
    }catch(_){}
  }
  minus?.addEventListener('click',()=>nudge(-0.05));plus?.addEventListener('click',()=>nudge(0.05));

  ['syncBtn','syncBtn2','undoBtn','resetBtn','startBtn','startBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(draw,0)));
  document.addEventListener('keydown',e=>{if(e.code==='Space')setTimeout(draw,0)});
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(()=>{try{drawWave()}catch(_){}draw()},800));
  document.getElementById('audioFile')?.addEventListener('change',()=>setTimeout(()=>{try{drawWave()}catch(_){}draw()},500));
  document.querySelector('[data-page="sync"]')?.addEventListener('click',()=>setTimeout(draw,50));
  window.addEventListener('resize',()=>setTimeout(draw,30));
  audioEl.addEventListener('timeupdate',draw);
  audioEl.addEventListener('loadedmetadata',()=>setTimeout(draw,0));

  if(mainWave){setTimeout(()=>{try{if(audioBuffer)drawWave()}catch(_){}},100)}

  window.__hksDrawSyncWave=draw;
  setTimeout(draw,0);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.56';
})();
