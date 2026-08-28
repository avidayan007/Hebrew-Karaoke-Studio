// Hebrew Karaoke Studio Web v1.27 — stop export + paste lyrics
(function(){
  const $=s=>document.querySelector(s);

  const style=document.createElement('style');
  style.textContent=`
    .exportStopBtn{width:100%;margin-top:9px;min-height:48px;border-radius:12px;border:1px solid #a94b55;background:linear-gradient(#d74652,#7a1b23);color:#fff;font:inherit;font-weight:900;display:none}
    .exportStopBtn.show{display:block}.exportStopBtn:disabled{opacity:.45}
    .pasteLyricsBtn{margin-bottom:10px;width:100%}
  `;
  document.head.appendChild(style);

  const lyrics=$('#lyricsText');
  if(lyrics && !$('#pasteLyricsBtn')){
    const paste=document.createElement('button');
    paste.type='button';paste.id='pasteLyricsBtn';paste.className='gbtn blue pasteLyricsBtn';paste.textContent='📋 הדבק מילים';
    lyrics.insertAdjacentElement('beforebegin',paste);
    paste.onclick=async()=>{
      try{
        const text=await navigator.clipboard.readText();
        if(!text){setStatus('אין כרגע טקסט בלוח ההעתקה');return;}
        const start=Number.isFinite(lyrics.selectionStart)?lyrics.selectionStart:lyrics.value.length;
        const end=Number.isFinite(lyrics.selectionEnd)?lyrics.selectionEnd:start;
        lyrics.setRangeText(text,start,end,'end');
        lyrics.dispatchEvent(new Event('input',{bubbles:true}));
        lyrics.focus();
        setStatus('המילים הודבקו בהצלחה');
      }catch(e){
        lyrics.focus();
        setStatus('Safari חסם הדבקה אוטומטית — לחץ לחיצה ארוכה באזור המילים ובחר ״הדבק״');
      }
    };
  }

  const renderBtn=$('#dualExportBtn');
  if(renderBtn && !$('#cancelExportBtn')){
    const cancel=document.createElement('button');
    cancel.type='button';cancel.id='cancelExportBtn';cancel.className='exportStopBtn';cancel.textContent='✕ עצור רינדור';
    renderBtn.insertAdjacentElement('afterend',cancel);

    const refresh=()=>{
      const busy=!!exportBusy;
      cancel.classList.toggle('show',busy);
      cancel.disabled=!busy;
    };
    setInterval(refresh,250);refresh();

    cancel.onclick=()=>{
      if(!exportBusy)return;
      cancel.disabled=true;
      setExportState('עוצר את הרינדור…',0);
      try{if(ffmpegInstance && typeof ffmpegInstance.terminate==='function') ffmpegInstance.terminate()}catch(e){console.warn('terminate failed',e)}
      ffmpegInstance=null;
      renderStage='';
      setTimeout(()=>setExportState('הרינדור נעצר על ידך',0),150);
    };
  }

  const v=$('.version');if(v)v.textContent='Web v1.27';
})();
