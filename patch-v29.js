// Hebrew Karaoke Studio Web v1.29 — named project save/open
(function(){
  const $=s=>document.querySelector(s);
  function cleanName(s){return String(s||'').trim().replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').slice(0,80)}
  function projectPayload(name){
    return {
      app:'Hebrew Karaoke Studio',version:'1.29',name,
      savedAt:new Date().toISOString(),lyrics:$('#lyricsText')?.value||'',
      words:Array.isArray(words)?words:[],current:Number(current)||0,
      exportSettings:{
        mp4Video:$('#mp4Video')?.value||null,mp4Audio:$('#mp4Audio')?.value||null,
        wmvVideo:$('#wmvVideo')?.value||null,wmvAudio:$('#wmvAudio')?.value||null
      },
      mediaNames:{audio:audioInputFile?.name||'',image:imageInputFile?.name||'',video:videoInputFile?.name||''}
    };
  }
  const save=$('#saveProject');
  if(save){
    save.textContent='💾 שמור פרויקט בשם';
    save.onclick=()=>{
      const suggested=cleanName(window.__currentProjectName||'פרויקט קריוקי');
      const entered=prompt('תן שם לפרויקט:',suggested);
      if(entered===null)return;
      const name=cleanName(entered)||'פרויקט קריוקי';
      window.__currentProjectName=name;
      const json=JSON.stringify(projectPayload(name),null,2);
      download(name+'.karaoke.json',json,'application/json;charset=utf-8');
      setStatus('הפרויקט נשמר בשם: '+name);
    };
  }
  const load=$('#loadProject');
  if(load){
    load.accept='.json,.karaoke.json,application/json';
    const label=document.createElement('div');
    label.className='pickerTitle';label.textContent='📂 פתח פרויקט שמור';
    load.insertAdjacentElement('beforebegin',label);
    load.onchange=async e=>{
      const f=e.target.files?.[0];if(!f)return;
      try{
        const p=JSON.parse(await f.text());
        $('#lyricsText').value=p.lyrics||'';words=Array.isArray(p.words)?p.words:[];current=Number(p.current)||0;
        if(p.exportSettings){
          if($('#mp4Video')&&p.exportSettings.mp4Video)$('#mp4Video').value=p.exportSettings.mp4Video;
          if($('#mp4Audio')&&p.exportSettings.mp4Audio)$('#mp4Audio').value=p.exportSettings.mp4Audio;
          if($('#wmvVideo')&&p.exportSettings.wmvVideo)$('#wmvVideo').value=p.exportSettings.wmvVideo;
          if($('#wmvAudio')&&p.exportSettings.wmvAudio)$('#wmvAudio').value=p.exportSettings.wmvAudio;
        }
        window.__currentProjectName=cleanName(p.name||f.name.replace(/\.karaoke\.json$|\.json$/i,''));
        renderWords();updateSyncPreview();updateLivePreview();
        setStatus('הפרויקט נפתח: '+window.__currentProjectName);
      }catch(err){setStatus('לא הצלחתי לפתוח את קובץ הפרויקט');console.error(err)}
      finally{e.target.value=''}
    };
  }
  const v=$('.version');if(v)v.textContent='Web v1.29';
})();
