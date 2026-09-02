(()=>{
if(window.__afdWin172){window.__afdWin172.refresh();return;}
const frame=()=>document.getElementById('console');
const KEY='afdLibraryTextScale172';
let scale=1;
try{const n=Number(localStorage.getItem(KEY));if(Number.isFinite(n)&&n>=.85&&n<=1.8)scale=n}catch(e){}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function removeOldOuter(){
  document.getElementById('afdTextCtl172')?.remove();
  const old=document.getElementById('afdTextStyle172');if(old)old.textContent='';
}
function D(){try{return frame()?.contentDocument||null}catch(e){return null}}
function installStyle(d){
  if(!d?.head)return;
  let s=d.getElementById('afdTextScroll172');
  if(!s){s=d.createElement('style');s.id='afdTextScroll172';d.head.appendChild(s)}
  s.textContent=`
    :root{--afdLibText172:${scale}}
    html{height:auto!important;min-height:100%!important;overflow-y:scroll!important;overflow-x:hidden!important;scrollbar-gutter:stable!important;overscroll-behavior-y:contain!important}
    body,.app{height:auto!important;min-height:100%!important;overflow:visible!important;overflow-x:hidden!important}
    .browser .afdFolder170{font-size:calc(9px * var(--afdLibText172))!important;line-height:1.35!important}
    .browser .afdFolderTitle170{font-size:calc(8px * var(--afdLibText172))!important}
    .browser .afdTrackHead170{font-size:calc(8px * var(--afdLibText172))!important}
    .browser .afdLocalRow170{font-size:calc(9px * var(--afdLibText172))!important;line-height:1.3!important}
    .browser .afdLocalRow170 button{font-size:calc(8px * var(--afdLibText172))!important}
    .browser .afdLocalSearch170{font-size:calc(10px * var(--afdLibText172))!important}
    .browser .browserTop>button:not(#afdLibTextCtl172 button){font-size:calc(8px * var(--afdLibText172))!important}
    .browser .sideview h4{font-size:calc(10px * var(--afdLibText172))!important}
    .browser .afdSideTabs170 button,.browser .afdAutoCtl170 button{font-size:calc(8px * var(--afdLibText172))!important}
    .browser .afdAutoState170{font-size:calc(8px * var(--afdLibText172))!important}
    .browser .afdQ170{font-size:calc(9px * var(--afdLibText172))!important;line-height:1.3!important}
    .browser .afdQ170 button{font-size:calc(8px * var(--afdLibText172))!important}
    .browser .afdDropText170,.browser .afdEmpty170{font-size:calc(10px * var(--afdLibText172))!important}
    .browser .afdSavedPlaylist174,.browser .afdPlaylistSave174{font-size:calc(9px * var(--afdLibText172))!important}
    #afdLibTextCtl172{margin-left:auto;display:flex!important;align-items:center;gap:3px;flex:0 0 auto;padding:2px 4px;border:1px solid #626d79;border-radius:5px;background:#080b10;direction:ltr}
    #afdLibTextCtl172 button{width:31px!important;height:25px!important;padding:0!important;font-size:12px!important;font-weight:1000!important}
    #afdLibTextCtl172 .read{min-width:54px;text-align:center;color:#ddc8ff;font-size:8px!important;font-weight:900;cursor:pointer;white-space:nowrap}
  `;
  installWheel(d);
}
function installControl(d){
  const top=d?.querySelector('.browserTop');if(!top)return;
  let c=d.getElementById('afdLibTextCtl172');
  if(!c){
    c=d.createElement('div');c.id='afdLibTextCtl172';
    c.innerHTML='<button data-d="-1" title="הקטן טקסט בספרייה">A−</button><span class="read" title="איפוס ל-100%">TEXT 100%</span><button data-d="1" title="הגדל טקסט בספרייה">A+</button>';
    top.appendChild(c);
    c.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();change(Number(b.dataset.d)||0)}));
    c.querySelector('.read')?.addEventListener('click',()=>setScale(1));
  }
  const r=c.querySelector('.read');if(r)r.textContent=Math.round(scale*100)+'%';
}
function scrollableAncestor(target,dy,d){
  let e=target instanceof d.defaultView.Element?target:null;
  while(e&&e!==d.body&&e!==d.documentElement){
    const cs=d.defaultView.getComputedStyle(e),oy=cs.overflowY;
    if((oy==='auto'||oy==='scroll')&&e.scrollHeight>e.clientHeight+2){
      const max=e.scrollHeight-e.clientHeight;
      if((dy>0&&e.scrollTop<max-1)||(dy<0&&e.scrollTop>1))return e;
    }
    e=e.parentElement;
  }
  return null;
}
function installWheel(d){
  if(d.documentElement.dataset.afdWheel172)return;
  d.documentElement.dataset.afdWheel172='1';
  d.addEventListener('wheel',e=>{
    if(e.ctrlKey||e.metaKey)return;
    const dy=e.deltaY;if(!dy)return;
    if(scrollableAncestor(e.target,dy,d))return;
    const se=d.scrollingElement||d.documentElement,max=Math.max(0,se.scrollHeight-se.clientHeight);if(max<2)return;
    const before=se.scrollTop;se.scrollTop=clamp(before+dy,0,max);if(se.scrollTop!==before)e.preventDefault();
  },{passive:false,capture:true});
}
function setScale(n){
  scale=clamp(Math.round(n*100)/100,.85,1.8);
  try{localStorage.setItem(KEY,String(scale))}catch(e){}
  refresh();
}
function change(dir){setScale(scale+(dir>0?.1:-.1))}
function refresh(){removeOldOuter();const d=D();installStyle(d);installControl(d)}
window.__afdWin172={refresh,setScale,getScale:()=>scale};
frame()?.addEventListener('load',()=>setTimeout(refresh,150));
refresh();setTimeout(refresh,500);setInterval(refresh,1800);
})();
