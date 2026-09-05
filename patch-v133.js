// Avi Karaoke Studio Web v1.133 — allow spaces in export filename on iPhone
(function(){
  const input=document.getElementById('exportFileName');
  if(!input)return;

  function insertSpace(){
    const start=Number.isFinite(input.selectionStart)?input.selectionStart:input.value.length;
    const end=Number.isFinite(input.selectionEnd)?input.selectionEnd:start;
    if(typeof input.setRangeText==='function'){
      input.setRangeText(' ',start,end,'end');
    }else{
      input.value=input.value.slice(0,start)+' '+input.value.slice(end);
    }
  }

  // iOS can deliver the space key as beforeinput rather than keydown.
  input.addEventListener('beforeinput',e=>{
    if(e.inputType==='insertText'&&e.data===' '){
      e.preventDefault();
      e.stopImmediatePropagation();
      insertSpace();
    }
  },true);

  input.addEventListener('keydown',e=>{
    if(e.key===' '||e.code==='Space'){
      e.preventDefault();
      e.stopImmediatePropagation();
      insertSpace();
    }
  },true);

  // Keep ordinary internal spaces; trim only leading/trailing whitespace when leaving the field.
  input.addEventListener('blur',()=>{
    input.value=String(input.value||'').replace(/^\s+|\s+$/g,'');
  });

  input.setAttribute('autocapitalize','sentences');
  input.setAttribute('spellcheck','false');
  input.placeholder='לדוגמה: אהבה ישנה';

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.133';
  try{navigator.serviceWorker?.register?.('sw.js?v=133',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
})();
