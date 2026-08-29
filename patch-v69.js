// Hebrew Karaoke Studio Web v1.69 — synchronization lives inside the Studio screen
(function(){
  const studio=document.getElementById('studio');
  const syncPage=document.getElementById('sync');
  if(!studio||!syncPage)return;

  // Keep one set of the original controls/IDs/listeners: move the real sync card, do not clone it.
  const syncCard=syncPage.querySelector('.card');
  if(syncCard){
    syncCard.id='hksStudioSyncCard';
    const title=syncCard.querySelector('h3');
    if(title)title.textContent='סנכרון מילה־מילה — בתוך הסטודיו';

    const desktop=studio.querySelector('.desktop');
    const leftColumn=desktop?.firstElementChild;
    if(leftColumn){
      leftColumn.appendChild(syncCard);
    }else{
      studio.appendChild(syncCard);
    }
  }

  // The separate Sync tab/page is no longer part of the normal workflow.
  const syncTab=document.querySelector('.tab[data-page="sync"]');
  if(syncTab)syncTab.style.setProperty('display','none','important');
  syncPage.style.setProperty('display','none','important');

  // Any old code that asks to navigate to Sync is redirected to Studio.
  try{
    const oldGo=window.go;
    if(typeof oldGo==='function'&&!oldGo.__hksStudioSync69){
      const wrapped=function(id){return oldGo(id==='sync'?'studio':id)};
      wrapped.__hksStudioSync69=true;
      window.go=wrapped;
    }
  }catch(_){}

  // Prepare lyrics may still be wired to the original prepare(), which ends with go('sync').
  // Force the UI back to Studio after that handler completes, without changing synchronization data.
  const prepareBtn=document.getElementById('prepareBtn');
  if(prepareBtn){
    prepareBtn.addEventListener('click',()=>setTimeout(()=>{
      try{window.go?.('studio')}catch(_){}
      document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id==='studio'));
      document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.page==='studio'));
      document.getElementById('hksStudioSyncCard')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    },0));
  }

  // If something has already left the user on the old Sync page, return immediately to Studio.
  if(syncPage.classList.contains('on')){
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id==='studio'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.page==='studio'));
  }

  const style=document.createElement('style');
  style.textContent=`
    #hksStudioSyncCard{margin-top:9px}
    #hksStudioSyncCard #wordList{max-height:360px;overflow:auto;border:1px solid #263747;border-radius:10px;margin:8px 0}
    @media(min-width:850px){#hksStudioSyncCard{position:relative}}
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.69';
})();