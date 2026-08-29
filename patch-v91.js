// Hebrew Karaoke Studio Web v1.91 — split Studio toolbar into two clean rows
(function(){
  const row=document.getElementById('hksToolbarRow80');
  if(!row)return;

  const audio=document.getElementById('hksLoadAudio80');
  const image=document.getElementById('hksLoadImage80');
  const video=document.getElementById('hksLoadVideo80');
  const newBtn=document.getElementById('hksNewProjectBtn');
  const openBtn=document.getElementById('hksOpenProjectBtn');
  const saveBtn=document.getElementById('saveProject');
  const syncBtn=document.getElementById('syncBtn2');
  const exportBtn=[...document.querySelectorAll('#studio [data-go="export"]')][0];

  // Put the eight real controls directly in one grid so iPad gets exactly 2 rows × 4 buttons.
  [audio,image,video,newBtn,openBtn,saveBtn,syncBtn,exportBtn].forEach(b=>{if(b)row.appendChild(b)});

  const oldProject=document.getElementById('hksProjectHomeActions');
  const oldPrimary=document.getElementById('hksPrimaryActions81');
  if(oldProject)oldProject.style.setProperty('display','none','important');
  if(oldPrimary)oldPrimary.style.setProperty('display','none','important');

  const style=document.createElement('style');
  style.id='hksTwoRowToolbar91';
  style.textContent=`
    #hksToolbarRow80{
      display:grid!important;
      grid-template-columns:repeat(4,minmax(0,1fr))!important;
      grid-auto-rows:44px!important;
      gap:7px!important;
      width:100%!important;
      direction:rtl!important;
      align-items:stretch!important;
    }
    #hksToolbarRow80 > button{
      width:100%!important;min-width:0!important;max-width:none!important;
      height:44px!important;min-height:44px!important;
      margin:0!important;padding:5px 8px!important;
      border-radius:10px!important;font-size:12.5px!important;font-weight:900!important;
      white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
    }
    #hksToolbarRow80 > .hksTinyTool80,
    #hksToolbarRow80 > #hksNewProjectBtn,
    #hksToolbarRow80 > #hksOpenProjectBtn,
    #hksToolbarRow80 > #saveProject{
      background:linear-gradient(135deg,#a13b57 0%,#7d3da3 52%,#c8953f 100%)!important;
      border:1px solid #ddb366!important;color:#fff8eb!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.17),0 4px 12px rgba(0,0,0,.28)!important;
    }
    #hksToolbarRow80 > #syncBtn2{
      background:linear-gradient(135deg,#9346ef 0%,#8b3d8e 56%,#b78337 100%)!important;
      border:1px solid #d8a95b!important;color:#fff!important;
    }
    #hksToolbarRow80 > [data-go="export"]{
      background:linear-gradient(135deg,#b84c64 0%,#873e9e 46%,#d6a64c 100%)!important;
      border:1px solid #efca78!important;color:#fff9e8!important;
    }
    #hksCompactToolbar80{padding:8px!important}

    @media(max-width:699px){
      #hksToolbarRow80{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:42px!important;gap:6px!important}
      #hksToolbarRow80 > button{height:42px!important;min-height:42px!important;font-size:11.5px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.91';
  console.log('[v91] Studio toolbar split into two rows');
})();

import('./patch-v92.js?v=92').catch(e=>{console.error('[v92]',e);try{setStatus('שגיאה בטעינת עדכון v1.92')}catch(_){}});