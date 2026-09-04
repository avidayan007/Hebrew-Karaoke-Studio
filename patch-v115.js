// Avi Karaoke Studio Web v1.115 — wide desktop workspace + zoomable/pannable sync waveform
(function(){
  const editor=document.getElementById('hksSyncWaveEditor'),canvas=document.getElementById('hksSyncWaveCanvas'),audio=document.getElementById('audio');
  const style=document.createElement('style');style.textContent=`
    @media(min-width:1200px){body{max-width:none!important}.wrap,.app,.shell,main{max-width:none!important}#studio{width:calc(100vw - 28px)!important;max-width:none!important;margin-inline:auto!important}#studio .grid,#studio .studioGrid,#studio .hksStudioGrid,#hksStudioGrid71{max-width:none!important;width:100%!important;grid-template-columns:minmax(520px,1fr) minmax(620px,1.25fr)!important;gap:18px!important}}
    @media(min-width:1700px){#studio{width:calc(100vw - 44px)!important}#studio .grid,#studio .studioGrid,#studio .hksStudioGrid,#hksStudioGrid71{grid-template-columns:minmax(650px,1fr) minmax(820px,1.35fr)!important;gap:24px!important}}
    #hksWaveZoom115{display:flex;gap:5px;align-items:center;direction:rtl;margin:5px 0}
    #hksWaveZoom115 button{height:30px;min-width:38px;padding:0 8px;border-radius:7px;border:1px solid #7b3ca8;background:#24142f;color:#fff;font-weight:900}
    #hksWaveZoom115 .zval{min-width:54px;text-align:center;font-size:11px;font-weight:900;color:#f2cf79}
    #hksSyncWaveViewport115{overflow-x:auto;overflow-y:hidden;width:100%;scrollbar-width:auto}
    #hksSyncWaveViewport115 #hksSyncWaveCanvas{max-width:none!important;touch-action:none}
  `;document.head.appendChild(style);
  if(editor&&canvas){
    let controls=document.getElementById('hksWaveZoom115');
    if(!controls){controls=document.createElement('div');controls.id='hksWaveZoom115';controls.innerHTML='<button id="hksZoomOut115" type="button">−</button><span class="zval" id="hksZoomVal115">100%</span><button id="hksZoomIn115" type="button">+</button><button id="hksZoomReset115" type="button">100%</button>';editor.insertBefore(controls,canvas)}
    let viewport=document.getElementById('hksSyncWaveViewport115');
    if(!viewport){viewport=document.createElement('div');viewport.id='hksSyncWaveViewport115';canvas.parentNode.insertBefore(viewport,canvas);viewport.appendChild(canvas)}
    let zoom=Math.max(1,Math.min(8,Number(localStorage.getItem('hksWaveZoom115')||1)));
    const val=document.getElementById('hksZoomVal115');
    function apply(){const base=Math.max(500,viewport.clientWidth);canvas.style.width=(base*zoom)+'px';if(val)val.textContent=Math.round(zoom*100)+'%';localStorage.setItem('hksWaveZoom115',String(zoom));setTimeout(()=>window.__hksDrawSyncWave?.(),0)}
    document.getElementById('hksZoomIn115').onclick=()=>{const center=(viewport.scrollLeft+viewport.clientWidth/2)/Math.max(1,canvas.scrollWidth);zoom=Math.min(8,zoom*1.5);apply();requestAnimationFrame(()=>viewport.scrollLeft=center*canvas.scrollWidth-viewport.clientWidth/2)};
    document.getElementById('hksZoomOut115').onclick=()=>{const center=(viewport.scrollLeft+viewport.clientWidth/2)/Math.max(1,canvas.scrollWidth);zoom=Math.max(1,zoom/1.5);apply();requestAnimationFrame(()=>viewport.scrollLeft=center*canvas.scrollWidth-viewport.clientWidth/2)};
    document.getElementById('hksZoomReset115').onclick=()=>{zoom=1;apply();viewport.scrollLeft=0};
    // Shift+wheel pans the enlarged timeline horizontally.
    viewport.addEventListener('wheel',e=>{if(zoom<=1)return;if(e.shiftKey||Math.abs(e.deltaX)>0){viewport.scrollLeft+=e.deltaX||e.deltaY;e.preventDefault()}},{passive:false});
    window.addEventListener('resize',()=>setTimeout(apply,40));apply();
  }
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.115';
})();