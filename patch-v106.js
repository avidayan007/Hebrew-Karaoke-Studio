// Avi Karaoke Studio Web v1.106 — resume sync from external display word
(function(){
  // External v104 window is same-origin. Enhance its message stream with click commands.
  const list=document.getElementById('wordList');
  if(!list)return;

  function resumeAt(i){
    i=Number(i);if(!Number.isInteger(i)||i<0)return;
    const spans=[...list.querySelectorAll('.hksSyncWord[data-word-index]')];
    const local=spans.find(s=>Number(s.dataset.wordIndex)===i);
    // Use the existing application's double-click behavior so timing/current state stays compatible.
    if(local){local.dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true,view:window}));return}
    // If word is outside the currently rendered group, use existing selectWord when available.
    try{if(typeof selectWord==='function')selectWord(i,true)}catch(_){ }
  }

  window.addEventListener('message',e=>{
    if(e.origin!==location.origin||e.data?.type!=='hks-sync-resume-106')return;
    resumeAt(e.data.index);
  });

  // Patch window.open only for the named sync popup so its document gets an interaction bridge.
  const oldOpen=window.open.bind(window);
  window.open=function(url,target,features){
    const w=oldOpen(url,target,features);
    if(target==='avi-karaoke-sync-display'&&w){
      const install=()=>{
        try{
          const box=w.document.getElementById('syncWords');if(!box||box.dataset.resume106)return;
          box.dataset.resume106='1';box.style.cursor='default';
          box.addEventListener('dblclick',ev=>{
            const word=ev.target.closest?.('.hksSyncWord[data-word-index]');if(!word)return;
            ev.preventDefault();
            w.opener?.postMessage({type:'hks-sync-resume-106',index:Number(word.dataset.wordIndex)},location.origin);
          });
        }catch(_){ }
      };
      setTimeout(install,180);setTimeout(install,500);
    }
    return w;
  };

  const st=document.createElement('style');st.textContent='.hksSyncWord[data-word-index]{cursor:pointer}';document.head.appendChild(st);
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.106';
})();