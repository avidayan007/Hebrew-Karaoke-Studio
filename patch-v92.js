// Avi Karaoke Studio Web v1.92 — move main Sync button into the word-by-word sync panel
(function(){
  const card=document.getElementById('hksStudioSyncCard');
  const syncBtn=document.getElementById('syncBtn2');
  const playBtn=document.getElementById('syncPlayBtn');
  const stopBtn=document.getElementById('syncStopBtn');
  if(!card||!syncBtn||!playBtn||!stopBtn)return;

  const topRow=playBtn.closest('.grid') || stopBtn.parentElement;
  if(topRow){
    topRow.id='hksSyncTopRow92';
    topRow.appendChild(syncBtn);
  }

  // Remove the empty primary-actions shell if it is no longer needed.
  const primary=document.getElementById('hksPrimaryActions81');
  if(primary && !primary.querySelector('button,[data-go]')) primary.style.setProperty('display','none','important');

  const style=document.createElement('style');
  style.id='hksSyncButtonInside92';
  style.textContent=`
    #hksSyncTopRow92{
      display:grid!important;
      grid-template-columns:minmax(145px,1.35fr) 28px minmax(92px,1fr) minmax(92px,1fr)!important;
      gap:7px!important;
      direction:ltr!important;
      align-items:stretch!important;
      margin-bottom:10px!important;
    }
    #hksSyncTopRow92 #syncBtn2{
      grid-column:1!important;
      width:100%!important;min-width:145px!important;
      height:52px!important;min-height:52px!important;
      margin:0!important;padding:8px 18px!important;
      font-size:16px!important;font-weight:950!important;border-radius:12px!important;
      background:linear-gradient(135deg,#a14bf4 0%,#8c3e92 55%,#c28d3c 100%)!important;
      border:1px solid #e4b968!important;color:#fff!important;
      box-shadow:0 6px 18px rgba(132,61,169,.28),inset 0 1px 0 rgba(255,255,255,.18)!important;
      direction:rtl!important;
    }
    #hksSyncTopRow92 #syncStopBtn{grid-column:3!important;direction:rtl!important}
    #hksSyncTopRow92 #syncPlayBtn{grid-column:4!important;direction:rtl!important}
    #hksSyncTopRow92 #syncStopBtn,#hksSyncTopRow92 #syncPlayBtn{
      width:100%!important;min-width:0!important;height:46px!important;min-height:46px!important;margin:3px 0!important;
    }

    /* The top Studio toolbar now has seven buttons: keep it balanced in two rows. */
    #hksToolbarRow80{grid-template-columns:repeat(4,minmax(0,1fr))!important}

    @media(max-width:699px){
      #hksSyncTopRow92{
        grid-template-columns:minmax(120px,1.25fr) 16px minmax(82px,1fr) minmax(82px,1fr)!important;
        gap:5px!important;
      }
      #hksSyncTopRow92 #syncBtn2{min-width:120px!important;height:48px!important;min-height:48px!important;font-size:14px!important;padding:7px 10px!important}
      #hksSyncTopRow92 #syncStopBtn,#hksSyncTopRow92 #syncPlayBtn{height:44px!important;min-height:44px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.92';
  console.log('[v92] Main Sync button moved into Studio word-by-word sync panel');
})();