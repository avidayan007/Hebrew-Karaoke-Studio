// Avi Karaoke Studio Web v1.93 — compact sync controls, shifted right/up
(function(){
  const row=document.getElementById('hksSyncTopRow92');
  const syncBtn=document.getElementById('syncBtn2');
  const playBtn=document.getElementById('syncPlayBtn');
  const stopBtn=document.getElementById('syncStopBtn');
  if(!row||!syncBtn||!playBtn||!stopBtn)return;

  // Keep the controls in one compact row: play/stop on the right, Sync separated to their left.
  row.innerHTML='';
  row.appendChild(playBtn);
  row.appendChild(stopBtn);
  row.appendChild(syncBtn);

  const style=document.createElement('style');
  style.id='hksCompactSyncRow93';
  style.textContent=`
    #hksSyncTopRow92{
      display:flex!important;
      flex-direction:row-reverse!important;
      justify-content:flex-start!important;
      align-items:center!important;
      gap:7px!important;
      width:100%!important;
      margin:-4px 0 5px!important;
      padding:0!important;
      min-height:0!important;
      direction:rtl!important;
    }
    #hksSyncTopRow92 #syncPlayBtn,
    #hksSyncTopRow92 #syncStopBtn{
      flex:0 0 auto!important;
      width:88px!important;min-width:88px!important;
      height:38px!important;min-height:38px!important;
      margin:0!important;padding:4px 8px!important;
      border-radius:9px!important;font-size:12px!important;
    }
    #hksSyncTopRow92 #syncBtn2{
      flex:0 0 auto!important;
      width:126px!important;min-width:126px!important;
      height:40px!important;min-height:40px!important;
      margin:0 18px 0 0!important;
      padding:5px 12px!important;
      font-size:14px!important;font-weight:950!important;
      border-radius:10px!important;
      background:linear-gradient(135deg,#a14bf4 0%,#8c3e92 55%,#c28d3c 100%)!important;
      border:1px solid #e4b968!important;color:#fff!important;
      box-shadow:0 4px 12px rgba(132,61,169,.22),inset 0 1px 0 rgba(255,255,255,.16)!important;
    }
    #hksStudioSyncCard{padding-top:6px!important}
    #hksStudioSyncCard h3{margin-bottom:5px!important}

    @media(max-width:699px){
      #hksSyncTopRow92{gap:5px!important;margin:-2px 0 5px!important}
      #hksSyncTopRow92 #syncPlayBtn,#hksSyncTopRow92 #syncStopBtn{width:76px!important;min-width:76px!important;height:36px!important;min-height:36px!important;font-size:11px!important}
      #hksSyncTopRow92 #syncBtn2{width:110px!important;min-width:110px!important;height:38px!important;min-height:38px!important;margin-right:10px!important;font-size:12.5px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.93';
  console.log('[v93] Compact sync controls aligned right and moved up');
})();