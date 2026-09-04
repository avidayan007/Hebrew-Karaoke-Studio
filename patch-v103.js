// Avi Karaoke Studio Web v1.103 — sync word coloring + automatic next-screen advance
(function(){
  const list=document.getElementById('wordList');
  if(!list)return;

  function linesPerScreen(){
    const n=Number(window.__hksLyricsLayout99?.linesPerScreen||localStorage.getItem('hksLyricsLinesPerScreen99')||4);
    return [4,5,6].includes(n)?n:4;
  }
  function pageStartForIndex(idx){
    if(!Array.isArray(words)||!words.length)return 0;
    const safe=Math.min(Math.max(Number(idx)||0,0),words.length-1);
    const li=Number(words[safe]?.line)||0;
    const n=linesPerScreen();
    return Math.floor(li/n)*n;
  }
  function makeSpan(w,i){
    const s=document.createElement('span');
    const state=i<current?'done':i===current?'current':'future';
    s.className='hksSyncWord '+state;
    s.textContent=w.t;
    s.setAttribute('data-word-index',String(i));
    s.title=(i+1)+(w.time==null?'':' • '+(typeof fmt==='function'?fmt(w.time):Number(w.time).toFixed(2)));
    s.onclick=()=>selectWord(i,false);
    s.ondblclick=e=>{e.preventDefault();selectWord(i,true)};
    s.addEventListener('touchend',e=>{
      const now=Date.now();
      if(lastTapIndex===i&&now-lastTapTime<500){e.preventDefault();selectWord(i,true);lastTapIndex=-1}
      else{lastTapIndex=i;lastTapTime=now}
    },{passive:false});
    return s;
  }

  window.renderWords=function(){
    const el=document.getElementById('wordList');if(!el)return;
    el.className='hksSyncLyrics';el.innerHTML='';
    if(!Array.isArray(words)||!words.length){const e=document.createElement('div');e.className='small';e.textContent='הכנס מילים והכן לסנכרון';el.appendChild(e);return}
    const n=linesPerScreen();
    // Once the final word on a screen is synced, current points to the next word,
    // so pageStartForIndex(current) immediately advances to the next lyric screen.
    const start=pageStartForIndex(Math.min(current,words.length-1));
    for(let lineNo=start;lineNo<start+n;lineNo++){
      const row=document.createElement('div');row.className='hksSyncLine';
      const lineWords=[];words.forEach((w,i)=>{if((Number(w.line)||0)===lineNo)lineWords.push([w,i])});
      lineWords.forEach(([w,i],k)=>{if(k)row.appendChild(document.createTextNode(' '));row.appendChild(makeSpan(w,i))});
      if(!lineWords.length)row.innerHTML='&nbsp;';
      el.appendChild(row);
    }
  };

  // Make the three states unmistakable during synchronization:
  // synced = orange/gold, next word = bright purple/cyan box, future = white.
  const style=document.createElement('style');style.id='hksSyncProgress103';style.textContent=`
    #wordList.hksSyncLyrics .hksSyncWord.future{color:#f7f8fb!important;background:transparent!important;transform:none!important}
    #wordList.hksSyncLyrics .hksSyncWord.done{color:#ffad2f!important;background:rgba(255,173,47,.10)!important;text-shadow:0 0 7px rgba(255,173,47,.22),-1px -1px 0 #000,1px 1px 0 #000!important}
    #wordList.hksSyncLyrics .hksSyncWord.current{color:#fff!important;background:linear-gradient(180deg,#a945ef,#6d18ad)!important;box-shadow:0 0 0 2px rgba(211,138,255,.72),0 0 13px rgba(169,69,239,.7)!important;border-radius:6px!important;padding:1px 5px!important;transform:scale(1.08)!important}
    #wordList.hksSyncLyrics .hksSyncLine{min-height:1.35em!important}
  `;document.head.appendChild(style);

  // Repaint immediately after every Sync click, undo/reset and manual selection.
  const ids=['syncBtn','syncBtn2','undoBtn','resetBtn','startBtn','startBtn2'];
  ids.forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(()=>{try{renderWords()}catch(_){}},0)));

  try{renderWords()}catch(e){console.error('[v103 sync progress]',e)}
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.103';
  console.log('[v103] sync word colors and automatic lyric-screen advance enabled');
})();