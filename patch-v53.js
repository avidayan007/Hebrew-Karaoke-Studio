// Hebrew Karaoke Studio Web v1.53 — force song title to text-only, no frame/background/note
(function(){
  const slide=document.getElementById('hksSongTitleSlide');
  const frame=document.getElementById('hksSongTitleFrame');
  const note=document.getElementById('hksSongTitleNote');
  const title=document.getElementById('hksSongTitleText');
  if(!slide||!frame||!title)return;

  slide.style.setProperty('background','transparent','important');
  slide.style.setProperty('padding','0 5%','important');

  const props={
    background:'transparent',border:'0',boxShadow:'none',padding:'0',borderRadius:'0',
    maxWidth:'94%',minWidth:'0',width:'auto',height:'auto',outline:'0'
  };
  Object.entries(props).forEach(([k,v])=>frame.style.setProperty(k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v,'important'));
  if(note)note.style.setProperty('display','none','important');

  const style=document.createElement('style');
  style.textContent=`
    #hksSongTitleSlide{background:transparent!important}
    #hksSongTitleFrame{background:transparent!important;background-image:none!important;border:none!important;outline:none!important;box-shadow:none!important;padding:0!important;border-radius:0!important;width:auto!important;height:auto!important;min-width:0!important}
    #hksSongTitleFrame::before,#hksSongTitleFrame::after{display:none!important;content:none!important;background:none!important;border:0!important;box-shadow:none!important}
    #hksSongTitleNote{display:none!important}
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.53';
})();
