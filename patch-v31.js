// Hebrew Karaoke Studio Web v1.31 — complete project save/open + choose save location on iPhone
(function(){
  const $=s=>document.querySelector(s);
  const MAGIC='HKSP30\n';
  const HEADER_SIZE=20;

  function cleanName(s){return String(s||'').trim().replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').slice(0,80)}
  function setSelect(id,value){const el=$(id);if(el&&value!=null)el.value=value}
  function mediaEntry(file,offset){if(!file)return null;return {name:file.name||'media',type:file.type||'application/octet-stream',size:file.size||0,lastModified:file.lastModified||Date.now(),offset};}

  function buildProjectBlob(name){
    let offset=0;
    const audioMeta=mediaEntry(audioInputFile,offset);if(audioMeta)offset+=audioMeta.size;
    const imageMeta=mediaEntry(imageInputFile,offset);if(imageMeta)offset+=imageMeta.size;
    const videoMeta=mediaEntry(videoInputFile,offset);if(videoMeta)offset+=videoMeta.size;
    const manifest={app:'Hebrew Karaoke Studio',version:'1.31',format:'HKSP30',name,savedAt:new Date().toISOString(),lyrics:$('#lyricsText')?.value||'',words:Array.isArray(words)?words:[],current:Number(current)||0,audioTime:Number(audio.currentTime)||0,exportSettings:{mp4Video:$('#mp4Video')?.value||null,mp4Audio:$('#mp4Audio')?.value||null,wmvVideo:$('#wmvVideo')?.value||null,wmvAudio:$('#wmvAudio')?.value||null},media:{audio:audioMeta,image:imageMeta,video:videoMeta}};
    const manifestBytes=new TextEncoder().encode(JSON.stringify(manifest));
    const lengthLine=String(manifestBytes.length).padStart(12,'0')+'\n';
    const parts=[MAGIC,lengthLine,manifestBytes];
    if(audioInputFile)parts.push(audioInputFile);if(imageInputFile)parts.push(imageInputFile);if(videoInputFile)parts.push(videoInputFile);
    return new Blob(parts,{type:'application/octet-stream'});
  }

  async function saveWithLocation(){
    const suggested=cleanName(window.__currentProjectName||'פרויקט קריוקי');
    const entered=prompt('תן שם לפרויקט:',suggested);if(entered===null)return;
    const name=cleanName(entered)||'פרויקט קריוקי';window.__currentProjectName=name;
    const filename=name+'.karaoke-project';

    if(typeof window.showSaveFilePicker==='function'){
      try{
        const handle=await window.showSaveFilePicker({suggestedName:filename,types:[{description:'Hebrew Karaoke Studio Project',accept:{'application/octet-stream':['.karaoke-project']}}]});
        setStatus('מכין את הפרויקט המלא לשמירה…');
        const blob=buildProjectBlob(name);const writable=await handle.createWritable();await writable.write(blob);await writable.close();
        setStatus(`הפרויקט נשמר: ${name} — ${(blob.size/1024/1024).toFixed(1)} MB`);return;
      }catch(e){if(e?.name==='AbortError'){setStatus('שמירת הפרויקט בוטלה');return;}console.warn('showSaveFilePicker failed, using iPhone share sheet',e);}
    }

    setStatus('מכין את הפרויקט המלא ובוחר מקום שמירה…');
    const blob=buildProjectBlob(name);const file=new File([blob],filename,{type:'application/octet-stream',lastModified:Date.now()});
    if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
      try{await navigator.share({files:[file],title:'שמירת פרויקט קריוקי'});setStatus(`הפרויקט מוכן/נשמר: ${name} — ${(blob.size/1024/1024).toFixed(1)} MB`);return;}
      catch(e){if(e?.name==='AbortError'){setStatus('שמירת הפרויקט בוטלה');return;}console.warn('share failed, falling back to download',e);}
    }
    download(filename,blob,'application/octet-stream');setStatus('הפרויקט הורד. באייפון בחר ״שתף״ → ״שמור בקבצים״ כדי לבחור תיקייה.');
  }

  async function restoreAudio(file,time){
    audio.pause();try{if(audio.src&&audio.src.startsWith('blob:'))URL.revokeObjectURL(audio.src)}catch(e){}
    audioInputFile=file;audio.src=URL.createObjectURL(file);audio.load();
    try{const ab=await file.arrayBuffer();const ac=new (window.AudioContext||window.webkitAudioContext)();audioBuffer=await ac.decodeAudioData(ab.slice(0));drawWave();ac.close?.();}catch(e){audioBuffer=null;console.warn('waveform restore failed',e)}
    if(Number.isFinite(time)&&time>0){const seek=()=>{try{audio.currentTime=Math.min(time,Number(audio.duration)||time)}catch(e){}};if(audio.readyState>=1)seek();else audio.addEventListener('loadedmetadata',seek,{once:true});}
  }
  function restoreImage(file){imageInputFile=file;videoInputFile=null;const v=$('#bgVideo');if(v){v.pause();v.hidden=true;}const im=$('#bgImg');if(im){try{if(im.src&&im.src.startsWith('blob:'))URL.revokeObjectURL(im.src)}catch(e){}im.src=URL.createObjectURL(file);im.hidden=false;}}
  function restoreVideo(file){videoInputFile=file;imageInputFile=null;const im=$('#bgImg');if(im)im.hidden=true;const v=$('#bgVideo');if(v){try{if(v.src&&v.src.startsWith('blob:'))URL.revokeObjectURL(v.src)}catch(e){}v.src=URL.createObjectURL(file);v.hidden=false;v.load();v.play().catch(()=>{});}}

  async function openCompleteProject(file){
    const head=await file.slice(0,HEADER_SIZE).text();if(!head.startsWith(MAGIC))return false;
    const len=Number(head.slice(MAGIC.length,MAGIC.length+12));if(!Number.isFinite(len)||len<2)throw new Error('כותרת פרויקט לא תקינה');
    const dataStart=HEADER_SIZE+len;const manifest=JSON.parse(await file.slice(HEADER_SIZE,dataStart).text());setStatus('פותח פרויקט ומחזיר את קבצי המדיה…');
    $('#lyricsText').value=manifest.lyrics||'';words=Array.isArray(manifest.words)?manifest.words:[];current=Number(manifest.current)||0;
    const es=manifest.exportSettings||{};setSelect('#mp4Video',es.mp4Video);setSelect('#mp4Audio',es.mp4Audio);setSelect('#wmvVideo',es.wmvVideo);setSelect('#wmvAudio',es.wmvAudio);
    const m=manifest.media||{};const makeFile=(meta)=>{if(!meta)return null;const b=file.slice(dataStart+meta.offset,dataStart+meta.offset+meta.size,meta.type||'application/octet-stream');return new File([b],meta.name||'media',{type:meta.type||'',lastModified:meta.lastModified||Date.now()});};
    const af=makeFile(m.audio),imf=makeFile(m.image),vf=makeFile(m.video);
    if(af)await restoreAudio(af,Number(manifest.audioTime)||0);else{audioInputFile=null;audioBuffer=null;audio.pause();audio.removeAttribute('src');audio.load();}
    if(vf)restoreVideo(vf);else if(imf)restoreImage(imf);else{imageInputFile=null;videoInputFile=null;const im=$('#bgImg');if(im)im.hidden=true;const v=$('#bgVideo');if(v){v.pause();v.hidden=true;}}
    window.__currentProjectName=cleanName(manifest.name||file.name.replace(/\.karaoke-project$/i,''));renderWords();updateSyncPreview();updateLivePreview();setStatus('הפרויקט המלא נפתח: '+window.__currentProjectName+' — המוזיקה והרקע הוחזרו');return true;
  }

  const save=$('#saveProject');if(save){save.textContent='💾 שמור פרויקט מלא ובחר תיקייה';save.onclick=()=>saveWithLocation().catch(e=>{console.error(e);setStatus('שמירת הפרויקט נכשלה: '+(e?.message||e));});}
  const load=$('#loadProject');if(load){load.accept='.karaoke-project,.json,.karaoke.json,application/json,application/octet-stream';const oldHandler=load.onchange;load.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(await openCompleteProject(f)){e.target.value='';return;}if(typeof oldHandler==='function'){await oldHandler.call(load,e);return;}throw new Error('פורמט פרויקט לא מוכר');}catch(err){console.error(err);setStatus('לא הצלחתי לפתוח את קובץ הפרויקט: '+(err?.message||err));e.target.value='';}};const label=load.previousElementSibling;if(label?.classList?.contains('pickerTitle'))label.textContent='📂 פתח פרויקט מלא / ישן';}

  const note=document.createElement('div');note.className='exportNote small';note.textContent='באייפון, אחרי שתיתן שם לפרויקט ייפתח חלון השיתוף של iOS. בחר „שמור בקבצים” ואז בחר את התיקייה הרצויה ב‑iCloud Drive או „ב‑iPhone שלי”.';save?.closest('.card')?.appendChild(note);
  const v=$('.version');if(v)v.textContent='Web v1.31';
})();
