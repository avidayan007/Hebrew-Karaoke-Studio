// Hebrew Karaoke Studio Web v1.54 — remove old large fullscreen button under font controls
(function(){
  const oldLarge=document.getElementById('hksBelowFull');
  if(oldLarge) oldLarge.remove();

  const style=document.createElement('style');
  style.textContent=`#hksBelowFull{display:none!important}`;
  document.head.appendChild(style);

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.54';
})();
