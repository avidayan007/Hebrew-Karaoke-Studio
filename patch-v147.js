// Avi Karaoke Studio Web v1.147 — preserve MP4 across the iPhone MP4→WMV handoff
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  window.__hksMp4HandoffFix147=true;

  // v1.146 keeps the finished MP4 in a Uint8Array so v1.131 can expose it after WMV creation.
  // @ffmpeg/ffmpeg may transfer/detach the ArrayBuffer passed to writeFile().
  // During the fresh-worker WMV stage, send a clone so the original MP4 remains intact for download.
  const baseLoad=window.loadFFmpeg||loadFFmpeg;
  loadFFmpeg=async function(){
    const f=await baseLoad();
    if(!f||f.__hksMp4Handoff147)return f;
    f.__hksMp4Handoff147=true;
    const rawWrite=f.writeFile.bind(f);
    f.writeFile=async function(path,data,...rest){
      const p=String(path||'');
      if(renderStage==='wmv'&&p==='output.mp4'&&data instanceof Uint8Array&&data.byteLength>1000){
        const originalBytes=data.byteLength;
        const workerCopy=data.slice();
        window.__hksMp4Handoff147={before:originalBytes,copy:workerCopy.byteLength,after:originalBytes,at:Date.now()};
        try{setExportState('שלב 3/4 — מעביר עותק MP4 נפרד ל-WMV…',78)}catch(_){}
        const result=await rawWrite(path,workerCopy,...rest);
        window.__hksMp4Handoff147.after=data.byteLength;
        if(data.byteLength!==originalBytes)throw new Error('שמירת ה-MP4 המקורי נכשלה בזמן יצירת WMV');
        return result;
      }
      return rawWrite(path,data,...rest);
    };
    return f;
  };
  window.loadFFmpeg=loadFFmpeg;

  // Keep the visible size estimate aligned with iPhone Safe mode. The older v1.127
  // estimator listens to duration changes, so v1.147 listens after it and overwrites its 12 Mbps text.
  function safeMode(){const m=$('#hksIPhoneRenderMode146');return !m||m.value==='safe720'}
  function fmtMB(bytes){const mb=bytes/1e6;return mb<1000?Math.round(mb)+' MB':(mb/1000).toFixed(2)+' GB'}
  function estimate147(){
    const d=Number($('#audio')?.duration)||Number(window.audioBuffer?.duration)||0;if(!(d>0))return;
    const mv=safeMode()?6:12,wv=safeMode()?4:12;
    const mp4=((mv*1e6+320000)*d/8)*1.03;
    const wmv=((wv*1e6+1536000)*d/8)*1.04;
    const m=$('#hksEstimateMp4127'),w=$('#hksEstimateWmv127'),n=$('#hksEstimateNote127');
    if(m)m.textContent='MP4: עד ≈ '+fmtMB(mp4);
    if(w)w.textContent='WMV: ≈ '+fmtMB(wmv);
    if(n){const mm=Math.floor(d/60),ss=String(Math.floor(d%60)).padStart(2,'0');n.textContent=`משך ${mm}:${ss} • MP4: ${mv} Mbps / AAC 320 kbps • WMV: ${wv} Mbps / PCM 1536 kbps • הערכת iPhone Safe.`}
  }
  const audio=$('#audio');
  audio?.addEventListener('loadedmetadata',()=>setTimeout(estimate147,0));
  audio?.addEventListener('durationchange',()=>setTimeout(estimate147,0));
  $('#audioFile')?.addEventListener('change',()=>setTimeout(estimate147,300));
  $('#loadProject')?.addEventListener('change',()=>setTimeout(estimate147,900));
  $('#hksIPhoneRenderMode146')?.addEventListener('change',()=>setTimeout(estimate147,0));
  $('#dualExportBtn')?.addEventListener('click',()=>setTimeout(estimate147,0),true);
  [0,200,800,1800].forEach(ms=>setTimeout(estimate147,ms));
  window.__hksExportEstimate147=estimate147;
  window.__hksExportEstimate127=estimate147;

  // Replace the v1.146 update button node so its old hard-coded "running=146" listener
  // cannot cause a refresh loop after v1.147 is installed.
  async function latest(){try{const r=await fetch('./version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return null;const j=await r.json(),v=Number(j?.version||0);return Number.isFinite(v)&&v>0?v:null}catch(_){return null}}
  async function update147(btn){
    if(window.__hksUpdating147)return;window.__hksUpdating147=true;const old=btn.textContent||'רענן עדכון';
    try{
      btn.disabled=true;btn.textContent='בודק עדכון…';const v=await latest();
      if(!v){try{setStatus('לא הצלחתי לבדוק עדכון כרגע.')}catch(_){}return}
      if(v<=147){try{setStatus('אתה כבר בגרסה האחרונה — v1.147.')}catch(_){}return}
      btn.textContent='מעדכן ל-v1.'+v+'…';
      try{const reg=await navigator.serviceWorker.register('sw.js?v='+v,{updateViaCache:'none'});await reg.update?.()}catch(_){}
      const u=new URL(location.href);u.searchParams.set('hksUpdate',String(v));u.searchParams.set('_',Date.now().toString());location.replace(u.href);
    }finally{window.__hksUpdating147=false;btn.disabled=false;btn.textContent=old}
  }
  function replaceUpdateButton(){
    const old=$('#hksRefresh105')||[...document.querySelectorAll('button')].find(b=>/רענן\s*עדכון|עדכון\s*רענן|מעדכן\s*לגרסה|בודק\s*עדכון/.test(String(b.textContent||'')));
    if(!old||old.dataset.hksUpdate147)return;
    const btn=old.cloneNode(true);btn.dataset.hksUpdate146='1';btn.dataset.hksUpdate147='1';btn.disabled=false;btn.textContent='↻ רענן עדכון';old.replaceWith(btn);
    btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();update147(btn)},true);
  }
  [0,250,900,1900].forEach(ms=>setTimeout(replaceUpdateButton,ms));

  try{navigator.serviceWorker?.register?.('sw.js?v=147',{updateViaCache:'none'}).then(r=>r.update?.()).catch(()=>{})}catch(_){}
  const ver=$('.version');if(ver)ver.textContent='Web v1.147';
  try{setStatus('v1.147 מוכן — תיקון שמירת MP4 בזמן יצירת WMV.')}catch(_){}
})();
