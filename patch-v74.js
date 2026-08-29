// Hebrew Karaoke Studio Web v1.74 — visible Sync button beside Export
(function(){
  const studio=document.getElementById('studio');
  const syncBtn=document.getElementById('syncBtn');
  if(!studio||!syncBtn)return;

  // The user wants the actual Sync action visibly next to Export in the Studio controls.
  const exportBtn=[...studio.querySelectorAll('[data-go="export"]')].find(b=>/ייצוא/.test(b.textContent||''));
  if(exportBtn){
    const grid=exportBtn.closest('.grid');
    if(grid && syncBtn.parentElement===grid){
      // Put Sync immediately beside Export in DOM order; RTL grid renders them as a pair.
      grid.insertBefore(syncBtn,exportBtn);
      syncBtn.textContent='◆ סנכרן';
      syncBtn.style.setProperty('display','block','important');
      syncBtn.style.setProperty('visibility','visible','important');
      syncBtn.style.setProperty('opacity','1','important');
      syncBtn.classList.add('hksVisibleSync74');
      exportBtn.classList.add('hksExportBesideSync74');
    }
  }

  const style=document.createElement('style');
  style.id='hksSyncBesideExport74';
  style.textContent=`
    #studio #syncBtn.hksVisibleSync74,
    #studio [data-go="export"].hksExportBesideSync74{
      min-height:34px!important;
      font-size:12px!important;
      padding:4px 7px!important;
    }
    #studio #syncBtn.hksVisibleSync74{display:block!important;visibility:visible!important;opacity:1!important}
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.74';
})();