// Avi Karaoke Studio Web v1.99 — 4/5/6 lyric lines per screen + preserve blank lines exactly
(function(){
  const textarea=document.getElementById('lyricsText');
  const host=document.getElementById('hksLyricsScreenPreview79');
  if(!textarea||!host)return;

  const KEY='hksLyricsLinesPerScreen99';
  let linesPerScreen=Math.max(4,Math.min(6,Number(localStorage.getItem(KEY)||4)));
  let pageIndex=0;

  // Add a simple 4/5/6 selector to the Lyrics preview header.
  const head=host.querySelector('.hksPreviewHead79');
  let chooser=document.getElementById('hksLinesPerScreen99');
  if(!chooser&&head){
    chooser=document.createElement('div');
    chooser.id='hksLinesPerScreen99';
    chooser.innerHTML=`<span>שורות במסך</span>
      <button type="button" data-lines="4">4</button>
      <button type="button" data-lines="5">5</button>
      <button type="button" data-lines="6">6</button>`;
    head.appendChild(chooser);
  }

  const rawLines=()=>textarea.value.replace(/\r/g,'').split('\n');

  function screens(){
    const lines=rawLines();
    const out=[];
    for(let i=0;i<Math.max(lines.length,1);i+=linesPerScreen){
      const chunk=lines.slice(i,i+linesPerScreen);
      while(chunk.length<linesPerScreen)chunk.push('');
      out.push(chunk);
    }
    return out.length?out:[Array(linesPerScreen).fill('')];
  }
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  function renderLyricsPreview99(){
    const gs=screens();
    pageIndex=Math.max(0,Math.min(pageIndex,gs.length-1));
    const lines=gs[pageIndex];
    const box=document.getElementById('hksLyricsMiniLines79');
    if(box){
      const hasAny=lines.some(x=>x.trim());
      box.innerHTML=hasAny
        ? lines.map(x=>`<div class="hksExactLine99${x.trim()?'':' hksBlankLine99'}">${x.trim()?esc(x):'&nbsp;'}</div>`).join('')
        : '<div class="hksEmpty79">הדבק מילים כדי לראות איך הן ייראו על המסך</div>';
      box.style.setProperty('--hks-lines-per-screen',String(linesPerScreen));
    }
    const count=document.getElementById('hksLyricsPageCount79');
    if(count)count.textContent=`מסך ${pageIndex+1} מתוך ${gs.length} · ${linesPerScreen} שורות`;
    const prev=document.getElementById('hksLyricsPrev79'),next=document.getElementById('hksLyricsNext79');
    if(prev)prev.disabled=pageIndex<=0;
    if(next)next.disabled=pageIndex>=gs.length-1;
    chooser?.querySelectorAll('button').forEach(b=>b.classList.toggle('on',Number(b.dataset.lines)===linesPerScreen));
  }

  chooser?.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    linesPerScreen=Number(b.dataset.lines)||4;
    localStorage.setItem(KEY,String(linesPerScreen));
    pageIndex=0;
    renderLyricsPreview99();
    updateSyncPreview?.();
    updateLivePreview?.();
  });
  textarea.addEventListener('input',()=>{pageIndex=0;setTimeout(renderLyricsPreview99,0)});
  const prev=document.getElementById('hksLyricsPrev79'),next=document.getElementById('hksLyricsNext79');
  if(prev)prev.onclick=()=>{pageIndex--;renderLyricsPreview99()};
  if(next)next.onclick=()=>{pageIndex++;renderLyricsPreview99()};

  // Preserve the real line number from the textarea, including empty lines.
  const prepare99=function(){
    const lines=rawLines();
    words=[];
    lines.forEach((line,li)=>{
      const clean=line.trim();
      if(!clean)return;
      clean.split(/\s+/).filter(Boolean).forEach(t=>words.push({t,time:null,line:li}));
    });
    current=0;
    renderWords();updateSyncPreview();updateLivePreview();
    setStatus(`${words.length} מילים מוכנות — החלוקה והרווחים נשמרו בדיוק לפי מסך המילים`);
    try{window.go?.('studio')}catch(_){ }
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id==='studio'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.page==='studio'));
  };
  try{prepare=prepare99}catch(_){ }
  const prepareBtn=document.getElementById('prepareBtn');
  if(prepareBtn)prepareBtn.onclick=prepare99;

  // Re-map loaded/saved words to the textarea's true line numbers while preserving timings.
  function remapWordLines99(){
    if(!Array.isArray(words)||!words.length)return;
    const slots=[];
    rawLines().forEach((line,li)=>line.trim().split(/\s+/).filter(Boolean).forEach(()=>slots.push(li)));
    if(slots.length!==words.length)return;
    words.forEach((w,i)=>w.line=slots[i]);
  }
  const load=document.getElementById('loadProject');
  if(load)load.addEventListener('change',()=>setTimeout(()=>{remapWordLines99();renderWords();updateSyncPreview();updateLivePreview()},50));

  // Return EXACTLY 4/5/6 rows, including blank rows.
  try{
    fourLinesForWordIndex=function(idx){
      if(!words.length)return[];
      const li=words[Math.min(Math.max(idx,0),words.length-1)].line??0;
      const start=Math.floor(li/linesPerScreen)*linesPerScreen;
      const all=rawLines();
      const result=[];
      for(let l=start;l<start+linesPerScreen;l++)result.push(all[l]??'');
      return result;
    };
  }catch(_){ }

  function rowsHtml99(lines){
    return lines.map(x=>`<div class="hksLiveExactLine99">${x?esc(x):'&nbsp;'}</div>`).join('');
  }
  try{
    updateSyncPreview=function(){
      if(!words.length){document.getElementById('lyricsPreview').textContent='טען שיר והכנס מילים';return}
      document.getElementById('lyricsPreview').innerHTML=rowsHtml99(fourLinesForWordIndex(Math.min(current,words.length-1)));
    };
    updateLivePreview=function(){
      if(!words.length)return;
      const idx=liveIndexAt(audio.currentTime);
      if(!audio.paused)document.getElementById('lyricsPreview').innerHTML=rowsHtml99(fourLinesForWordIndex(idx));
    };
  }catch(_){ }

  // Export slides use the same 4/5/6-line layout and keep empty rows as real line breaks.
  try{
    buildSlides=function(duration){
      if(!words.length)return[];
      const all=rawLines();
      const maxLine=Math.max(all.length-1,words.reduce((m,w)=>Math.max(m,w.line??0),0));
      const slides=[];
      for(let start=0;start<=maxLine;start+=linesPerScreen){
        const group=words.filter(w=>(w.line??0)>=start&&(w.line??0)<start+linesPerScreen);
        const synced=group.filter(w=>Number.isFinite(w.time));
        if(!group.length||!synced.length)continue;
        const lines=[];
        for(let l=start;l<start+linesPerScreen;l++)lines.push(all[l]??'');
        slides.push({start:start===0?0:Math.min(...synced.map(w=>w.time)),text:lines.join('\\N')});
      }
      slides.sort((a,b)=>a.start-b.start);
      for(let i=0;i<slides.length;i++)slides[i].end=i+1<slides.length?Math.max(slides[i].start+.05,slides[i+1].start):duration;
      return slides.filter(s=>s.end>s.start);
    };
  }catch(_){ }

  window.__hksLyricsLayout99={get linesPerScreen(){return linesPerScreen},render:renderLyricsPreview99};

  const style=document.createElement('style');
  style.id='hksLyricsExactLayout99';
  style.textContent=`
    #hksLinesPerScreen99{display:flex;align-items:center;gap:4px;margin-inline-start:auto}
    #hksLinesPerScreen99>span{font-size:10px;font-weight:800;color:#f2cf79;white-space:nowrap}
    #hksLinesPerScreen99 button{width:29px;height:27px;padding:0;border-radius:7px;border:1px solid #7b3ca8;background:#24142f;color:#fff;font-weight:900}
    #hksLinesPerScreen99 button.on{background:linear-gradient(180deg,#d99a20,#8b5004)!important;border-color:#f2c55d!important;color:#fff8df!important}
    #hksLyricsMiniLines79{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:0!important}
    #hksLyricsMiniLines79 .hksExactLine99{display:flex;align-items:center;justify-content:center;min-height:calc(100% / var(--hks-lines-per-screen,4));line-height:1.16!important}
    #hksLyricsMiniLines79 .hksBlankLine99{visibility:visible!important;color:transparent!important}
    #lyricsPreview .hksLiveExactLine99{min-height:1.2em!important;line-height:1.2!important}
  `;
  document.head.appendChild(style);

  renderLyricsPreview99();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.99';
  console.log('[v99] 4/5/6 lyric screen rows + exact blank-line preservation enabled');
})();