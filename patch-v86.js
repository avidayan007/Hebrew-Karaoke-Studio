// Hebrew Karaoke Studio Web v1.86 — fix A-/A+ for actual four-line sync lyrics
(function(){
  const card=document.getElementById('hksStudioSyncCard');
  const list=document.getElementById('wordList');
  if(!card||!list)return;

  let controls=document.getElementById('hksSyncFontControls85');
  if(!controls){
    controls=document.createElement('div');
    controls.id='hksSyncFontControls85';
    controls.innerHTML='<span>גודל מילים בסנכרון</span><button type="button" id="hksSyncFontMinus85">A−</button><strong id="hksSyncFontValue85">18</strong><button type="button" id="hksSyncFontPlus85">A+</button>';
    list.insertAdjacentElement('beforebegin',controls);
  }

  const minus=document.getElementById('hksSyncFontMinus85');
  const plus=document.getElementById('hksSyncFontPlus85');
  const value=document.getElementById('hksSyncFontValue85');
  let size=18;
  const min=10,max=36;

  const style=document.createElement('style');
  style.id='hksSyncFontFix86';
  style.textContent=`
    #hksStudioSyncCard #wordList.hksSyncLyrics .hksSyncLine,
    #hksStudioSyncCard #wordList.hksSyncLyrics .hksSyncWord{
      font-size:var(--hks-sync-fourline-font,18px)!important;
      line-height:1.18!important;
    }
    #hksStudioSyncCard #wordList.hksSyncLyrics .hksSyncLine{
      min-height:1.18em!important;
      margin:0!important;
      padding:0!important;
    }
    #hksStudioSyncCard #wordList.hksSyncLyrics{
      gap:5px!important;
      padding:10px 8px!important;
    }
  `;
  document.head.appendChild(style);

  function apply(){
    size=Math.max(min,Math.min(max,size));
    card.style.setProperty('--hks-sync-fourline-font',size+'px');
    if(value)value.textContent=size;
  }
  if(minus)minus.onclick=()=>{size-=2;apply()};
  if(plus)plus.onclick=()=>{size+=2;apply()};
  apply();

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.86';
})();