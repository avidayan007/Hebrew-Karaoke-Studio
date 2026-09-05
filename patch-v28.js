// Hebrew Karaoke Studio Web v1.28 — pre-render filename + iPhone save destination flow
(function(){
  const $=s=>document.querySelector(s);
  let baseName='karaoke';window.__hksExportBaseName=window.__hksExportBaseName||baseName;
  const cleanName=s=>(String(s||'').trim().replace(/[\\/:*?"<>|]/g,'-').replace(/\s+/g,' ').replace(/^\.+|\.+$/g,'').slice(0,80)||'karaoke');

  const style=document.createElement('style');
  style.textContent=`
  .exportSetupOverlay{position:fixed;inset:0;background:#000b;z-index:9999;display:none;align-items:center;justify-content:center;padding:18px}
  .exportSetupOverlay.show{display:flex}.exportSetupBox{width:min(520px,100%);background:#0b1622;border:1px solid #35506a;border-radius:16px;padding:16px;box-shadow:0 12px 40px #0008}
  .exportSetupBox h3{margin:0 0 12px;font-size:20px}.exportSetupBox label{display:block;font-weight:800;margin:10px 0 6px}
  .exportSetupBox input{width:100%;min-height:48px;border-radius:12px;border:2px solid #2784cf;background:#13283b;color:#fff;padding:10px;font-size:17px}
  .exportSetupHint{font-size:13px;color:#b8c7d6;line-height:1.45;margin-top:12px;background:#07111c;border:1px solid #263747;border-radius:10px;padding:10px}
  .exportSetupActions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}
  `;document.head.appendChild(style);

  const overlay=document.createElement('div');overlay.className='exportSetupOverlay';overlay.id='exportSetupOverlay';
  overlay.innerHTML=`<div class="exportSetupBox" role="dialog" aria-modal="true" aria-labelledby="exportSetupTitle">
    <h3 id="exportSetupTitle">לפני הייצוא</h3>
    <label for="exportFileName">שם הקובץ</label>
    <input id="exportFileName" type="text" value="karaoke" autocomplete="off" enterkeyhint="done">
    <div class="exportSetupHint">באייפון Safari לא מאפשר לאתר לבחור מראש תיקייה אמיתית במכשיר. אחרי שהרינדור יסתיים, לחץ על “שמור MP4” או “שמור WMV” ובחלון של iOS תוכל לבחור בדיוק איפה לשמור — iCloud Drive או “ב‑iPhone שלי” — ובאיזו תיקייה.</div>
    <div class="exportSetupActions"><button type="button" class="gbtn" id="exportSetupCancel">ביטול</button><button type="button" class="gbtn green" id="exportSetupStart">התחל רינדור</button></div>
  </div>`;
  document.body.appendChild(overlay);

  try{
    const originalSetDownloadLink=setDownloadLink;
    setDownloadLink=function(id,blob,name){
      const ext=(name||'').toLowerCase().endsWith('.wmv')?'.wmv':'.mp4';
      const finalName=cleanName(window.__hksExportBaseName||baseName)+ext;
      originalSetDownloadLink(id,blob,finalName);
      const a=$(id);if(a){a.download=finalName;a.textContent=(ext==='.wmv'?'⬇️ שמור WMV — ':'⬇️ שמור MP4 — ')+finalName;}
    };
  }catch(e){console.warn('filename wrapper failed',e)}

  const renderBtn=$('#dualExportBtn');
  if(renderBtn){
    const originalRender=renderBtn.onclick;
    renderBtn.onclick=()=>{
      if(exportBusy)return;
      const input=$('#exportFileName');
      input.value=cleanName(window.__hksExportBaseName||baseName);
      overlay.classList.add('show');
      setTimeout(()=>{input.focus();input.select();},50);
    };
    $('#exportSetupCancel').onclick=()=>overlay.classList.remove('show');
    $('#exportSetupStart').onclick=()=>{
      baseName=cleanName($('#exportFileName').value);window.__hksExportBaseName=baseName;
      $('#exportFileName').value=baseName;
      overlay.classList.remove('show');
      setStatus('שם הקבצים: '+baseName+' — מתחיל רינדור');
      if(typeof originalRender==='function') originalRender.call(renderBtn);
      else if(typeof renderDual==='function') renderDual();
    };
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('show')});
  }

  const v=$('.version');if(v)v.textContent='Web v1.28';
})();