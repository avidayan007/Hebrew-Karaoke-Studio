(()=>{
if(window.__afd228){window.__afd228.refresh();return}
const VERSION='__AFD_VERSION__';
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return F()?.contentWindow||null}catch(e){return null}};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fmt=t=>{t=Math.max(0,Math.floor(Number(t)||0));const h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;return(h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')};
const dragging={A:false,B:false};
let boundWindow=null;
function localActive(k){
 const d=D(),v=d?.getElementById('vid'+k);if(!d||!v||!(v.currentSrc||v.src))return false;
 const own=window.__afd215?.getOwner?.(k)||window.__afdUnified215?.getOwner?.(k)||'';
 if(own)return own==='local';
 return!!window.AFDLocalDeckMeta?.[k];
}
function hideOnline(k){const h=D()?.getElementById('afdClock212'+k);if(h)h.style.display='none'}
function paint(k){
 const d=D(),v=d?.getElementById('vid'+k);if(!d||!v||!localActive(k))return false;
 hideOnline(k);
 const a=d.getElementById('time'+k),b=d.getElementById('remain'+k),r=d.getElementById('seek'+k);
 const cur=Math.max(0,Number(v.currentTime)||0),dur=Math.max(0,Number(v.duration)||0);
 if(a)a.textContent=fmt(cur);
 if(b)b.textContent='-'+fmt(Math.max(0,dur-cur));
 if(r&&dur>0&&!dragging[k])r.value=String(clamp(cur/dur*1000,0,1000));
 return true;
}
function seek(k,value){
 const d=D(),v=d?.getElementById('vid'+k);if(!d||!v||!localActive(k))return false;
 const dur=Math.max(0,Number(v.duration)||0);if(!dur)return false;
 const sec=dur*clamp(Number(value)||0,0,1000)/1000;
 try{v.currentTime=sec}catch(e){return false}
 const m=d.getElementById('master'+k);if(m&&(m.currentSrc||m.src))try{m.currentTime=sec}catch(e){}
 paint(k);return true;
}
function bind(){
 const w=W(),d=D();if(!w||!d)return;
 if(boundWindow!==w)boundWindow=w;
 for(const k of ['A','B']){
  const v=d.getElementById('vid'+k),r=d.getElementById('seek'+k);if(v&&!v.dataset.afdClock228){v.dataset.afdClock228='1';for(const ev of ['loadedmetadata','durationchange','timeupdate','play','pause','seeked'])v.addEventListener(ev,()=>paint(k),{passive:true})}
  if(r&&!r.dataset.afdClock228){
   r.dataset.afdClock228='1';
   r.addEventListener('pointerdown',()=>{if(localActive(k))dragging[k]=true},true);
   r.addEventListener('input',e=>{if(!localActive(k))return;dragging[k]=true;seek(k,e.target.value);e.stopImmediatePropagation?.()},true);
   const done=e=>{if(!localActive(k)){dragging[k]=false;return}seek(k,e.target.value);dragging[k]=false;paint(k);e.stopImmediatePropagation?.()};
   r.addEventListener('change',done,true);r.addEventListener('pointerup',done,true);r.addEventListener('pointercancel',()=>{dragging[k]=false;paint(k)},true);
  }
 }
}
function refresh(){bind();paint('A');paint('B')}
window.addEventListener('afd-local-load',e=>{const k=e.detail?.deck;if(['A','B'].includes(k))setTimeout(()=>paint(k),0)},true);
F()?.addEventListener('load',()=>setTimeout(()=>{boundWindow=null;refresh()},500));
window.__afd228={refresh,paint,seek,localActive};
refresh();setInterval(refresh,250);
console.log('[AFD 228] AFD '+VERSION+' • Local deck clock ready');
})();