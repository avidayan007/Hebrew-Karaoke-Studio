// Hebrew Karaoke Studio Web v1.70 — compact iPad Studio layout, sync on the left
(function(){
  const studio=document.getElementById('studio');
  const desktop=studio?.querySelector('.desktop');
  const syncCard=document.getElementById('hksStudioSyncCard');
  const actions=document.getElementById('hksProjectHomeActions');
  if(!studio||!desktop)return;

  const left=desktop.children[0];
  const right=desktop.children[1];

  // Keep sync in the real left column on tablet/desktop. No cloning = all existing listeners stay intact.
  if(syncCard&&left&&!left.contains(syncCard))left.appendChild(syncCard);

  // Project buttons become a compact toolbar at the top of the right column.
  if(actions&&right){
    right.insertBefore(actions,right.firstChild);
    actions.classList.add('hksCompactProjectActions70');
  }

  // Identify the files/background card so only its visual size is reduced.
  const rightCards=right?[...right.querySelectorAll(':scope > .card')]:[];
  const filesCard=rightCards.find(c=>/קבצים|רקע/.test(c.querySelector('h3')?.textContent||''));
  if(filesCard)filesCard.id='hksCompactFilesCard70';

  const style=document.createElement('style');
  style.id='hksStudioCompact70';
  style.textContent=`
    /* Compact project actions */
    #hksProjectHomeActions.hksCompactProjectActions70{
      display:flex!important;grid-template-columns:none!important;gap:5px!important;
      justify-content:flex-end!important;align-items:center!important;
      width:auto!important;margin:0 0 6px!important;padding:0!important;
    }
    #hksProjectHomeActions.hksCompactProjectActions70 .gbtn{
      min-height:30px!important;height:30px!important;width:auto!important;flex:0 0 auto!important;
      padding:0 9px!important;border-radius:8px!important;font-size:11px!important;
      line-height:1!important;box-shadow:1px 2px 2px #010509!important;white-space:nowrap!important;
    }

    /* Compact file/background area */
    #hksCompactFilesCard70{padding:7px!important;margin-bottom:6px!important}
    #hksCompactFilesCard70 h3{margin-bottom:4px!important;font-size:12px!important}
    #hksCompactFilesCard70 .pickerTitle{font-size:10px!important;margin:4px 0 2px!important}
    #hksCompactFilesCard70 .nativePicker{
      min-height:32px!important;height:32px!important;margin-bottom:4px!important;padding:3px 6px!important;
      border-width:1px!important;border-radius:8px!important;font-size:11px!important;
    }

    /* Sync panel itself is denser so more of it fits on iPad */
    #hksStudioSyncCard{padding:8px!important;margin-top:6px!important}
    #hksStudioSyncCard h3{margin-bottom:5px!important;font-size:12px!important}
    #hksStudioSyncCard .gbtn{min-height:34px!important;font-size:11px!important;padding:4px 6px!important}
    #hksStudioSyncCard #wordList{max-height:265px!important;margin:5px 0!important}
    #hksStudioSyncCard .wordrow{padding:5px 6px!important;font-size:12px!important}

    /* Force the visual columns: preview + sync LEFT, files/tools RIGHT. */
    @media(min-width:700px){
      #studio .desktop{
        direction:ltr!important;
        grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr)!important;
        align-items:start!important;gap:8px!important;
      }
      #studio .desktop > *{direction:rtl!important;min-width:0!important}
      #studio .desktop > :first-child{grid-column:1!important}
      #studio .desktop > :nth-child(2){grid-column:2!important}
    }

    @media(max-width:699px){
      #hksProjectHomeActions.hksCompactProjectActions70{
        justify-content:flex-end!important;margin:0 0 5px!important;
      }
      #hksProjectHomeActions.hksCompactProjectActions70 .gbtn{
        min-height:29px!important;height:29px!important;font-size:10px!important;padding:0 7px!important;
      }
      #hksCompactFilesCard70 .nativePicker{height:34px!important;min-height:34px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.70';
})();
