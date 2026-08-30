(()=>{
 let mode=localStorage.getItem('afdYTViewMode')||'list',size=+(localStorage.getItem('afdYTItemSize')||1);
 const box=()=>document.getElementById('afdYTInlineResults');
 function css(){if(document.getElementById('afdYTView114Style'))return;const s=document.createElement('style');s.id='afdYTView114Style';s.textContent=`
 #afdYTView114{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0}
 #afdYTView114 button{height:30px;padding:0 10px;border:1px solid #49535f;border-radius:5px;background:#11161c;color:#fff;font-weight:800;font-size:9px}
 #afdYTView114 button.on{border-color:#9a6cff;background:#382153}
 #afdYTSize114{width:120px;accent-color:#9a6cff}
 #afdYTInlineResults.afdYTGrid114{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(calc(180px * var(--afd-yt-size,1)),1fr));gap:8px;align-content:start}
 #afdYTInlineResults.afdYTGrid114 .afdYTListRow{display:grid!important;grid-template-columns:1fr!important;gap:6px!important;padding:8px!important;border:1px solid #2d3540!important;border-radius:7px;background:#090c11}
 #afdYTInlineResults.afdYTGrid114 .afdYTListRow img{width:100%!important;height:calc(95px * var(--afd-yt-size,1))!important;object-fit:cover!important;border-radius:5px}
 #afdYTInlineResults:not(.afdYTGrid114) .afdYTListRow{min-height:calc(58px * var(--afd-yt-size,1))!important;font-size:calc(10px * var(--afd-yt-size,1))!important}
 #afdYTInlineResults:not(.afdYTGrid114) .afdYTListRow img{width:calc(58px * var(--afd-yt-size,1))!important;height:calc(34px * var(--afd-yt-size,1))!important}
 `;document.head.appendChild(s)}
 function controls(){css();const b=box();if(!b)return;if(document.getElementById('afdYTView114'))return;const bar=document.createElement('div');bar.id='afdYTView114';bar.innerHTML='<button id="afdYTList114">☰ רשימה</button><button id="afdYTGrid114">▦ ריבועים</button><span style="font-size:9px;color:#aeb8c3">גודל</span><input id="afdYTSize114" type="range" min="0.7" max="1.6" step="0.1"><span id="afdYTSizeTxt114" style="font-size:9px;color:#ddd"></span>';b.parentElement?.insertBefore(bar,b);document.getElementById('afdYTList114').onclick=()=>{mode='list';save();apply()};document.getElementById('afdYTGrid114').onclick=()=>{mode='grid';save();apply()};const r=document.getElementById('afdYTSize114');r.value=size;r.oninput=()=>{size=+r.value;save();apply()};apply()}
 function save(){localStorage.setItem('afdYTViewMode',mode);localStorage.setItem('afdYTItemSize',String(size))}
 function apply(){const b=box();if(!b)return;b.classList.toggle('afdYTGrid114',mode==='grid');b.style.setProperty('--afd-yt-size',size);document.getElementById('afdYTList114')?.classList.toggle('on',mode==='list');document.getElementById('afdYTGrid114')?.classList.toggle('on',mode==='grid');const t=document.getElementById('afdYTSizeTxt114');if(t)t.textContent=Math.round(size*100)+'%'}
 new MutationObserver(()=>{controls();apply()}).observe(document.body,{childList:true,subtree:true});setInterval(()=>{controls();apply()},1000);controls();
})();