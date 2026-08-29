// Hebrew Karaoke Studio Web v1.72 — compact waveform and full-height lyrics editor
(function(){
  const wave=document.getElementById('wave');
  const audio=document.getElementById('audio');
  const lyricsPage=document.getElementById('lyrics');
  const lyricsText=document.getElementById('lyricsText');
  const loadProject=document.getElementById('loadProject');

  // Keep the old project file input available programmatically for the Studio "Open project" button,
  // but remove it from the visible Lyrics workspace.
  if(loadProject){
    loadProject.classList.add('hksHiddenLegacyProjectPicker72');
    loadProject.style.setProperty('display','none','important');
    const prev=loadProject.previousElementSibling;
    if(prev && /פתח פרויקט|פרויקט מלא|ישן/.test(prev.textContent||'')){
      prev.style.setProperty('display','none','important');
    }
  }

  // Mark the waveform/player card so it can be made much more compact without affecting the live preview.
  const playerCard=wave?.closest('.card');
  if(playerCard)playerCard.id='hksCompactPlayerCard72';

  // Make the lyrics card/editor use the available viewport height.
  const lyricsCard=lyricsText?.closest('.card');
  if(lyricsCard)lyricsCard.id='hksLyricsWorkspace72';

  const style=document.createElement('style');
  style.id='hksLayout72';
  style.textContent=`
    /* Smaller waveform directly under the live preview */
    #hksCompactPlayerCard72{padding:6px!important;margin-bottom:6px!important}
    #hksCompactPlayerCard72 #wave{
      height:52px!important;
      min-height:52px!important;
      max-height:52px!important;
      display:block!important;
      margin:0!important;
      border-radius:7px!important;
    }
    #hksCompactPlayerCard72 audio{
      margin-top:4px!important;
      height:34px!important;
    }
    #hksCompactPlayerCard72 #clock{
      font-size:10px!important;
      line-height:14px!important;
      margin-top:1px!important;
    }

    /* Lyrics page becomes a real large paste/edit workspace */
    #lyrics{padding-top:6px!important}
    #hksLyricsWorkspace72{
      min-height:calc(100dvh - 132px)!important;
      display:flex!important;
      flex-direction:column!important;
      padding:9px!important;
      margin-bottom:4px!important;
    }
    #hksLyricsWorkspace72 h3{margin-bottom:6px!important}
    #hksLyricsWorkspace72 #lyricsText{
      flex:1 1 auto!important;
      min-height:calc(100dvh - 245px)!important;
      height:auto!important;
      resize:vertical!important;
      font-size:18px!important;
      line-height:1.55!important;
      padding:14px!important;
    }
    #hksLyricsWorkspace72 > .grid{
      flex:0 0 auto!important;
      margin-top:6px!important;
    }
    #hksLyricsWorkspace72 > .grid .gbtn{
      min-height:38px!important;
    }
    #hksLyricsWorkspace72 .hksHiddenLegacyProjectPicker72{display:none!important}

    @media(min-width:700px){
      #hksCompactPlayerCard72 #wave{height:46px!important;min-height:46px!important;max-height:46px!important}
      #hksLyricsWorkspace72{min-height:calc(100dvh - 126px)!important}
      #hksLyricsWorkspace72 #lyricsText{min-height:calc(100dvh - 225px)!important;font-size:19px!important}
    }
  `;
  document.head.appendChild(style);

  // Redraw after the CSS resize so the waveform canvas remains sharp at the new height.
  setTimeout(()=>{try{window.drawWave?.()}catch(_){};try{window.__hksDrawSyncWave?.()}catch(_){}},80);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.72';
})();
