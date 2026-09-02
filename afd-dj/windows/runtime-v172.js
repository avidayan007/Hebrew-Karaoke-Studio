(()=>{
if(window.__afdWin172){window.__afdWin172.refresh();return;}
const frame=()=>document.getElementById('console');
const KEY='afdTextScale172';
let scale=1;
try{const n=Number(localStorage.getItem(KEY));if(Number.isFinite(n)&&n>=.85&&n<=1.7)scale=n}catch(e){}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function outerStyle(){
  let s=document.getElementById('afdTextStyle172');
  if(!s){s=document.createElement('style');s.id='afdTextStyle172';document.head.appendChild(s)}
  s.textContent=`
    :root{--afdText172:${scale}}
    #afdTextCtl172{position:fixed;top:7px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:4px;padding:4px 6px;border:1px solid #68717d;border-radius:7px;background:rgba(7,9,13,.94);box-shadow:0 3px 12px #000;color:#fff;font:800 11px/1 "Segoe UI",Arial,sans-serif;direction:ltr;user-select:none}
    #afdTextCtl172 button{width:34px;height:27px;border:1px solid #66717e;border-radius:5px;background:linear-gradient(#414955,#15191f);color:#fff;font:900 13px/1 Arial;cursor:pointer}
    #afdTextCtl172 button:hover{filter:brightness(1.18)}
    #afdTextCtl172 .read{min-width:72px;text-align:center;font-size:10px;color:#dcc7ff;cursor:pointer}
    #afdOnlineHead170{font-size:calc(10px * var(--afdText172))!important}
    .dock .card h3{font-size:calc(17px * var(--afdText172))!important}
    .dock .card small{font-size:calc(10px * var(--afdText172))!important;line-height:1.35!important}
    .dock .card input,.dock .card button{font-size:calc(11px * var(--afdText172))!important}
    .dock .status{font-size:calc(9px * var(--afdText172))!important}
  `;
}
function controls(){
  let c=document.getElementById('afdTextCtl172');
  if(!c){
    c=document.createElement('div');c.id='afdTextCtl172';
    c.innerHTML='<button data-d="-1" title="הקטן אותיות">A−</button><span class="read" title="לחץ לאיפוס">TEXT 100%</span><button data-d="1" title="הגדל אותיות">A+</button>';
    document.body.appendChild(c);
    c.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>change(Number(b.dataset.d)||0)));
    c.querySelector('.read')?.addEventListener('click',()=>setScale(1));
  }
  const r=c.querySelector('.read');if(r)r.textContent='TEXT '+Math.round(scale*100)+'%';
}
function frameStyle(){
  const f=frame();let d;try{d=f?.contentDocument}catch(e){return}
  if(!d?.head)return;
  let s=d.getElementById('afdTextScroll172');
  if(!s){s=d.createElement('style');s.id='afdTextScroll172';d.head.appendChild(s)}
  s.textContent=`
    :root{--afdText172:${scale}}
    html{height:auto!important;min-height:100%!important;overflow-y:scroll!important;overflow-x:hidden!important;scrollbar-gutter:stable!important;overscroll-behavior-y:contain!important}
    body{height:auto!important;min-height:100%!important;overflow:visible!important;overflow-x:hidden!important}
    .app{height:auto!important;min-height:100%!important;overflow:visible!important}
    .brand{font-size:calc(24px * var(--afdText172))!important}.brand small{font-size:calc(9px * var(--afdText172))!important}
    .status{font-size:calc(9px * var(--afdText172))!important}.track b{font-size:calc(12px * var(--afdText172))!important}.track small{font-size:calc(8px * var(--afdText172))!important}
    .bpm strong{font-size:calc(22px * var(--afdText172))!important}.bpm small,.knobWrap span,.pads label,.pitch,.time small{font-size:calc(7px * var(--afdText172))!important}
    .mini,.pad,.tabs button{font-size:calc(8px * var(--afdText172))!important}.transport button{font-size:calc(10px * var(--afdText172))!important}
    .time b{font-size:calc(15px * var(--afdText172))!important}.masterTitle{font-size:calc(10px * var(--afdText172))!important}.channel h4,.sideview h4{font-size:calc(9px * var(--afdText172))!important}
    .cross{font-size:calc(8px * var(--afdText172))!important}.browserTop button{font-size:calc(9px * var(--afdText172))!important}.search{font-size:calc(11px * var(--afdText172))!important}
    .folders,.row,.afdLocalRow170,.afdQ170,.afdFolder170{font-size:calc(9px * var(--afdText172))!important}.afdFolderTitle170{font-size:calc(8px * var(--afdText172))!important}
    .afdTrackHead170,.afdAutoState170{font-size:calc(8px * var(--afdText172))!important}.afdEmpty170,.afdDropText170{font-size:calc(10px * var(--afdText172))!important}
    .afdLocalRow170 button,.afdQ170 button,.afdAutoCtl170 button,.afdSideTabs170 button{font-size:calc(8px * var(--afdText172))!important}
  `;
  installWheel(d);
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
    const se=d.scrollingElement||d.documentElement;
    const max=Math.max(0,se.scrollHeight-se.clientHeight);
    if(max<2)return;
    const before=se.scrollTop;
    se.scrollTop=clamp(before+dy,0,max);
    if(se.scrollTop!==before)e.preventDefault();
  },{passive:false,capture:true});
}
function setScale(n){
  scale=clamp(Math.round(n*100)/100,.85,1.7);
  try{localStorage.setItem(KEY,String(scale))}catch(e){}
  outerStyle();controls();frameStyle();
}
function change(dir){setScale(scale+(dir>0?.1:-.1))}
function keybind(e){
  if(!e.altKey)return;
  if(e.key==='+'||e.key==='='||e.code==='NumpadAdd'){e.preventDefault();change(1)}
  else if(e.key==='-'||e.code==='NumpadSubtract'){e.preventDefault();change(-1)}
  else if(e.key==='0'){e.preventDefault();setScale(1)}
}
function refresh(){outerStyle();controls();frameStyle()}
window.__afdWin172={refresh,setScale,getScale:()=>scale};
window.addEventListener('keydown',keybind,true);
frame()?.addEventListener('load',()=>setTimeout(refresh,120));
refresh();setTimeout(refresh,500);setInterval(frameStyle,1800);
})();
