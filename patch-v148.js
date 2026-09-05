// Avi Karaoke Studio Web v1.148 — export lyrics follow sync timing, up to 6 lines, no karaoke coloring
(function(){
  window.__hksExportLyrics148={pageLines:6,colored:false,synced:true};

  // Keep non-iPhone/Desktop ASS export consistent with the iPhone renderer:
  // up to six lines per page, page changes at the first synchronized word in that page.
  try{
    buildSlides=function(duration){
      const PAGE_LINES=6;
      const maxLine=words.reduce((m,w)=>Math.max(m,w.line??0),0),slides=[];
      for(let start=0;start<=maxLine;start+=PAGE_LINES){
        const group=words.filter(w=>(w.line??0)>=start&&(w.line??0)<start+PAGE_LINES);
        const synced=group.filter(w=>Number.isFinite(Number(w.time)));
        if(!group.length||!synced.length)continue;
        const lines=[];
        for(let l=start;l<start+PAGE_LINES;l++){
          const text=words.filter(w=>(w.line??0)===l).map(w=>w.t).join(' ');
          if(text)lines.push(text);
        }
        slides.push({
          start:start===0?0:Math.min(...synced.map(w=>Number(w.time))),
          text:lines.join('\\N')
        });
      }
      slides.sort((a,b)=>a.start-b.start);
      for(let i=0;i<slides.length;i++)slides[i].end=i+1<slides.length?Math.max(slides[i].start+.05,slides[i+1].start):duration;
      return slides.filter(s=>s.end>s.start);
    };
  }catch(_){}

  const note=document.createElement('div');
  note.id='hksExportLyricsNote148';
  note.className='small';
  note.style.cssText='margin:8px 0;color:#b8c7d6;line-height:1.45;direction:rtl';
  note.textContent='כתוביות Export: עד 6 שורות בכל עמוד • המעבר לפי הסנכרון • ללא צביעת מילים.';
  const btn=document.getElementById('dualExportBtn');
  if(btn&&!document.getElementById('hksExportLyricsNote148'))btn.parentElement?.insertBefore(note,btn);

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.148';
  try{setStatus('v1.148 מוכן — Export מסונכרן עד 6 שורות, בלי צביעת מילים.')}catch(_){}
})();
