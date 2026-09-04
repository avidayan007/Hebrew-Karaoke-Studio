// Avi Karaoke Studio Web v1.100 — lyrics preview follows caret / mouse position in textarea
(function(){
  const textarea=document.getElementById('lyricsText');
  const api=window.__hksLyricsLayout99;
  if(!textarea||!api)return;

  function lineFromCaret(){
    const pos=Math.max(0,textarea.selectionStart||0);
    return textarea.value.slice(0,pos).replace(/\r/g,'').split('\n').length-1;
  }

  function syncPreviewToCaret(){
    const n=Math.max(4,Math.min(6,Number(api.linesPerScreen)||4));
    const line=lineFromCaret();
    const targetPage=Math.floor(line/n);
    try{
      const prev=document.getElementById('hksLyricsPrev79');
      const next=document.getElementById('hksLyricsNext79');
      // Move through the existing preview navigation so we reuse the exact v99 rendering logic.
      const count=document.getElementById('hksLyricsPageCount79');
      const m=(count?.textContent||'').match(/מסך\s+(\d+)\s+מתוך/);
      let currentPage=m?Math.max(0,Number(m[1])-1):0;
      let guard=0;
      while(currentPage<targetPage&&next&&!next.disabled&&guard++<500){next.click();currentPage++}
      guard=0;
      while(currentPage>targetPage&&prev&&!prev.disabled&&guard++<500){prev.click();currentPage--}
      api.render?.();
    }catch(e){console.warn('[v100 caret preview]',e)}
  }

  ['click','keyup','mouseup','select','input'].forEach(evt=>textarea.addEventListener(evt,()=>setTimeout(syncPreviewToCaret,0)));
  textarea.addEventListener('pointerup',()=>setTimeout(syncPreviewToCaret,0));
  textarea.addEventListener('touchend',()=>setTimeout(syncPreviewToCaret,0));

  const hint=document.createElement('div');
  hint.id='hksCaretFollowHint100';
  hint.textContent='התצוגה עוקבת אוטומטית אחרי המקום שבו הסמן נמצא במילים';
  const host=document.getElementById('hksLyricsScreenPreview79');
  host?.querySelector('.hksPreviewHead79')?.insertAdjacentElement('afterend',hint);

  const style=document.createElement('style');
  style.id='hksCaretFollowStyle100';
  style.textContent=`
    #hksCaretFollowHint100{font-size:10px;font-weight:700;color:#c7b7d9;opacity:.9;margin:-1px 0 6px;text-align:center}
  `;
  document.head.appendChild(style);

  syncPreviewToCaret();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.100';
  console.log('[v100] Lyrics preview follows textarea caret position');
})();