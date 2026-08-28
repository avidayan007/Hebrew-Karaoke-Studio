// Hebrew Karaoke Studio Web v1.33 — WAV picker compatibility for older iPhone/iPad Safari
(function(){
  const input=document.getElementById('audioFile');
  if(!input)return;

  // Older iOS/iPadOS versions can hide WAV files when the picker is filtered only by audio/*.
  // Explicit extensions/MIME types keep WAV visible while preserving the normal audio choices.
  input.setAttribute('accept','.wav,.wave,audio/wav,audio/x-wav,audio/wave,audio/vnd.wave,.mp3,audio/mpeg,.m4a,audio/mp4,.aac,audio/aac,audio/*');

  const title=input.previousElementSibling;
  if(title && title.classList.contains('pickerTitle')) title.textContent='🎵 מוזיקה — WAV / MP3 / M4A / AAC';

  // On older Apple file pickers, MIME information may be blank. The existing loader works from
  // the selected File itself, so do not reject files just because file.type is empty.
  input.addEventListener('change',function(){
    const f=this.files&&this.files[0];
    if(!f)return;
    const name=String(f.name||'');
    if(/\.(wav|wave)$/i.test(name)){
      try{setStatus('קובץ WAV נבחר: '+name+' — טוען…')}catch(_){ }
    }
  },true);

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.33';
})();
