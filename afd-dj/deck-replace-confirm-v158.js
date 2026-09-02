(()=>{
 const F=()=>document.getElementById('console'),D=()=>{try{return F()?.contentDocument||null}catch(e){return null}},W=()=>{try{return F()?.contentWindow||null}catch(e){return null}};
 if(window.__afdReplace158Installed){window.__afdReplace158Installed.refresh?.();return}
 let pending=false,boundDoc=null;
 function nativePlaying(k){const d=D(),m=d?.getElementById('vid'+k);return!!(m&&(m.currentSrc||m.src)&&!m.paused&&!m.ended&&m.readyState>0)}
 function youtubePlaying(k){try{return!!window.AFDYouTubeState?.isPlaying?.(k)}catch(e){return false}}
 function isPlaying(k){return nativePlaying(k)||youtubePlaying(k)}
 function ask(k,yes){
  if(pending)return;pending=true;
  const w=document.createElement('div');w.id='afdReplace158';w.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#0009;display:flex;align-items:center;justify-content:center;direction:rtl;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial';
  w.innerHTML=`<div style="width:min(440px,90vw);background:#111720;border:2px solid #d5a93c;border-radius:14px;padding:22px;color:white;text-align:center"><b style="font-size:21px">Deck ${k} מנגן עכשיו</b><p style="font-size:16px;line-height:1.5">האם אתה רוצה להחליף את השיר?<br>השיר הנוכחי ימשיך להתנגן בזמן שאתה מחליט.</p><div style="display:flex;gap:12px;justify-content:center"><button id="no158" style="padding:12px 25px;border:0;border-radius:8px;background:#343b46;color:white;font-weight:800">ביטול</button><button id="yes158" style="padding:12px 25px;border:0;border-radius:8px;background:#d5a93c;color:#111;font-weight:900">כן, החלף</button></div></div>`;
  document.body.appendChild(w);const close=()=>{pending=false;w.remove()};w.querySelector('#no158').onclick=close;w.querySelector('#yes158').onclick=()=>{close();yes()};
 }
 function parentClick(e){
  const b=e.target.closest?.('[data-d]');if(!b)return;const k=b.dataset.d;
  if(!['A','B'].includes(k)||b.dataset.afdOk158==='1'||!isPlaying(k))return;
  e.preventDefault();e.stopImmediatePropagation();ask(k,()=>{b.dataset.afdOk158='1';b.click();setTimeout(()=>delete b.dataset.afdOk158,0)});
 }
 function loadLocal(deck,it){
  const win=W();if(!win||typeof win.load!=='function'||!it?.file)return;
  win.load(deck,it.file);window.dispatchEvent(new CustomEvent('afd-local-load',{detail:{deck,item:it}}));
 }
 function itemForRow(row){
  const api=window.__afdWin170;if(!api)return null;
  if(row?.classList?.contains('afdLocalRow170'))return api.items?.find(x=>x.key===row.dataset.key)||null;
  if(row?.classList?.contains('afdQ170'))return api.queue?.[Number(row.dataset.i)]||null;
  return null;
 }
 function frameClick(e){
  const b=e.target.closest?.('[data-a],[data-qdeck]');if(!b||b.dataset.afdOk158==='1')return;
  const k=b.dataset.a||b.dataset.qdeck;if(!['A','B'].includes(k)||!isPlaying(k))return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();ask(k,()=>{b.dataset.afdOk158='1';b.click();setTimeout(()=>delete b.dataset.afdOk158,0)});
 }
 function frameDrop(e){
  const d=D(),root=e.target.closest?.('.deckA,.deckB');if(!root)return;const k=root.classList.contains('deckB')?'B':'A';if(!isPlaying(k))return;
  const localKey=e.dataTransfer?.getData('application/x-afd-local-key')||'',qRaw=e.dataTransfer?.getData('application/x-afd-q-index');
  if(!localKey&&(qRaw===''||qRaw==null))return;
  const api=window.__afdWin170;let it=null;
  if(localKey)it=api?.items?.find(x=>x.key===localKey)||api?.queue?.find(x=>x.key===localKey)||null;
  if(!it&&qRaw!==''&&qRaw!=null)it=api?.queue?.[Number(qRaw)]||null;
  if(!it)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();ask(k,()=>loadLocal(k,it));
 }
 function bindFrame(){
  const d=D();if(!d||d===boundDoc)return;boundDoc=d;d.addEventListener('click',frameClick,true);d.addEventListener('drop',frameDrop,true);
 }
 document.addEventListener('click',parentClick,true);
 window.addEventListener('afd-online-drag-load',e=>{const k=e.detail?.deck;if(!['A','B'].includes(k)||!isPlaying(k))return;e.preventDefault();e.stopImmediatePropagation();const detail={...e.detail};ask(k,()=>window.dispatchEvent(new CustomEvent('afd-online-drag-load-confirmed',{detail})))},true);
 function refresh(){bindFrame()}
 window.__afdReplace158Installed={refresh,isPlaying};F()?.addEventListener('load',()=>setTimeout(refresh,120));refresh();setInterval(refresh,900);
})();
