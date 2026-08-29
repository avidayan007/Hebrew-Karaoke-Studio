// Avi Karaoke Studio Web v1.96 — bolder, clearer typography across the app
(function(){
  const style=document.createElement('style');
  style.id='hksBoldReadableTypography96';
  style.textContent=`
    body,button,input,select,textarea,.gbtn,.tab{font-weight:650!important}
    button,.gbtn,.tab,
    #hksToolbarRow80 button,
    #hksProjectHomeActions button,
    #hksStudioSyncCard button,
    #export button{font-weight:800!important;letter-spacing:.05px!important}
    h1,h2,h3,h4,.title,.sectionTitle,.card h3,.card h2{font-weight:900!important}
    label,.muted,.status,#clock,#exportState{font-weight:700!important}
    #hksStudioSyncCard #wordList.hksSyncLyrics .hksSyncLine,
    #hksStudioSyncCard #wordList.hksSyncLyrics .hksSyncWord{font-weight:800!important}
    #lyricsPreview,.lyricsPreview{font-weight:900!important}
    #hksAfdBrand88,#hksAfdBrand88 *{font-weight:900!important}
    #hksToolbarRow80 button,#hksStudioSyncCard button,#export button{ text-shadow:0 1px 2px rgba(0,0,0,.75)!important }
  `;
  document.head.appendChild(style);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.96';
  console.log('[v96] Bold readable typography enabled');
})();