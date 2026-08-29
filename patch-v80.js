// Hebrew Karaoke Studio Web v1.80 — compact file toolbar, larger sync workspace, preview right / controls left
(function(){
  const studio=document.getElementById('studio');
  const desktop=studio?.querySelector('.desktop');
  if(!studio||!desktop)return;

  const previewColumn=desktop.children[0];
  const controlsColumn=desktop.children[1];
  if(!previewColumn||!controlsColumn)return;

  const filesCard=document.getElementById('hksCompactFilesCard70') || [...controlsColumn.querySelectorAll('.card')].find(c=>/קבצים|רקע/.test(c.querySelector('h3')?.textContent||''));
  const audioInput=document.getElementById('audioFile');
  const imageInput=document.getElementById('imageFile');
  const videoInput=document.getElementById('videoFile');
  const syncBtn=document.getElementById('syncBtn2');
  const exportBtn=[...studio.querySelectorAll('[data-go="export"]')].find(b=>/ייצוא/.test(b.textContent||''));
  const projectActions=document.getElementById('hksProjectHomeActions');
  const syncCard=document.getElementById('hksStudioSyncCard');

  // Build one compact toolbar instead of long native file inputs.
  let toolbar=document.getElementById('hksCompactToolbar80');
  if(!toolbar){
    toolbar=document.createElement('div');
    toolbar.id='hksCompactToolbar80';
    toolbar.className='card';
    toolbar.innerHTML=`<div class="hksToolbarRow80" id="hksToolbarRow80"></div>`;
    controlsColumn.insertBefore(toolbar,controlsColumn.firstChild);
  }
  const row=toolbar.querySelector('#hksToolbarRow80');

  function makeFileBtn(id,label,input){
    if(!input)return null;
    const b=document.createElement('button');
    b.type='button';b.id=id;b.className='gbtn hksTinyTool80';b.textContent=label;
    b.onclick=()=>input.click();
    row.appendChild(b);
    return b;
  }

  // Keep actual file inputs alive for app logic, but hide the huge UI.
  if(filesCard){
    filesCard.style.setProperty('display','none','important');
  }
  [audioInput,imageInput,videoInput].forEach(i=>{if(i){i.style.setProperty('display','none','important')}});
  makeFileBtn('hksLoadAudio80','🎵 שיר',audioInput);
  makeFileBtn('hksLoadImage80','🖼 רקע',imageInput);
  makeFileBtn('hksLoadVideo80','🎬 וידאו',videoInput);

  // Move compact New/Open project actions into the same toolbar.
  if(projectActions){
    projectActions.classList.add('hksProjectTools80');
    row.appendChild(projectActions);
  }

  // Put large Sync + Export in this same compact top row.
  if(syncBtn){
    syncBtn.classList.add('hksPrimaryTool80');
    syncBtn.textContent='◆ סנכרן';
    row.appendChild(syncBtn);
  }
  if(exportBtn){
    exportBtn.classList.add('hksPrimaryTool80','hksExportTool80');
    row.appendChild(exportBtn);
  }

  // Make sure sync card remains in the controls column and receives the freed space.
  if(syncCard && !controlsColumn.contains(syncCard))controlsColumn.appendChild(syncCard);

  const style=document.createElement('style');
  style.id='hksStudioLayout80';
  style.textContent=`
    #hksCompactToolbar80{padding:5px!important;margin-bottom:4px!important}
    #hksToolbarRow80{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:5px!important;direction:rtl!important}
    #hksToolbarRow80 .hksTinyTool80{
      width:auto!important;min-width:64px!important;min-height:32px!important;height:32px!important;
      padding:3px 8px!important;font-size:11px!important;border-radius:8px!important;flex:0 0 auto!important;
    }
    #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80{
      display:flex!important;gap:5px!important;margin:0!important;padding:0!important;width:auto!important;flex:0 0 auto!important;
    }
    #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80 .gbtn{
      width:auto!important;min-width:64px!important;min-height:32px!important;height:32px!important;
      padding:3px 8px!important;font-size:10px!important;border-radius:8px!important;
    }
    #hksToolbarRow80 .hksPrimaryTool80{
      width:auto!important;min-width:88px!important;min-height:42px!important;height:42px!important;
      padding:5px 12px!important;font-size:14px!important;font-weight:900!important;border-radius:10px!important;
      flex:0 0 auto!important;
    }
    #hksToolbarRow80 #syncBtn2.hksPrimaryTool80{min-width:112px!important;font-size:15px!important}

    /* Remove empty space left by the old transport card after moving Sync/Export out. */
    #studio .desktop > :nth-child(2) > .card:has(#playBtn){padding:5px!important;margin-bottom:4px!important}
    #studio .desktop > :nth-child(2) > .card:has(#playBtn) .grid{gap:5px!important}

    /* Give synchronization panel the saved vertical space. */
    #hksStudioSyncCard{
      min-height:390px!important;
      padding:9px!important;
      margin-top:4px!important;
    }
    #hksStudioSyncCard #wordList{
      min-height:255px!important;
      max-height:430px!important;
    }

    @media(min-width:700px){
      #studio .desktop{
        direction:ltr!important;
        grid-template-columns:minmax(330px,.88fr) minmax(0,1.12fr)!important;
        gap:8px!important;
        align-items:start!important;
      }
      /* Swap sides: controls/sync LEFT, preview/player RIGHT. */
      #studio .desktop > :first-child{grid-column:2!important;grid-row:1!important;direction:rtl!important}
      #studio .desktop > :nth-child(2){grid-column:1!important;grid-row:1!important;direction:rtl!important}
      #hksStudioSyncCard #wordList{min-height:300px!important;max-height:500px!important}
    }

    @media(max-width:699px){
      #hksToolbarRow80{gap:4px!important}
      #hksToolbarRow80 .hksTinyTool80,
      #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80 .gbtn{min-width:58px!important;padding:3px 6px!important}
      #hksToolbarRow80 .hksPrimaryTool80{min-height:40px!important;height:40px!important;min-width:82px!important}
      #hksToolbarRow80 #syncBtn2.hksPrimaryTool80{min-width:104px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.80';
})();