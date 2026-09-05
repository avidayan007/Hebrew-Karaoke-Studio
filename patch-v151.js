// Avi Karaoke Studio Web v1.151 — compact global Undo / Redo beside Refresh Update
(function(){
  const api=window.__hksSyncHistory150Api;
  if(!api)return;
  window.__hksCompactHistory151=true;

  // Remove the large history controls and counter from the Sync page.
  document.getElementById('hksHistoryRow150')?.remove();
  document.getElementById('hksHistoryCount150')?.remove();

  const refresh=document.getElementById('hksRefresh105')||[...document.querySelectorAll('button')].find(b=>/רענן\s*עדכון|עדכון\s*רענן|מעדכן\s*לגרסה|בודק\s*עדכון/.test(String(b.textContent||'')));
  if(!refresh)return;

  let wrap=document.getElementById('hksTopActions151');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='hksTopActions151';
    wrap.style.cssText='display:flex;align-items:center;gap:6px;width:100%;margin:6px 0;direction:rtl;';
    refresh.parentNode?.insertBefore(wrap,refresh);
    wrap.appendChild(refresh);
    refresh.style.flex='1 1 auto';
    refresh.style.minWidth='0';
  }

  const make=(id,text,label)=>{
    let b=document.getElementById(id);
    if(b)return b;
    b=document.createElement('button');
    b.id=id;b.type='button';b.textContent=text;b.title=label;b.setAttribute('aria-label',label);
    b.style.cssText='flex:0 0 44px;width:44px;height:36px;min-height:36px;padding:0;border-radius:9px;border:1px solid #526b80;background:#182b3c;color:#fff;font-size:23px;font-weight:900;line-height:1;box-shadow:1px 2px 3px #010509;touch-action:manipulation;';
    wrap.appendChild(b);return b;
  };
  const undo=make('hksUndo151','↶','Undo — חזור שינוי סנכרון אחד אחורה');
  const redo=make('hksRedo151','↷','Redo — החזר שינוי סנכרון קדימה');

  function paint(){
    const u=Number(api.undoCount)||0,r=Number(api.redoCount)||0;
    undo.disabled=u===0;redo.disabled=r===0;
    undo.style.opacity=undo.disabled?'.38':'1';redo.style.opacity=redo.disabled?'.38':'1';
    undo.title=`Undo — חזור אחורה (${u})`;redo.title=`Redo — חזור קדימה (${r})`;
  }
  undo.onclick=e=>{e.preventDefault();e.stopPropagation();api.undo();paint()};
  redo.onclick=e=>{e.preventDefault();e.stopPropagation();api.redo();paint()};

  const relevant='#syncBtn,#syncBtn2,#resetBtn,#hksSyncMinus50,#hksSyncPlus50,#hksSyncWaveCanvas,#prepareBtn,#clearBtn,#loadProject';
  document.addEventListener('click',e=>{if(e.target?.closest?.(relevant))setTimeout(paint,0)},true);
  document.addEventListener('pointerup',e=>{if(e.target?.closest?.('#hksSyncWaveCanvas'))setTimeout(paint,0)},true);
  document.addEventListener('keydown',e=>{if(e.code==='Space'||((e.metaKey||e.ctrlKey)&&['z','y'].includes(String(e.key).toLowerCase())))setTimeout(paint,0)},true);
  document.getElementById('loadProject')?.addEventListener('change',()=>setTimeout(paint,80));

  window.__hksCompactHistory151Api={paint,undo:()=>{api.undo();paint()},redo:()=>{api.redo();paint()}};
  paint();
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.151';
  try{setStatus('v1.151 מוכן — Undo / Redo קטנים ליד רענן עדכון.')}catch(_){}
})();
