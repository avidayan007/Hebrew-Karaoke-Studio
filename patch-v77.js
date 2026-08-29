// Hebrew Karaoke Studio Web v1.77 — move the real Sync button out of sync panel and beside Export
(function(){
  const studio=document.getElementById('studio');
  const syncBtn2=document.getElementById('syncBtn2');
  if(!studio||!syncBtn2)return;

  const exportBtn=[...studio.querySelectorAll('[data-go="export"]')].find(b=>/ייצוא/.test(b.textContent||''));
  const transportGrid=exportBtn?.closest('.grid');
  const oldGrid=syncBtn2.parentElement;

  if(exportBtn&&transportGrid){
    // Move the actual authoritative sync button so its existing click listener keeps working.
    transportGrid.insertBefore(syncBtn2,exportBtn);
    syncBtn2.textContent='◆ סנכרן';
    syncBtn2.classList.add('hksMainSync77');
  }

  if(oldGrid)oldGrid.classList.add('hksSyncFooter77');

  const style=document.createElement('style');
  style.id='hksMainSyncStyle77';
  style.textContent=`
    /* Large, easy-to-hit Sync button beside Export */
    #studio #syncBtn2.hksMainSync77{
      display:block!important;
      min-height:48px!important;
      height:48px!important;
      font-size:16px!important;
      font-weight:900!important;
      padding:6px 12px!important;
      border-radius:12px!important;
      box-shadow:2px 4px 4px #010509!important;
    }
    #studio [data-go="export"]{
      min-height:48px!important;
      height:48px!important;
      font-size:14px!important;
    }

    /* The old sync footer now has only Undo / Reset / Start. */
    #hksStudioSyncCard .hksSyncFooter77{
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:5px!important;
    }

    @media(max-width:849px){
      #studio #syncBtn2.hksMainSync77,
      #studio [data-go="export"]{
        min-height:44px!important;
        height:44px!important;
      }
      #studio #syncBtn2.hksMainSync77{font-size:15px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.77';
})();