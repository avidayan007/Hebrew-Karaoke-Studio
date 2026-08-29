// Avi Karaoke Studio Web v1.95 — strong gold/purple palette matching approved mockup
(function(){
  const style=document.createElement('style');
  style.id='hksStrongGoldPurple95';
  style.textContent=`
    /* Strong metallic GOLD */
    #hksLoadImage80,
    #hksNewProjectBtn,
    #saveProject,
    #hksToolbarRow80 > [data-go="export"],
    #export .gbtn.blue,
    #export .gbtn.purple,
    #dualExportBtn,
    #hksStudioSyncCard #syncPlayBtn,
    #hksStudioSyncCard #startBtn2,
    #hksStudioSyncCard #startBtn{
      background:linear-gradient(180deg,#d99618 0%,#b86f08 48%,#7f4603 100%)!important;
      border:1px solid #f1bd43!important;
      color:#fff8df!important;
      text-shadow:0 1px 2px rgba(55,26,0,.95)!important;
      box-shadow:inset 0 1px 0 rgba(255,239,177,.45),0 0 0 1px rgba(130,71,0,.25),0 5px 14px rgba(95,52,0,.32)!important;
    }

    /* Strong glossy PURPLE */
    #hksLoadAudio80,
    #hksLoadVideo80,
    #hksOpenProjectBtn,
    #syncBtn2,
    .tab.on,
    #hksSyncFontMinus85,
    #hksSyncFontPlus85{
      background:linear-gradient(180deg,#7b2aa7 0%,#5a176f 50%,#34103f 100%)!important;
      border:1px solid #b85ed0!important;
      color:#fff7ff!important;
      text-shadow:0 1px 2px rgba(23,4,29,.9)!important;
      box-shadow:inset 0 1px 0 rgba(255,220,255,.25),0 0 0 1px rgba(89,26,107,.25),0 5px 14px rgba(57,17,70,.28)!important;
    }

    /* Make top toolbar colors obvious and separated, not blended. */
    #hksToolbarRow80 > button{transition:none!important}
    #hksToolbarRow80 > #hksLoadAudio80,
    #hksToolbarRow80 > #hksLoadVideo80,
    #hksToolbarRow80 > #hksOpenProjectBtn{background:linear-gradient(180deg,#842eae,#5b196f 52%,#32103c)!important}
    #hksToolbarRow80 > #hksLoadImage80,
    #hksToolbarRow80 > #hksNewProjectBtn,
    #hksToolbarRow80 > #saveProject,
    #hksToolbarRow80 > [data-go="export"]{background:linear-gradient(180deg,#e0a126,#b87009 52%,#7d4403)!important}

    /* Gold accents around dark cards, like the approved visual direction. */
    #preview,
    #hksStudioSyncCard,
    #export .card,
    #hksCompactToolbar80{border-color:#7c5416!important}
  `;
  document.head.appendChild(style);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.95';
  console.log('[v95] Strong gold and purple app button palette enabled');
})();