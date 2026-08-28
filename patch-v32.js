// Hebrew Karaoke Studio Web v1.32 — post-render Save to Files flow for iPhone
(function(){
  const $=s=>document.querySelector(s);
  const captured={mp4:null,wmv:null};
  let savePromptShown=false;

  const style=document.createElement('style');
  style.textContent=`
    .saveRenderedFilesBtn{display:none;width:100%;margin-top:12px;min-height:54px;border-radius:12px;border:1px solid #60a4d9;background:linear-gradient(#2587d7,#0e4d82);color:#fff;font:inherit;font-weight:900;font-size:17px}
    .saveRenderedFilesBtn.show{display:block}.saveRenderedHint{display:none;margin-top:8px;padding:10px;border:1px solid #31506b;border-radius:10px;background:#07111c;color:#d4e2ef;font-size:13px;line-height:1.45}.saveRenderedHint.show{display:block}
  `;
  document.head.appendChild(style);

  const renderBtn=$('#dualExportBtn');
  let saveBtn=$('#saveRenderedFilesBtn');
  let hint=$('#saveRenderedHint');
  if(renderBtn && !saveBtn){
    saveBtn=document.createElement('button');
    saveBtn.type='button';saveBtn.id='saveRenderedFilesBtn';saveBtn.className='saveRenderedFilesBtn';
    saveBtn.textContent='📁 בחר תיקייה ושמור את שני הקבצים';
    hint=document.createElement('div');hint.id='saveRenderedHint';hint.className='saveRenderedHint';
    hint.textContent='באייפון לחץ כאן, ואז בחר „שמור בקבצים”. משם תוכל לבחור iCloud Drive, „ב‑iPhone שלי” וכל תיקייה שתרצה.';
    const results=$('.exportResults');
    if(results){results.insertAdjacentElement('afterend',hint);hint.insertAdjacentElement('beforebegin',saveBtn);}
    else renderBtn.insertAdjacentElement('afterend',saveBtn);
  }

  try{
    const prev=setDownloadLink;
    setDownloadLink=function(id,blob,name){
      prev(id,blob,name);
      if(id==='#downloadMp4')captured.mp4={blob,name:$('#downloadMp4')?.download||name||'karaoke.mp4'};
      if(id==='#downloadWmv')captured.wmv={blob,name:$('#downloadWmv')?.download||name||'karaoke.wmv'};
      if(captured.mp4&&captured.wmv){
        saveBtn?.classList.add('show');hint?.classList.add('show');
        setTimeout(()=>{
          if(savePromptShown)return;savePromptShown=true;
          try{setExportState('הרינדור הסתיים — עכשיו בחר תיקייה ושמור את שני הקבצים',100)}catch(e){}
          saveBtn?.scrollIntoView({behavior:'smooth',block:'center'});
        },200);
      }
    };
  }catch(e){console.warn('v1.32 download capture failed',e)}

  if(renderBtn){
    renderBtn.addEventListener('click',()=>{
      captured.mp4=captured.wmv=null;savePromptShown=false;
      saveBtn?.classList.remove('show');hint?.classList.remove('show');
    },true);
  }

  if(saveBtn){
    saveBtn.onclick=async()=>{
      if(!captured.mp4||!captured.wmv){setStatus('קודם צריך לסיים את הרינדור');return;}
      const files=[
        new File([captured.mp4.blob],captured.mp4.name,{type:'video/mp4',lastModified:Date.now()}),
        new File([captured.wmv.blob],captured.wmv.name,{type:'video/x-ms-wmv',lastModified:Date.now()})
      ];
      try{
        if(navigator.share && (!navigator.canShare || navigator.canShare({files}))){
          await navigator.share({files,title:'שמירת קבצי הקריוקי'});
          setStatus('חלון השמירה נפתח — בחרת היכן לשמור את הקבצים');
          return;
        }
        throw new Error('Safari לא מאפשר שיתוף שני קבצים יחד');
      }catch(e){
        if(e?.name==='AbortError'){setStatus('השמירה בוטלה');return;}
        console.warn('share both files failed',e);
        // Fallback: save MP4 first; the individual links remain available for WMV.
        try{
          const one=[files[0]];
          if(navigator.share && (!navigator.canShare || navigator.canShare({files:one}))){
            await navigator.share({files:one,title:'שמירת MP4'});
            setStatus('MP4 נשלח לשמירה. לשמירת WMV לחץ על כפתור „שמור WMV”.');
            return;
          }
        }catch(e2){console.warn('single file share failed',e2)}
        setStatus('Safari לא פתח את „שמור בקבצים”. השתמש בכפתורי שמור MP4 / שמור WMV.');
      }
    };
  }

  const v=$('.version');if(v)v.textContent='Web v1.32';
})();
