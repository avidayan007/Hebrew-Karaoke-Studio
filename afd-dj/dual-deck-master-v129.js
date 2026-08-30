(()=>{
 const frame=()=>document.getElementById('console');
 const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
 function install(){
  const d=D(); if(!d||d.documentElement.dataset.afdDual129)return;
  const a=d.getElementById('vidA'),b=d.getElementById('vidB'),ma=d.getElementById('masterA'),mb=d.getElementById('masterB'),cross=d.getElementById('cross'),screen=d.querySelector('.masterScreen');
  if(!a||!b||!cross||!screen)return;
  d.documentElement.dataset.afdDual129='1';
  // The master display is a renderer only. It must never be another playing media element.
  [ma,mb].forEach(m=>{if(!m)return;try{m.pause()}catch(e){}m.muted=true;m.removeAttribute('autoplay');m.style.setProperty('display','none','important')});
  let cv=d.getElementById('afdMasterCanvas129');
  if(!cv){cv=d.createElement('canvas');cv.id='afdMasterCanvas129';cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;background:#000;z-index:3;';screen.appendChild(cv)}
  const logo=d.getElementById('masterLogo');if(logo)logo.style.zIndex='4';
  const ctx=cv.getContext('2d',{alpha:false});
  function size(){const r=screen.getBoundingClientRect(),w=Math.max(2,Math.round(r.width*devicePixelRatio)),h=Math.max(2,Math.round(r.height*devicePixelRatio));if(cv.width!==w)cv.width=w;if(cv.height!==h)cv.height=h}
  function drawFit(v,alpha){if(!v||v.readyState<2||!v.videoWidth||!v.videoHeight||alpha<=0)return false;const W=cv.width,H=cv.height,s=Math.min(W/v.videoWidth,H/v.videoHeight),w=v.videoWidth*s,h=v.videoHeight*s,x=(W-w)/2,y=(H-h)/2;ctx.globalAlpha=alpha;try{ctx.drawImage(v,x,y,w,h);return true}catch(e){return false}}
  function render(){size();ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);const x=Math.max(0,Math.min(1,(+cross.value||0)/100));let shown=false;shown=drawFit(b,1-x)||shown;shown=drawFit(a,x)||shown;if(logo)logo.style.display=shown?'none':'grid';requestAnimationFrame(render)}
  requestAnimationFrame(render);
  function isPlaying(v){return !!(v&&!v.paused&&!v.ended&&v.readyState>1)}
  function setSide(deck){const value=deck==='A'?100:0;cross.value=String(value);cross.dispatchEvent(new Event('input',{bubbles:true}));cross.dispatchEvent(new Event('change',{bubbles:true}));const vc=d.getElementById('videoCross');if(vc&&vc!==cross){vc.value=String(value);vc.dispatchEvent(new Event('input',{bubbles:true}));vc.dispatchEvent(new Event('change',{bubbles:true}))}}
  ['A','B'].forEach(deck=>{const v=deck==='A'?a:b,other=deck==='A'?b:a,panel=v.closest('.panel'),play=panel?.querySelector('[data-act="play"],.transport .play');
   if(play&&!play.dataset.afdDual129){play.dataset.afdDual129='1';play.addEventListener('click',()=>{const otherWasPlaying=isPlaying(other),thisWasPlaying=isPlaying(v);if(!thisWasPlaying&&!otherWasPlaying)setTimeout(()=>{if(isPlaying(v)&&!isPlaying(other))setSide(deck)},0)},true)}
   // If any older script/browser interruption pauses the first deck exactly when the other starts, immediately resume it.
   v.addEventListener('play',()=>{const keep=other;if(keep&&keep.dataset.afdWasPlaying129==='1'&&keep.paused&&keep.src)keep.play().catch(()=>{})},{passive:true});
   const mark=()=>{v.dataset.afdWasPlaying129=isPlaying(v)?'1':'0'};v.addEventListener('playing',mark,{passive:true});v.addEventListener('pause',()=>setTimeout(mark,80),{passive:true});v.addEventListener('ended',mark,{passive:true});
  });
 }
 frame()?.addEventListener('load',()=>setTimeout(install,300));setTimeout(install,500);setTimeout(install,1400);
})();