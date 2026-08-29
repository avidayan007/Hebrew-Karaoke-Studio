// Hebrew Karaoke Studio Web v1.73 — tighter Studio controls, larger sync, slightly smaller lyrics editor
(function(){
  const studio=document.getElementById('studio');
  const desktop=studio?.querySelector('.desktop');
  const syncCard=document.getElementById('hksStudioSyncCard');
  const lyricsText=document.getElementById('lyricsText');
  if(!studio||!desktop)return;

  const right=desktop.children[1];

  // Keep synchronization directly below the Studio transport/export controls on the right.
  if(syncCard&&right){
    const cards=[...right.children].filter(el=>el.classList?.contains('card') && el!==syncCard);
    const controlsCard=cards.find(c=>c.querySelector('#playBtn,#stopBtn,#syncBtn,[data-go="export"]'));
    if(controlsCard){
      controlsCard.insertAdjacentElement('afterend',syncCard);
    }else if(!right.contains(syncCard)){
      right.appendChild(syncCard);
    }
    syncCard.classList.add('hksSyncLarger73');
  }

  const style=document.createElement('style');
  style.id='hksLayout73';
  style.textContent=`
    /* Right Studio column: remove wasted vertical gaps between files, controls and sync. */
    #studio .desktop > :nth-child(2) > .card{margin-bottom:4px!important}
    #studio .desktop > :nth-child(2){row-gap:0!important}
    #hksCompactFilesCard70{padding:5px!important;margin-bottom:3px!important}
    #hksCompactFilesCard70 h3{margin-bottom:2px!important}
    #hksCompactFilesCard70 .pickerTitle{margin:2px 0 1px!important;line-height:1.05!important}
    #hksCompactFilesCard70 .nativePicker{
      min-height:29px!important;height:29px!important;margin-bottom:2px!important;padding:2px 5px!important;
    }

    /* Transport/export card is tighter, with Sync immediately below it. */
    #studio .desktop > :nth-child(2) > .card:has(#playBtn){padding:5px!important;margin-bottom:3px!important}
    #studio .desktop > :nth-child(2) > .card:has(#playBtn) .grid{gap:4px!important}
    #studio .desktop > :nth-child(2) > .card:has(#playBtn) .gbtn{min-height:32px!important;padding:3px 5px!important;font-size:11px!important}

    /* Give the synchronization area a little more room than v1.72. */
    #hksStudioSyncCard.hksSyncLarger73{
      margin-top:0!important;padding:9px!important;min-height:330px!important;
    }
    #hksStudioSyncCard.hksSyncLarger73 h3{font-size:13px!important;margin-bottom:6px!important}
    #hksStudioSyncCard.hksSyncLarger73 #wordList{
      max-height:330px!important;min-height:190px!important;margin:6px 0!important;
    }
    #hksStudioSyncCard.hksSyncLarger73 .wordrow{padding:6px 7px!important;font-size:13px!important}
    #hksStudioSyncCard.hksSyncLarger73 .gbtn{min-height:36px!important;font-size:12px!important}

    /* Lyrics editor: just a little shorter than v1.72, not back to the old small size. */
    #hksLyricsWorkspace72{min-height:calc(100dvh - 155px)!important}
    #hksLyricsWorkspace72 #lyricsText{
      min-height:calc(100dvh - 275px)!important;
      flex:0 1 auto!important;
      height:calc(100dvh - 275px)!important;
    }

    @media(min-width:700px){
      #hksLyricsWorkspace72{min-height:calc(100dvh - 150px)!important}
      #hksLyricsWorkspace72 #lyricsText{
        min-height:calc(100dvh - 260px)!important;
        height:calc(100dvh - 260px)!important;
      }
      #hksStudioSyncCard.hksSyncLarger73 #wordList{max-height:360px!important;min-height:210px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.73';
})();