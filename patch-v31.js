// Hebrew Karaoke Studio Web v1.31 — choose project save location on iPhone
(function(){
  const $=s=>document.querySelector(s);
  const MAGIC='HKSP30\n';

  function cleanName(s){return String(s||'').trim().replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').slice(0,80)}
  function mediaEntry(file,offset){
    if(!file)return null;
    return {name:file.name||'media',type:file.type||'application/octet-stream',size:file.size||0,lastModified:file.lastModified||Date.now(),offset};
  }

  function buildProjectBlob(name){
    let offset=0;
    const audioMeta=mediaEntry(audioInputFile,offset);if(audioMeta)offset+=audioMeta.size;
    const imageMeta=mediaEntry(imageInputFile,offset);if(imageMeta)offset+=imageMeta.size;
    const videoMeta=mediaEntry(videoInputFile,offset);if(videoMeta)offset+=videoMeta.size;
    const manifest={
      app:'Hebrew Karaoke Studio',version:'1.31',format:'HKSP30',name,savedAt:new Date().toISOString(),
      lyrics:$('#lyricsText')?.value||'',words:Array.isArray(words)?words:[],current:Number(current)||0,
      audioTime:Number(audio.currentTime)||0,
      exportSettings:{mp4Video:$('#mp4Video')?.value||null,mp4Audio:$('#mp4Audio')?.value||null,wmvVideo:$('#wmvVideo')?.value||null,wmvAudio:$('#wmvAudio')?.value||null},
      media:{audio:audioMeta,image:imageMeta,video:videoMeta}
    };
    const manifestBytes=new TextEncoder().encode(JSON.stringify(manifest));
    const lengthLine=String(manifestBytes.length).padStart(12,'0')+'\n';
    const parts=[MAGIC,lengthLine,manifestBytes];
    if(audioInputFile)parts.push(audioInputFile);
    if(imageInputFile)parts.push(imageInputFile);
    if(videoInputFile)parts.push(videoInputFile);
    return new Blob(parts,{type:'application/octet-stream'});
  }

  async function saveWithLocation(){
    const suggested=cleanName(window.__currentProjectName||'פרויקט קריוקי');
    const entered=prompt('תן שם לפרויקט:',suggested);
    if(entered===null)return;
    const name=cleanName(entered)||'פרויקט קריוקי';
    window.__currentProjectName=name;
    const filename=name+'.karaoke-project';

    // On browsers that support the File System Access API, ask for the exact folder/file first.
    if(typeof window.showSaveFilePicker==='function'){
      try{
        const handle=await window.showSaveFilePicker({
          suggestedName:filename,
          types:[{description:'Hebrew Karaoke Studio Project',accept:{'application/octet-stream':['.karaoke-project']}}]
        });
        setStatus('מכין את הפרויקט המלא לשמירה…');
        const blob=buildProjectBlob(name);
        const writable=await handle.createWritable();
        await writable.write(blob);await writable.close();
        setStatus(`הפרויקט נשמר: ${name} — ${(blob.size/1024/1024).toFixed(1)} MB`);
        return;
      }catch(e){
        if(e?.name==='AbortError'){setStatus('שמירת הפרויקט בוטלה');return;}
        console.warn('showSaveFilePicker failed, using iPhone share sheet',e);
      }
    }

    setStatus('מכין את הפרויקט המלא ובוחר מקום שמירה…');
    const blob=buildProjectBlob(name);
    const file=new File([blob],filename,{type:'application/octet-stream',lastModified:Date.now()});

    // iPhone/Safari: open the native share sheet. Choose “Save to Files” and then any folder in iCloud Drive or On My iPhone.
    if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
      try{
        await navigator.share({files:[file],title:'שמירת פרויקט קריוקי'});
        setStatus(`הפרויקט מוכן/נשמר: ${name} — ${(blob.size/1024/1024).toFixed(1)} MB`);
        return;
      }catch(e){
        if(e?.name==='AbortError'){setStatus('שמירת הפרויקט בוטלה');return;}
        console.warn('share failed, falling back to download',e);
      }
    }

    // Last-resort fallback for browsers that do not expose a native save/share picker.
    download(filename,blob,'application/octet-stream');
    setStatus('הפרויקט הורד. באייפון בחר ״שתף״ → ״שמור בקבצים״ כדי לבחור תיקייה.');
  }

  const save=$('#saveProject');
  if(save){
    save.textContent='💾 שמור פרויקט מלא ובחר תיקייה';
    save.onclick=()=>saveWithLocation().catch(e=>{console.error(e);setStatus('שמירת הפרויקט נכשלה: '+(e?.message||e));});
  }

  const note=document.createElement('div');
  note.className='exportNote small';
  note.textContent='באייפון, לאחר מתן שם לפרויקט ייפתח חלון השיתוף של iOS. בחר „שמור בקבצים” ואז בחר את התיקייה הרצויה ב‑iCloud Drive או „ב‑iPhone שלי”.';
  save?.closest('.card')?.appendChild(note);

  const v=$('.version');if(v)v.textContent='Web v1.31';
})();
