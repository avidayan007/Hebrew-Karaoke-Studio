// Hebrew Karaoke Studio Web v1.40 — sync view as four lyric lines with word-by-word highlight
(function(){
  const list=document.getElementById('wordList');
  if(!list)return;

  const style=document.createElement('style');
  style.textContent=`
    #wordList.hksSyncLyrics{
      background:#07111c;border:1px solid #2a4055;border-radius:12px;
      padding:18px 14px;margin:10px 0;min-height:210px;
      display:flex;flex-direction:column;justify-content:center;gap:10px;
      text-align:center;direction:rtl;overflow:hidden;
    }
    .hksSyncLine{
      min-height:1.45em;font-size:clamp(22px,4.5vw,44px);font-weight:800;
      line-height:1.35;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
      word-spacing:.16em;
    }
    .hksSyncWord{
      display:inline-block;color:#f5f8fb;padding:1px 2px;border-radius:5px;
      cursor:pointer;transition:color .12s ease,background .12s ease,transform .12s ease;
    }
    .hksSyncWord.done{color:#45d173}
    .hksSyncWord.current{color:#ffb23c;background:#ffb23c1c;transform:scale(1.06)}
    .hksSyncWord.future{color:#f5f8fb}
    @media(max-width:520px){
      #wordList.hksSyncLyrics{padding:14px 8px;gap:7px;min-height:190px}
      .hksSyncLine{font-size:clamp(20px,6.2vw,34px)}
    }
  `;
  document.head.appendChild(style);

  function syncStartLine(){
    if(!words.length)return 0;
    const idx=Math.min(Math.max(current,0),words.length-1);
    const li=words[idx]?.line??0;
    return Math.floor(li/4)*4;
  }

  function makeWordSpan(w,i){
    const s=document.createElement('span');
    s.className='hksSyncWord '+(i<current?'done':i===current?'current':'future');
    s.textContent=w.t;
    s.title=(i+1)+(w.time==null?'':' • '+fmt(w.time));
    s.setAttribute('data-word-index',String(i));
    s.onclick=()=>selectWord(i,false);
    s.ondblclick=e=>{e.preventDefault();selectWord(i,true)};
    s.addEventListener('touchend',e=>{
      const now=Date.now();
      if(lastTapIndex===i&&now-lastTapTime<500){
        e.preventDefault();selectWord(i,true);lastTapIndex=-1;
      }else{lastTapIndex=i;lastTapTime=now}
    },{passive:false});
    return s;
  }

  window.renderWords=function(){
    const el=document.getElementById('wordList');
    if(!el)return;
    el.className='hksSyncLyrics';
    el.innerHTML='';
    if(!words.length){
      const empty=document.createElement('div');
      empty.className='small';empty.textContent='הכנס מילים והכן לסנכרון';el.appendChild(empty);return;
    }
    const start=syncStartLine();
    for(let lineNo=start;lineNo<start+4;lineNo++){
      const row=document.createElement('div');
      row.className='hksSyncLine';
      const lineWords=[];
      words.forEach((w,i)=>{if((w.line??0)===lineNo)lineWords.push([w,i])});
      lineWords.forEach(([w,i],n)=>{
        if(n)row.appendChild(document.createTextNode(' '));
        row.appendChild(makeWordSpan(w,i));
      });
      el.appendChild(row);
    }
  };

  try{renderWords()}catch(e){console.error('[v40 sync lyrics]',e)}
  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.40';
})();
