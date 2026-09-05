// Avi Karaoke Studio Web v1.150 — multi-step sync Undo / Redo history
(function(){
  const undoOld=document.getElementById('undoBtn');
  if(!undoOld)return;

  window.__hksSyncHistory150=true;
  const LIMIT=1000;
  let undoStack=[],redoStack=[],restoring=false,pending=null,pendingLabel='',observed=null,observedSig='';

  function snap(){
    let list=[];
    try{list=Array.isArray(words)?words.map(w=>w?.time==null?null:(Number.isFinite(Number(w.time))?Number(w.time):null)):[]}catch(_){}
    let cur=0;try{cur=Number(current)||0}catch(_){}
    return {times:list,current:cur};
  }
  function signature(s){return `${s.current}|${s.times.map(v=>v==null?'_':Number(v).toFixed(4)).join(',')}`}
  function same(a,b){return !!a&&!!b&&signature(a)===signature(b)}
  function clone(s){return {times:s.times.slice(),current:s.current}}
  function pushUndo(s){if(!s)return;const c=clone(s);if(undoStack.length&&same(undoStack[undoStack.length-1],c))return;undoStack.push(c);if(undoStack.length>LIMIT)undoStack.shift()}
  function pushRedo(s){if(!s)return;redoStack.push(clone(s));if(redoStack.length>LIMIT)redoStack.shift()}

  // Put Undo / Redo in their own large row so they stay easy to tap on iPhone.
  const actionGrid=undoOld.closest('.grid4');
  const undoBtn=undoOld.cloneNode(true);undoOld.replaceWith(undoBtn);
  undoBtn.id='undoBtn';undoBtn.textContent='↶ חזור אחורה';undoBtn.title='Undo — חזרה לשינוי הסנכרון הקודם';undoBtn.className='gbtn blue';
  const redoBtn=document.createElement('button');redoBtn.id='redoBtn150';redoBtn.className='gbtn purple';redoBtn.textContent='↷ חזור קדימה';redoBtn.title='Redo — החזרת שינוי שבוטל';
  const historyRow=document.createElement('div');historyRow.id='hksHistoryRow150';historyRow.className='grid';historyRow.style.marginBottom='8px';
  const counter=document.createElement('div');counter.id='hksHistoryCount150';counter.className='small';counter.style.cssText='text-align:center;margin:0 0 8px;';
  if(actionGrid){actionGrid.parentNode.insertBefore(historyRow,actionGrid);historyRow.append(undoBtn,redoBtn);actionGrid.style.gridTemplateColumns='repeat(3,minmax(0,1fr))';actionGrid.parentNode.insertBefore(counter,actionGrid)}
  else{undoBtn.insertAdjacentElement('afterend',redoBtn);redoBtn.insertAdjacentElement('afterend',counter)}

  function paint(){
    undoBtn.disabled=undoStack.length===0;redoBtn.disabled=redoStack.length===0;
    undoBtn.style.opacity=undoBtn.disabled?'.45':'1';redoBtn.style.opacity=redoBtn.disabled?'.45':'1';
    counter.textContent=`היסטוריית סנכרון: ${undoStack.length} אחורה • ${redoStack.length} קדימה`;
  }
  function redraw(){
    try{renderWords()}catch(_){}try{updateSyncPreview()}catch(_){}try{updateLivePreview()}catch(_){}
    try{window.__hksDrawSyncWave?.()}catch(_){}try{if(document.getElementById('audio')?.paused)window.__hksWaveFollow149Api?.update?.()}catch(_){}
    paint();
  }
  function restore(s){
    if(!s)return false;
    try{
      if(!Array.isArray(words)||words.length!==s.times.length)return false;
      restoring=true;
      for(let i=0;i<words.length;i++)words[i].time=s.times[i];
      current=Math.max(0,Math.min(words.length,Number(s.current)||0));
      observed=snap();observedSig=signature(observed);pending=null;pendingLabel='';
      redraw();return true;
    }catch(e){console.warn('[v150 history restore]',e);return false}
    finally{restoring=false}
  }
  function recordFrom(before,label){
    if(restoring||!before)return false;
    const after=snap();
    if(same(before,after)){observed=after;observedSig=signature(after);return false}
    pushUndo(before);redoStack=[];observed=after;observedSig=signature(after);paint();
    if(label)try{console.debug('[v150 history]',label,undoStack.length)}catch(_){}
    return true;
  }
  function scan(){
    if(restoring||pending)return false;
    const now=snap(),sig=signature(now);
    if(!observed){observed=now;observedSig=sig;paint();return false}
    if(sig===observedSig)return false;
    const before=observed;pushUndo(before);redoStack=[];observed=now;observedSig=sig;paint();return true;
  }
  function begin(label){
    if(restoring)return;
    scan();
    if(!pending){pending=snap();pendingLabel=label||'שינוי סנכרון'}
  }
  function commit(){
    if(restoring||!pending)return;
    const before=pending,label=pendingLabel;pending=null;pendingLabel='';recordFrom(before,label);
  }
  function clearHistory(){undoStack=[];redoStack=[];pending=null;pendingLabel='';observed=snap();observedSig=signature(observed);paint()}

  function doUndo(){
    commit();scan();
    if(!undoStack.length){paint();try{setStatus('אין עוד שינויים לחזור אליהם.')}catch(_){}return}
    const now=snap(),target=undoStack.pop();pushRedo(now);
    if(!restore(target)){pushUndo(target);redoStack.pop();paint();return}
    try{setStatus(`Undo — חזרת צעד אחד אחורה. נשארו ${undoStack.length} צעדים אחורה.`)}catch(_){}
  }
  function doRedo(){
    commit();scan();
    if(!redoStack.length){paint();try{setStatus('אין שינוי קדימה להחזיר.')}catch(_){}return}
    const now=snap(),target=redoStack.pop();pushUndo(now);
    if(!restore(target)){undoStack.pop();pushRedo(target);paint();return}
    try{setStatus(`Redo — השינוי הוחזר. נשארו ${redoStack.length} צעדים קדימה.`)}catch(_){}
  }

  undoBtn.onclick=e=>{e.preventDefault();e.stopPropagation();doUndo()};
  redoBtn.onclick=e=>{e.preventDefault();e.stopPropagation();doRedo()};

  // Capture every normal synchronization action as one history step.
  const actionSelector='#syncBtn,#syncBtn2,#resetBtn,#hksSyncMinus50,#hksSyncPlus50,#hksSyncWaveCanvas';
  const relevant=target=>target?.closest?.(actionSelector);
  document.addEventListener('pointerdown',e=>{const t=relevant(e.target);if(t)begin(t.id||'sync')},true);
  document.addEventListener('click',e=>{const t=relevant(e.target);if(!t)return;if(!pending)begin(t.id||'sync');setTimeout(commit,0)},true);
  document.addEventListener('pointerup',e=>{if(pending&&e.target?.closest?.('#hksSyncWaveCanvas'))setTimeout(commit,0)},true);
  document.addEventListener('pointercancel',()=>{if(pending)setTimeout(commit,0)},true);

  // Space synchronizes a word in the original app; keep each press as a separate Undo step.
  document.addEventListener('keydown',e=>{
    const tag=document.activeElement?.tagName;
    if((e.metaKey||e.ctrlKey)&&!e.altKey&&String(e.key).toLowerCase()==='z'){
      e.preventDefault();e.stopImmediatePropagation();e.shiftKey?doRedo():doUndo();return;
    }
    if((e.metaKey||e.ctrlKey)&&!e.altKey&&String(e.key).toLowerCase()==='y'){
      e.preventDefault();e.stopImmediatePropagation();doRedo();return;
    }
    if(e.code==='Space'&&tag!=='TEXTAREA'&&tag!=='INPUT'){begin('Space sync');setTimeout(commit,0)}
  },true);

  // Starting a new lyrics set / loading another project creates a fresh history.
  document.getElementById('prepareBtn')?.addEventListener('click',()=>setTimeout(clearHistory,0));
  document.getElementById('clearBtn')?.addEventListener('click',()=>setTimeout(clearHistory,0));
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(clearHistory,40));

  // Safety net: catches synchronization changes made by older/newer patches that do not use the known controls.
  const timer=setInterval(()=>{try{scan()}catch(_){}},100);
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});

  observed=snap();observedSig=signature(observed);paint();
  window.__hksSyncHistory150Api={
    undo:doUndo,redo:doRedo,scan,clear:clearHistory,snapshot:snap,
    get undoCount(){return undoStack.length},get redoCount(){return redoStack.length},get limit(){return LIMIT}
  };

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.150';
  try{setStatus('v1.150 מוכן — Undo / Redo מרובה צעדים נוסף לסנכרון.')}catch(_){}
})();
