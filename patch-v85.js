// Hebrew Karaoke Studio Web v1.85 — independent sync word font-size controls
(function(){
  const card=document.getElementById('hksStudioSyncCard');
  const list=document.getElementById('wordList');
  if(!card||!list)return;

  let size=9;
  const min=7,max=18;

  const controls=document.createElement('div');
  controls.id='hksSyncFontControls85';
  controls.innerHTML=`<span>גודל מילים בסנכרון</span><button type="button" id="hksSyncFontMinus85" aria-label="הקטן מילים בסנכרון">A−</button><strong id="hksSyncFontValue85">${size}</strong><button type="button" id="hksSyncFontPlus85" aria-label="הגדל מילים בסנכרון">A+</button>`;
  list.insertAdjacentElement('beforebegin',controls);

  const style=document.createElement('style');
  style.id='hksSyncFontStyle85';
  style.textContent=`
    #hksSyncFontControls85{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin:5px 0 7px;font-size:10px;color:#b9c8d6}
    #hksSyncFontControls85 button{width:38px;height:30px;min-height:30px;padding:0;border-radius:7px;border:1px solid #526b80;background:#172839;color:#fff;font-weight:900;font-size:13px}
    #hksSyncFontControls85 strong{min-width:24px;text-align:center;color:#fff;font-size:11px}
    #hksStudioSyncCard #wordList{font-size:var(--hks-sync-font,9px)!important;line-height:1.08!important}
    #hksStudioSyncCard #wordList .wordrow{font-size:var(--hks-sync-font,9px)!important;line-height:1.08!important;min-height:18px!important;padding:1px 4px!important;grid-template-columns:23px minmax(0,1fr) 58px!important;gap:3px!important}
    #hksStudioSyncCard #wordList .wordrow span{font-size:var(--hks-sync-font,9px)!important;line-height:1.08!important}
  `;
  document.head.appendChild(style);

  const value=document.getElementById('hksSyncFontValue85');
  function apply(){
    size=Math.max(min,Math.min(max,size));
    card.style.setProperty('--hks-sync-font',size+'px');
    value.textContent=size;
  }
  document.getElementById('hksSyncFontMinus85').onclick=()=>{size--;apply()};
  document.getElementById('hksSyncFontPlus85').onclick=()=>{size++;apply()};
  apply();

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.85';
})();