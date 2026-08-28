// Hebrew Karaoke Studio Web v1.45 — allow normal spaces while typing song title
(function(){
  const input=document.getElementById('hksSongTitleInput');
  if(!input)return;

  // The core app uses Space as a global sync shortcut. While typing the song title,
  // keep Space inside the input and do not let the global shortcut intercept it.
  input.addEventListener('keydown',e=>{
    if(e.code==='Space'||e.key===' '){
      e.stopPropagation();
    }
  });
  input.addEventListener('keyup',e=>{
    if(e.code==='Space'||e.key===' '){
      e.stopPropagation();
    }
  });

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.45';
})();
