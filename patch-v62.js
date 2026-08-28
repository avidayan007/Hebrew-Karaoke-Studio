// Hebrew Karaoke Studio Web v1.62 — New/Open project actions on the main Studio screen
(function(){
  const studio=document.getElementById('studio');
  const loadInput=document.getElementById('loadProject');
  const audioEl=document.getElementById('audio');
  if(!studio)return;

  const style=document.createElement('style');
  style.textContent=`
    #hksProjectHomeActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 9px}
    #hksProjectHomeActions .gbtn{min-height:48px;font-size:14px}
    @media(max-width:520px){#hksProjectHomeActions{grid-template-columns:1fr 1fr;gap:6px}#hksProjectHomeActions .gbtn{font-size:13px;padding:0 6px}}
  `;
  document.head.appendChild(style);

  let actions=document.getElementById('hksProjectHomeActions');
  if(!actions){
    actions=document.createElement('div');
    actions.id='hksProjectHomeActions';
    actions.innerHTML=`<button type="button" class="gbtn green" id="hksNewProjectBtn">＋ פרויקט חדש</button><button type="button" class="gbtn blue" id="hksOpenProjectBtn">📂 פתח פרויקט קיים</button>`;
    studio.insertBefore(actions,studio.firstChild);
  }

  function clearFileInput(id){const el=document.getElementById(id);if(el)try{el.value=''}catch(_){}}
  function clearMedia(){
    try{audioEl?.pause()}catch(_){}
    try{if(audioEl?.src?.startsWith('blob:'))URL.revokeObjectURL(audioEl.src)}catch(_){}
    try{audioEl?.removeAttribute('src');audioEl?.load()}catch(_){}
    try{audioInputFile=null;audioBuffer=null}catch(_){}
    try{imageInputFile=null;videoInputFile=null}catch(_){}
    const img=document.getElementById('bgImg');
    if(img){try{if(img.src?.startsWith('blob:'))URL.revokeObjectURL(img.src)}catch(_){}img.removeAttribute('src');img.hidden=true}
    const video=document.getElementById('bgVideo');
    if(video){try{video.pause();if(video.src?.startsWith('blob:'))URL.revokeObjectURL(video.src)}catch(_){}video.removeAttribute('src');video.hidden=true;try{video.load()}catch(_){}}
    clearFileInput('audioFile');clearFileInput('imageFile');clearFileInput('videoFile');
    const wave=document.getElementById('wave');if(wave){try{wave.getContext('2d')?.clearRect(0,0,wave.width,wave.height)}catch(_){}}
  }

  function newProject(){
    const hasWork=(()=>{try{return !!((document.getElementById('lyricsText')?.value||'').trim() || (Array.isArray(words)&&words.length) || audioInputFile || imageInputFile || videoInputFile)}catch(_){return false}})();
    if(hasWork && !confirm('לפתוח פרויקט חדש? העבודה הנוכחית שלא נשמרה תימחק.'))return;
    try{words=[];current=0}catch(_){}
    const lyrics=document.getElementById('lyricsText');if(lyrics){lyrics.value='';lyrics.dispatchEvent(new Event('input',{bubbles:true}))}
    clearMedia();
    window.__currentProjectName='';
    const title=document.getElementById('hksSongTitleTextInput');
    if(title){title.value='';title.dispatchEvent(new Event('input',{bubbles:true}))}
    try{if(window.__hksSongTitleState)window.__hksSongTitleState.text=''}catch(_){}
    const preview=document.getElementById('lyricsPreview');if(preview){preview.innerHTML='טען שיר והכנס מילים';preview.style.removeProperty('visibility');preview.style.removeProperty('opacity');preview.setAttribute('aria-hidden','false')}
    try{renderWords()}catch(_){}
    try{window.__hksDrawSyncWave?.()}catch(_){}
    try{window.__hksBeginFreshSyncSession?.()}catch(_){}
    try{go('studio')}catch(_){}
    try{setStatus('פרויקט חדש נפתח — אפשר לטעון מוזיקה, רקע ומילים')}catch(_){}
  }

  document.getElementById('hksNewProjectBtn')?.addEventListener('click',newProject);
  document.getElementById('hksOpenProjectBtn')?.addEventListener('click',()=>{
    if(loadInput){loadInput.value='';loadInput.click()}
  });

  window.__hksNewProject=newProject;
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.62';
})();
