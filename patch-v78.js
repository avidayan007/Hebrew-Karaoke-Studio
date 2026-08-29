// Hebrew Karaoke Studio Web v1.78 — clearer spacing between sync control groups
(function(){
  const card=document.getElementById('hksStudioSyncCard');
  if(!card)return;

  const play=document.getElementById('syncPlayBtn');
  const stop=document.getElementById('syncStopBtn');
  const undo=document.getElementById('undoBtn');
  const reset=document.getElementById('resetBtn');
  const start=document.getElementById('startBtn2');

  // Mark the two rows/groups so the separation is obvious and touch-friendly.
  const topGroup=play?.closest('.grid');
  const bottomGroup=undo?.closest('.grid') || reset?.closest('.grid') || start?.closest('.grid');
  if(topGroup)topGroup.classList.add('hksSyncTransportGroup78');
  if(bottomGroup)bottomGroup.classList.add('hksSyncActionGroup78');

  const style=document.createElement('style');
  style.id='hksSyncSpacing78';
  style.textContent=`
    #hksStudioSyncCard .hksSyncTransportGroup78{
      gap:10px!important;
      margin-bottom:15px!important;
    }
    #hksStudioSyncCard .hksSyncActionGroup78{
      gap:10px!important;
      margin-top:15px!important;
    }
    #hksStudioSyncCard .hksSyncTransportGroup78 .gbtn,
    #hksStudioSyncCard .hksSyncActionGroup78 .gbtn{
      min-height:38px!important;
      padding:6px 9px!important;
    }
    @media(min-width:700px){
      #hksStudioSyncCard .hksSyncTransportGroup78{margin-bottom:18px!important}
      #hksStudioSyncCard .hksSyncActionGroup78{margin-top:18px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.78';
})();