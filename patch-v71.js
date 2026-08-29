// Hebrew Karaoke Studio Web v1.71 — keep preview/player left, move synchronization to right column
(function(){
  const studio=document.getElementById('studio');
  const desktop=studio?.querySelector('.desktop');
  const syncCard=document.getElementById('hksStudioSyncCard');
  if(!studio||!desktop||!syncCard)return;

  const left=desktop.children[0];
  const right=desktop.children[1];
  if(!left||!right)return;

  // Move the real synchronization card to the bottom of the RIGHT column.
  // We move, not clone, so all existing buttons/listeners/timings remain exactly the same.
  if(!right.contains(syncCard)) right.appendChild(syncCard);

  syncCard.classList.add('hksSyncRight71');

  const style=document.createElement('style');
  style.id='hksStudioLayout71';
  style.textContent=`
    @media(min-width:700px){
      #studio .desktop{
        direction:ltr!important;
        grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr)!important;
        align-items:start!important;
        gap:8px!important;
      }
      #studio .desktop > *{direction:rtl!important;min-width:0!important}
      #studio .desktop > :first-child{grid-column:1!important}
      #studio .desktop > :nth-child(2){grid-column:2!important}

      /* Left column is reserved for the live screen, waveform and player only. */
      #studio .desktop > :first-child #preview{width:100%!important}

      /* Synchronization belongs below files/tools/export on the right. */
      #hksStudioSyncCard.hksSyncRight71{
        width:100%!important;
        margin-top:6px!important;
        position:relative!important;
      }
    }

    #hksStudioSyncCard.hksSyncRight71 h3{
      text-align:right!important;
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.71';
})();
