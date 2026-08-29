// Hebrew Karaoke Studio Web v1.81 — bigger sync words area, separated primary actions, Save Project in Studio
(function(){
  const studio=document.getElementById('studio');
  const toolbar=document.getElementById('hksToolbarRow80');
  const syncCard=document.getElementById('hksStudioSyncCard');
  if(!studio||!toolbar||!syncCard)return;

  const projectActions=document.getElementById('hksProjectHomeActions');
  const saveProject=document.getElementById('saveProject');
  const syncBtn=document.getElementById('syncBtn2');
  const exportBtn=[...studio.querySelectorAll('[data-go="export"]')].find(b=>/ייצוא/.test(b.textContent||''));

  // Move the existing Save Project action from Lyrics into Studio, next to New/Open.
  if(saveProject && projectActions){
    saveProject.textContent='💾 שמור פרויקט';
    saveProject.classList.add('gbtn','hksStudioSave81');
    projectActions.appendChild(saveProject);
  }

  // Separate file/project controls from Sync + Export so the primary actions are easier to hit.
  let primary=document.getElementById('hksPrimaryActions81');
  if(!primary){
    primary=document.createElement('div');
    primary.id='hksPrimaryActions81';
    toolbar.appendChild(primary);
  }
  if(syncBtn)primary.appendChild(syncBtn);
  if(exportBtn)primary.appendChild(exportBtn);

  const style=document.createElement('style');
  style.id='hksStudioPolish81';
  style.textContent=`
    #hksToolbarRow80{align-items:center!important}
    #hksPrimaryActions81{
      display:flex!important;align-items:center!important;gap:8px!important;
      margin-inline-start:20px!important;padding-inline-start:14px!important;
      border-inline-start:1px solid rgba(255,255,255,.18)!important;
      flex:0 0 auto!important;
    }
    #hksPrimaryActions81 #syncBtn2,
    #hksPrimaryActions81 [data-go="export"]{
      width:auto!important;min-width:105px!important;min-height:42px!important;height:42px!important;
      padding:5px 12px!important;font-size:14px!important;font-weight:900!important;
    }
    #hksProjectHomeActions .hksStudioSave81{
      display:block!important;visibility:visible!important;opacity:1!important;
      width:auto!important;min-width:76px!important;min-height:32px!important;height:32px!important;
      padding:3px 8px!important;font-size:10px!important;border-radius:8px!important;
    }

    /* More vertical room where the synchronization words live. */
    #hksStudioSyncCard{min-height:455px!important;padding-bottom:8px!important}
    #hksStudioSyncCard #wordList{
      min-height:335px!important;
      height:calc(100dvh - 430px)!important;
      max-height:590px!important;
      overflow:auto!important;
    }

    @media(min-width:700px){
      #hksStudioSyncCard{min-height:500px!important}
      #hksStudioSyncCard #wordList{
        min-height:370px!important;
        height:calc(100dvh - 390px)!important;
        max-height:650px!important;
      }
    }
    @media(max-width:699px){
      #hksPrimaryActions81{margin-inline-start:10px!important;padding-inline-start:8px!important;gap:5px!important}
      #hksPrimaryActions81 #syncBtn2,#hksPrimaryActions81 [data-go="export"]{min-width:90px!important}
      #hksStudioSyncCard #wordList{min-height:300px!important;height:46dvh!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.81';
})();