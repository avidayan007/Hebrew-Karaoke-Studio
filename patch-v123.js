// Avi Karaoke Studio Web v1.123 — lightweight sync dragging: no waveform redraw while mouse moves
(function(){
  const canvas=document.getElementById('hksSyncWaveCanvas'),audio=document.getElementById('audio');
  if(!canvas||!audio)return;
  const timed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
  let mode=null,index=-1,startCurrent=0,pending=0,pointerId=null;
  let overlay=document.getElementById('hksDragGuide123');
  if(!overlay){overlay=document.createElement('div');overlay.id='hksDragGuide123';Object.assign(overlay.style,{position:'fixed',top:'0px',left:'0px',width:'2px',height:'0px',background:'#fff',boxShadow:'0 0 7px rgba(255,255,255,.8)',pointerEvents:'none',zIndex:'2147483647',display:'none'});document.body.appendChild(overlay)}
  const duration=()=>{try{return Number(audio.duration)||Number(audioBuffer?.duration)||0}catch(_){return Number(audio.duration)||0}};
  function timeFromX(x){const r=canvas.getBoundingClientRect(),d=duration();return Math.max(0,Math.min(d,((x-r.left)/Math.max(1,r.width))*d))}
  function nearest(x){const r=canvas.getBoundingClientRect(),d=duration();if(!d||!Array.isArray(words))return -1;let best=-1,dist=22;for(let i=0;i<words.length;i++){if(!timed(words[i]))continue;const px=r.left+(Number(words[i].time)/d)*r.width,dd=Math.abs(x-px);if(dd<=dist){best=i;dist=dd}}return best}
  function clamp(i,t){let min=0,max=duration()||t;try{for(let p=i-1;p>=0;p--)if(timed(words[p])){min=Number(words[p].time)+.001;break}for(let n=i+1;n<words.length;n++)if(timed(words[n])){max=Math.min(max,Number(words[n].time)-.001);break}}catch(_){}if(max<min)max=min;return Math.max(min,Math.min(max,Number(t)||0))}
  function showGuide(clientX,color){const r=canvas.getBoundingClientRect();overlay.style.display='block';overlay.style.top=r.top+'px';overlay.style.left=Math.max(r.left,Math.min(r.right,clientX))+'px';overlay.style.height=r.height+'px';overlay.style.background=color;overlay.style.boxShadow=`0 0 7px ${color}`}
  function hideGuide(){overlay.style.display='none'}

  canvas.addEventListener('pointerdown',e=>{
    const hit=nearest(e.clientX);mode=hit>=0?'marker':'cursor';index=hit;startCurrent=Number(current)||0;pointerId=e.pointerId;
    pending=hit>=0?Number(words[hit].time)||timeFromX(e.clientX):timeFromX(e.clientX);
    try{canvas.setPointerCapture?.(e.pointerId)}catch(_){}
    if(hit>=0){window.__hksSelectSyncMarker56?.(hit);showGuide(e.clientX,'#ffd36a');canvas.style.cursor='ew-resize'}else{showGuide(e.clientX,'#ffffff');canvas.style.cursor='ew-resize'}
    e.preventDefault();e.stopImmediatePropagation();
  },true);

  canvas.addEventListener('pointermove',e=>{
    if(!mode)return;pending=timeFromX(e.clientX);if(mode==='marker'&&index>=0)pending=clamp(index,pending);showGuide(e.clientX,mode==='marker'?'#ffd36a':'#ffffff');e.preventDefault();e.stopImmediatePropagation();
  },true);

  function finish(e,cancelled){
    if(!mode)return;const m=mode,i=index,t=pending;mode=null;index=-1;try{canvas.releasePointerCapture?.(pointerId)}catch(_){}pointerId=null;hideGuide();canvas.style.cursor='crosshair';
    if(m==='marker'&&i>=0){try{if(!cancelled)words[i].time=clamp(i,t);current=startCurrent;audio.currentTime=Number(words[i].time)||0;renderWords();updateSyncPreview();window.__hksDrawSyncWave?.();window.__hksSelectSyncMarker56?.(i);setStatus(`נקודת הסנכרון של "${words[i]?.t||''}" הוזזה.`)}catch(err){console.error('[v123 marker]',err)}}
    else if(m==='cursor'&&!cancelled){try{audio.currentTime=Math.max(0,t);window.__hksResync121?.arm?.(t);window.__hksDrawSyncWave?.();setStatus('נקודת החזרה נבחרה. לחץ ▶ נגן לסנכרון כדי למחוק רק את הסנכרון שאחריה ולהמשיך מחדש.')}catch(err){console.error('[v123 cursor]',err)}}
    e.preventDefault();e.stopImmediatePropagation();
  }
  canvas.addEventListener('pointerup',e=>finish(e,false),true);canvas.addEventListener('pointercancel',e=>finish(e,true),true);
  canvas.style.cursor='crosshair';
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.123';
})();