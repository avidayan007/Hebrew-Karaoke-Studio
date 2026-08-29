// Hebrew Karaoke Studio Web v1.75 — remove redundant Sync button beside Export
(function(){
  const syncBtn=document.getElementById('syncBtn');
  if(syncBtn){
    // Keep the authoritative Sync control inside the synchronization panel (#syncBtn2).
    // The Studio transport copy beside Export is redundant and should not take space.
    syncBtn.style.setProperty('display','none','important');
    syncBtn.style.setProperty('visibility','hidden','important');
    syncBtn.setAttribute('aria-hidden','true');
  }

  const exportBtn=[...document.querySelectorAll('#studio [data-go="export"]')].find(b=>/ייצוא/.test(b.textContent||''));
  if(exportBtn){
    exportBtn.classList.remove('hksExportBesideSync74');
  }

  const style=document.createElement('style');
  style.id='hksRemoveStudioSync75';
  style.textContent=`
    #studio #syncBtn{display:none!important;visibility:hidden!important}
    #studio .desktop > :nth-child(2) > .card:has(#playBtn) .grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}
    @media(max-width:849px){
      #studio .desktop > :nth-child(2) > .card:has(#playBtn) .grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.75';
})();