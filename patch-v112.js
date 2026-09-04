// Avi Karaoke Studio Web v1.112 — main preview = final synchronized 4/5/6-line result
(function(){
  const audio=document.getElementById('audio'),preview=document.getElementById('lyricsPreview'),textarea=document.getElementById('lyricsText');
  if(!audio||!preview||!textarea)return;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nlines=()=>{const n=Number(window.__hksLyricsLayout99?.linesPerScreen||localStorage.getItem('hksLyricsLinesPerScreen99')||4);return [4,5,6].includes(n)?n:4};
  const raw=()=>textarea.value.replace(/\r/g,'').split('\n');
  function indexAt(t){
    try{let idx=-1;for(let i=0;i<words.length;i++){const wt=Number(words[i]?.time);if(Number.isFinite(wt)&&wt<=t)idx=i}return idx}catch(_){return -1}
  }
  function finalRows(idx){
    if(!Array.isArray(words)||!words.length||idx<0)return null;
    const n=nlines(),li=Number(words[Math.min(idx,words.length-1)]?.line)||0,start=Math.floor(li/n)*n,all=raw(),rows=[];
    for(let l=start;l<start+n;l++)rows.push(all[l]??'');
    return rows;
  }
  function paint(){
    const idx=indexAt(audio.currentTime),rows=finalRows(idx);if(!rows)return;
    preview.innerHTML=rows.map(x=>`<div class="hksFinalLine112">${x?esc(x):'&nbsp;'}</div>`).join('');
    preview.style.setProperty('--hks-final-lines',String(nlines()));
  }
  // Main screen follows only saved synchronization timing; no per-word sync coloring.
  audio.addEventListener('timeupdate',paint);audio.addEventListener('play',paint);audio.addEventListener('seeked',paint);
  ['syncBtn','syncBtn2','undoBtn','resetBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(paint,0)));
  document.getElementById('hksLinesPerScreen99')?.addEventListener('click',()=>setTimeout(paint,0));
  const st=document.createElement('style');st.textContent='#lyricsPreview .hksFinalLine112{min-height:calc(100% / var(--hks-final-lines,4));line-height:1.15;display:flex;align-items:center;justify-content:center;width:100%}';document.head.appendChild(st);
  window.__hksPaintFinal112=paint;
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.112';
})();