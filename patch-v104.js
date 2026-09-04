// Avi Karaoke Studio Web v1.104 — detachable synchronization words display
(function(){
  const list=document.getElementById('wordList');
  if(!list)return;
  let syncWin=null, syncTimer=null;

  function sendSync(){
    if(!syncWin||syncWin.closed){syncWin=null;return}
    try{
      syncWin.postMessage({type:'hks-sync-display-104',html:list.innerHTML,fontSize:getComputedStyle(list.querySelector('.hksSyncLine')||list).fontSize},location.origin);
    }catch(_){ }
  }
  function openSyncDisplay(){
    syncWin=window.open('','avi-karaoke-sync-display','popup=yes,width=1000,height=650');
    if(!syncWin){alert('הדפדפן חסם את חלון הסנכרון. אשר חלונות קופצים ונסה שוב.');return}
    syncWin.document.open();
    syncWin.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>Avi Karaoke — Sync Display</title><style>
      html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#050a10;color:#fff;font-family:Arial,"Noto Sans Hebrew",sans-serif}
      body{display:flex;align-items:center;justify-content:center}
      #syncWords{width:94%;min-height:72vh;border:2px solid #b47bff;border-radius:18px;background:#07111c;display:flex;flex-direction:column;justify-content:center;gap:18px;padding:28px;box-sizing:border-box;text-align:center;direction:rtl;box-shadow:0 0 35px #6f2cc855}
      .hksSyncLine{min-height:1.45em;font-size:clamp(30px,5vw,70px)!important;font-weight:900;line-height:1.35;word-spacing:.16em;text-shadow:-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000}
      .hksSyncWord{display:inline-block;color:#f5f8fb;padding:2px 5px;border-radius:7px;margin:0 2px}.hksSyncWord.done{color:#ffb23c}.hksSyncWord.current{color:#d9a2ff;background:#7b2cbf55;box-shadow:0 0 14px #a64dff;transform:scale(1.08)}.hksSyncWord.future{color:#f5f8fb}
      #fs{position:fixed;right:14px;bottom:14px;padding:10px 15px;border:1px solid #d9a52d;border-radius:9px;background:#17120a;color:#f6d36f;font-weight:900;cursor:pointer}
    </style></head><body><div id="syncWords"></div><button id="fs">⛶ מסך מלא</button><script>
      const box=document.getElementById('syncWords');addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='hks-sync-display-104')return;box.innerHTML=e.data.html||''});document.getElementById('fs').onclick=()=>document.documentElement.requestFullscreen?.();
    <\/script></body></html>`);
    syncWin.document.close();setTimeout(sendSync,120);clearInterval(syncTimer);syncTimer=setInterval(sendSync,60);syncWin.focus();
  }

  let btn=document.getElementById('hksSyncExternal104');
  if(!btn){
    btn=document.createElement('button');btn.id='hksSyncExternal104';btn.type='button';btn.textContent='🖥 פצל מסך סנכרון';btn.title='פתח את מסך המילים של הסנכרון בחלון נפרד למסך חיצוני';
    list.parentElement?.insertBefore(btn,list);
  }
  btn.onclick=openSyncDisplay;
  const st=document.createElement('style');st.textContent='#hksSyncExternal104{margin:4px 0 8px;padding:7px 12px;border:1px solid #9c4dff;border-radius:9px;background:linear-gradient(180deg,#8d36db,#4b157f);color:#fff;font-weight:900;cursor:pointer}';document.head.appendChild(st);
  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.104';
})();