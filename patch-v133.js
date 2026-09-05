// Avi Karaoke Studio Web v1.133 — allow spaces in export filename on iPhone + stale-loader recovery
(function(){
  const input=document.getElementById('exportFileName');
  if(input){
    function insertSpace(){
      const start=Number.isFinite(input.selectionStart)?input.selectionStart:input.value.length;
      const end=Number.isFinite(input.selectionEnd)?input.selectionEnd:start;
      if(typeof input.setRangeText==='function')input.setRangeText(' ',start,end,'end');
      else input.value=input.value.slice(0,start)+' '+input.value.slice(end);
    }
    input.addEventListener('beforeinput',e=>{if(e.inputType==='insertText'&&e.data===' '){e.preventDefault();e.stopImmediatePropagation();insertSpace()}},true);
    input.addEventListener('keydown',e=>{if(e.key===' '||e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();insertSpace()}},true);
    input.addEventListener('blur',()=>{input.value=String(input.value||'').replace(/^\s+|\s+$/g,'')});
    input.setAttribute('autocapitalize','sentences');input.setAttribute('spellcheck','false');input.placeholder='לדוגמה: אהבה ישנה';
  }

  if((Number(window.__hksLoaderVersion)||0)<140&&!window.__hksRecovery140){
    window.__hksRecovery140=true;
    setTimeout(async()=>{
      try{
        const v=document.querySelector('.version');if(v)v.textContent='Web v1.133 → מעדכן…';
        for(const n of [134,135,136,137,138,139,140])await import(`./patch-v${n}.js?v=140`);
      }catch(e){console.error('[v133 recovery]',e);try{setStatus('עדכון אוטומטי נעצר: '+(e?.message||e))}catch(_){}}
    },0);
  }else{
    const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.133';
  }
  try{navigator.serviceWorker?.register?.('sw.js?v=140',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();