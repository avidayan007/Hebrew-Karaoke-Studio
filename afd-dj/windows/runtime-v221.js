(()=>{
if(window.__afd221){window.__afd221.refresh();return}
window.__afd221Active=true;
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let lastApi=null;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 221]',t)}
function dispatch(deck,action){
 try{window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck,action,afd221:true}}));return true}catch(e){status('YOUTUBE '+action.toUpperCase()+' ERROR • '+(e?.message||e));return false}
}
function installDirectYouTubeControls(){
 const y=window.AFDYouTubeState,d=D();if(!y||!d)return false;
 if(y!==lastApi)lastApi=y;
 y.isLoaded=k=>!!d.getElementById('ytDeck'+k);
 y.play=k=>dispatch(k,'play');
 y.pause=k=>dispatch(k,'pause');
 y.stop=k=>dispatch(k,'stop');
 y.seek=(k,sec)=>{
  const r=d.getElementById('seek'+k),t=y.getTime?.(k)||{},dur=Number(t.duration)||0;
  if(!r||dur<=0)return false;
  r.value=String(clamp((Number(sec)||0)/dur*1000,0,1000));
  r.dispatchEvent(new Event('input',{bubbles:true,cancelable:true}));
  return true
 };
 return true
}
function refresh(){window.__afd221Active=true;if(installDirectYouTubeControls())window.__afd221Ready=true}
window.__afd221={refresh,installDirectYouTubeControls};
F()?.addEventListener('load',()=>setTimeout(refresh,700));refresh();setInterval(refresh,350);
})();
