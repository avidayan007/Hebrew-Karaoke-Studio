// Avi Karaoke Studio Web v1.146 — consolidated iPhone stability/performance layer
// Replaces the v1.132–v1.145 iPhone hotfix chain with one deterministic layer.
(function(){
  if(window.aviDesktop?.isDesktop)return;
  const isiOS=/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!isiOS)return;
  const $=s=>document.querySelector(s);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const LOAD_TIMEOUT=180000;
  let storedMp4=null;
  window.__hksConsolidated146=true;

  // Safari/PWA repaint safety: never allow a transparent root to expose a white system layer.
  try{
    document.documentElement.style.setProperty('background','#050d16','important');
    document.body.style.setProperty('background','#050d16','important');
    document.documentElement.style.setProperty('min-height','100%');
    document.body.style.setProperty('min-height','100%');
    let st=$('#hksIOSPaint146');
    if(!st){st=document.createElement('style');st.id='hksIOSPaint146';st.textContent='html,body{background:#050d16!important;min-height:100%;}body{-webkit-text-size-adjust:100%;}';document.head.appendChild(st)}
  }catch(_){}

  // ---------- iPhone render mode ----------
  const renderBtn=$('#dualExportBtn');
  let mode=$('#hksIPhoneRenderMode146');
  if(renderBtn&&!mode){
    const box=document.createElement('div');box.id='hksIPhoneRenderBox146';
    box.style.cssText='margin:10px 0;padding:11px;border:1px solid #35506a;border-radius:12px;background:#0b1622;direction:rtl';
    box.innerHTML='<div style="font-weight:900;color:#f2cf79;margin-bottom:7px">מצב רינדור באייפון</div><select id="hksIPhoneRenderMode146" style="width:100%;min-height:48px;border-radius:10px;background:#17131d;color:#fff;border:2px solid #3b3144;padding:8px;font-weight:900"><option value="safe720" selected>מומלץ — 720p HD יציב ומהיר</option><option value="1080">1080p Master — כבד / ניסיוני באייפון</option></select><div id="hksIPhoneRenderHint146" style="font-size:12px;color:#b8c7d6;margin-top:7px;line-height:1.45">720p/30fps • MP4 עד 6 Mbps + AAC 320 kbps • WMV 4 Mbps + PCM לא דחוס 48kHz/16-bit/Stereo.</div>';
    renderBtn.parentElement?.insertBefore(box,renderBtn);mode=$('#hksIPhoneRenderMode146');
  }
  const isSafe=()=>!mode||mode.value==='safe720';

  const baseExport=exportPreset;
  exportPreset=function(){
    const p=baseExport();
    if(isSafe()){p.width=1280;p.height=720;p.fps=30;p.videoK='6M'}
    else{p.width=Math.min(1920,Number(p.width)||1920);p.height=1080;p.fps=Math.min(30,Number(p.fps)||30);if(p.videoK==='20M')p.videoK='12M'}
    p.audioK='320k';p.audioCodec='aac';p.audioRate=48000;p.audioChannels=2;
    return p;
  };
  const baseWmv=window.wmvExportPreset;
  window.wmvExportPreset=function(){
    const p=typeof baseWmv==='function'?baseWmv():baseExport();
    if(isSafe()){p.width=1280;p.height=720;p.fps=30;p.videoK='4M'}
    else{p.width=Math.min(1920,Number(p.width)||1920);p.height=1080;p.fps=Math.min(30,Number(p.fps)||30);if(p.videoK==='20M')p.videoK='12M'}
    p.audioK='1536k';p.audioCodec='pcm_s16le';p.audioRate=48000;p.audioChannels=2;
    return p;
  };

  function rememberLabel(opt,key){if(opt&&!opt.dataset[key])opt.dataset[key]=opt.textContent||''}
  function setSelectedLabel(sel,label,key){if(!sel)return;const o=sel.options?.[sel.selectedIndex];if(!o)return;rememberLabel(o,key);if(o.textContent!==label)o.textContent=label}
  function restoreLabels(sel,key){if(!sel)return;[...sel.options].forEach(o=>{if(o.dataset[key]&&o.textContent!==o.dataset[key])o.textContent=o.dataset[key]})}
  function syncVisibleSettings(){
    const mp4v=$('#mp4Video')||$('#videoQuality'),wmvv=$('#wmvVideo')||mp4v;
    const mp4a=$('#mp4Audio')||$('#audioQuality'),wmva=$('#wmvAudio')||mp4a;
    [mp4v,wmvv].forEach(s=>restoreLabels(s,'hksOrig146v'));[mp4a,wmva].forEach(s=>restoreLabels(s,'hksOrig146a'));
    if(isSafe()){
      setSelectedLabel(mp4v,'720p HD — iPhone Safe • MP4 עד 6 Mbps','hksOrig146v');
      if(wmvv!==mp4v)setSelectedLabel(wmvv,'720p HD — iPhone Safe • WMV 4 Mbps','hksOrig146v');
    }
    setSelectedLabel(mp4a,'AAC 320 kbps — 48kHz • MP4','hksOrig146a');
    if(wmva!==mp4a)setSelectedLabel(wmva,'PCM לא דחוס — 48kHz / 16-bit / Stereo • 1536 kbps','hksOrig146a');
    const h=$('#hksIPhoneRenderHint146');if(h)h.textContent=isSafe()?'720p/30fps • MP4 עד 6 Mbps + AAC 320 kbps • WMV 4 Mbps + PCM לא דחוס 48kHz/16-bit/Stereo.':'1080p/30fps ניסיוני • MP4 AAC 320 kbps • WMV PCM לא דחוס.';
    estimate146();
  }
  mode?.addEventListener('change',()=>setTimeout(syncVisibleSettings,0));
  [0,120,500,1400].forEach(ms=>setTimeout(syncVisibleSettings,ms));

  // ---------- export filename spaces ----------
  function bindFilename(){
    const input=$('#exportFileName');if(!input||input.dataset.hksSpace146)return;
    input.dataset.hksSpace146='1';
    const insertSpace=()=>{const s=Number.isFinite(input.selectionStart)?input.selectionStart:input.value.length,e=Number.isFinite(input.selectionEnd)?input.selectionEnd:s;if(typeof input.setRangeText==='function')input.setRangeText(' ',s,e,'end');else input.value=input.value.slice(0,s)+' '+input.value.slice(e)};
    input.addEventListener('beforeinput',e=>{if(e.inputType==='insertText'&&e.data===' '){e.preventDefault();e.stopImmediatePropagation();insertSpace()}},true);
    input.addEventListener('keydown',e=>{if(e.key===' '||e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();insertSpace()}},true);
    input.placeholder='לדוגמה: אהבה ישנה';input.setAttribute('autocapitalize','sentences');input.setAttribute('spellcheck','false');
  }
  [0,150,600,1400].forEach(ms=>setTimeout(bindFilename,ms));

  // ---------- correct iPhone size estimate ----------
  function fmtMB(bytes){const mb=bytes/1e6;return mb<1000?Math.round(mb)+' MB':(mb/1000).toFixed(2)+' GB'}
  function estimate146(){
    const d=Number($('#audio')?.duration)||0;if(!(d>0))return;
    const mv=isSafe()?6:12,wv=isSafe()?4:12;
    const mp4=((mv*1e6+320000)*d/8)*1.03,wmv=((wv*1e6+1536000)*d/8)*1.04;
    const m=$('#hksEstimateMp4127'),w=$('#hksEstimateWmv127'),n=$('#hksEstimateNote127');
    if(m)m.textContent='MP4: עד ≈ '+fmtMB(mp4);if(w)w.textContent='WMV: ≈ '+fmtMB(wmv);
    if(n)n.textContent=(isSafe()?'iPhone Safe • 720p/30fps • MP4 עד 6 Mbps':'1080p/30fps ניסיוני')+' • AAC 320 kbps • WMV '+wv+' Mbps + PCM לא דחוס 48kHz/16-bit/Stereo.';
  }
  $('#audio')?.addEventListener('loadedmetadata',()=>setTimeout(estimate146,0));
  document.addEventListener('change',e=>{if(e.target?.id==='mp4Video'||e.target?.id==='wmvVideo'||e.target?.id==='mp4Audio'||e.target?.id==='wmvAudio')setTimeout(estimate146,0)},true);

  // ---------- one clean FFmpeg loader ----------
  function timeout(p,ms,msg,onTimeout){return new Promise((resolve,reject)=>{let done=false;const finish=(fn,v)=>{if(done)return;done=true;clearTimeout(t);fn(v)},t=setTimeout(()=>{try{onTimeout?.()}catch(_){}finish(reject,new Error(msg))},ms);Promise.resolve(p).then(v=>finish(resolve,v),e=>finish(reject,e))})}
  function setArg(a,key,val){const i=a.indexOf(key);if(i>=0&&i+1<a.length)a[i+1]=String(val);else a.splice(Math.max(0,a.length-1),0,key,String(val))}
  function removeArg(a,key,withValue=true){let i;while((i=a.indexOf(key))>=0)a.splice(i,withValue?2:1)}
  function sanitizeCommand(args){
    const a=[...args],out=String(a[a.length-1]||'').toLowerCase();
    if(out.endsWith('.mp4')){
      removeArg(a,'-movflags');
      setArg(a,'-c:a','aac');setArg(a,'-b:a','320k');setArg(a,'-ar','48000');setArg(a,'-ac','2');
      if(isSafe()){setArg(a,'-r','30');setArg(a,'-b:v','6M')}
      const x=a.indexOf('libx264');if(x>=0&&!a.includes('-x264-params'))a.splice(x+1,0,'-threads','1','-tune','zerolatency','-x264-params','ref=1:bframes=0:rc-lookahead=0:sync-lookahead=0:scenecut=0');
    }else if(out.endsWith('.wmv')){
      setArg(a,'-c:a','pcm_s16le');removeArg(a,'-b:a');setArg(a,'-ar','48000');setArg(a,'-ac','2');if(isSafe())setArg(a,'-b:v','4M');
      const w=a.indexOf('wmv2');if(w>=0&&!a.includes('-threads'))a.splice(w+1,0,'-threads','1');
    }
    return a;
  }
  async function newEngine(){
    try{setExportState('טוען מנוע FFmpeg יציב לאייפון…',2)}catch(_){}
    const mods=await timeout(Promise.all([import('./vendor/ffmpeg/ffmpeg/ios.js?v=146'),import('./vendor/ffmpeg/util/index.js?v=146')]),30000,'לא הצלחתי לטעון את קבצי FFmpeg');
    const {FFmpeg}=mods[0],{fetchFile}=mods[1],f=new FFmpeg(),errors=[];let lastPaint=0,lastProgress=0;
    f.on('log',({message})=>{const m=String(message||'').trim();if(/error|failed|invalid|memory|abort|cannot|unable|allocation|killed|fatal/i.test(m)){errors.push(m);if(errors.length>8)errors.shift();window.__hksLastFFmpeg146=m}});
    f.on('progress',({progress})=>{const now=Date.now(),v=Math.max(0,Math.min(1,Number(progress)||0);if(now-lastPaint<350&&v<.995&&v>=lastProgress)return;lastPaint=now;lastProgress=v;try{if(renderStage==='mp4')setExportState('שלב 2/4 — מרנדר MP4…',18+v*50);else if(renderStage==='wmv')setExportState('שלב 3/4 — יוצר WMV…',80+v*16)}catch(_){}});
    const base=new URL('./vendor/ffmpeg/core/',location.href).href;
    await timeout(f.load({coreURL:base+'ffmpeg-core.js',wasmURL:base+'ffmpeg-core.wasm'}),LOAD_TIMEOUT,'מנוע FFmpeg לא נפתח בזמן',()=>f?.terminate?.());
    const rawExec=f.exec.bind(f),rawRead=f.readFile.bind(f);
    f.exec=async(args,limit=-1)=>{
      const a=sanitizeCommand(args),out=String(a[a.length-1]||'').toLowerCase();
      if(out.endsWith('.mp4'))storedMp4=null;
      errors.length=0;window.__hksLastFFmpeg146='';
      const hard=limit>0?limit+45000:25*60*1000;
      const rc=await timeout(rawExec(a,limit),hard,'הרינדור עבר את מגבלת הזמן',()=>f?.terminate?.());
      if(rc!==0){const detail=errors.slice(-3).join(' | ')||window.__hksLastFFmpeg146||('FFmpeg code '+rc);throw new Error('FFmpeg עצר: '+detail)}
      if(out.endsWith('.wmv')){try{await f.deleteFile('output.mp4')}catch(_){}}
      return rc;
    };
    f.readFile=async(path,encoding='binary')=>{
      const p=String(path||'');
      if(renderStage==='wmv'&&p==='output.mp4'&&storedMp4){const d=storedMp4;storedMp4=null;return d}
      const d=await rawRead(path,encoding);
      if(renderStage==='mp4'&&p==='output.mp4'&&d instanceof Uint8Array&&d.byteLength>1000)storedMp4=d;
      return d;
    };
    ffmpegFetchFile=fetchFile;ffmpegInstance=f;
    try{setExportState('מנוע FFmpeg מוכן — מצב iPhone יציב',6)}catch(_){}
    return f;
  }
  loadFFmpeg=async function(){
    if(ffmpegInstance)return ffmpegInstance;
    if(window.__hksFFmpegLoading146)return window.__hksFFmpegLoading146;
    window.__hksFFmpegLoading146=(async()=>{let last;for(let i=1;i<=2;i++){try{return await newEngine()}catch(e){last=e;try{ffmpegInstance?.terminate?.()}catch(_){}ffmpegInstance=null;if(i<2){try{setExportState('הפתיחה הראשונה נכשלה — מנסה שוב…',2)}catch(_){}await sleep(700)}}throw last})();
    try{return await window.__hksFFmpegLoading146}finally{window.__hksFFmpegLoading146=null}
  };

  // ---------- smart update button, without observers or self-update loops ----------
  async function latestVersion(){try{const r=await fetch('./version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return null;const j=await r.json(),v=Number(j?.version||0);return Number.isFinite(v)&&v>0?v:null}catch(_){return null}}
  async function doUpdate(btn){
    if(window.__hksUpdating146)return;window.__hksUpdating146=true;const running=146,old=btn?.textContent||'רענן עדכון';
    try{
      if(btn){btn.disabled=true;btn.textContent='בודק עדכון…'}
      const latest=await latestVersion();
      if(!latest){try{setStatus('לא הצלחתי לבדוק עדכון כרגע.')}catch(_){};return}
      if(latest<=running){try{setStatus('אתה כבר בגרסה האחרונה — v1.146.')}catch(_){};return}
      if(btn)btn.textContent='מעדכן ל-v1.'+latest+'…';
      try{const reg=await navigator.serviceWorker.register('sw.js?v='+latest,{updateViaCache:'none'});await reg.update?.()}catch(_){}
      const u=new URL(location.href);u.searchParams.set('hksUpdate',String(latest));u.searchParams.set('_',Date.now().toString());location.replace(u.href);
    }finally{if(location.href){window.__hksUpdating146=false;if(btn){btn.disabled=false;btn.textContent=old}}}
  }
  function bindUpdate(){const btn=$('#hksRefresh105')||[...document.querySelectorAll('button')].find(b=>/רענן\s*עדכון|עדכון\s*רענן|מעדכן\s*לגרסה|בודק\s*עדכון/.test(String(b.textContent||'')));if(!btn||btn.dataset.hksUpdate146)return;btn.dataset.hksUpdate146='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();doUpdate(btn)},true)}
  [0,200,700,1600].forEach(ms=>setTimeout(bindUpdate,ms));

  try{const u=new URL(location.href);if(u.searchParams.has('hksUpdate')||u.searchParams.has('_')){u.searchParams.delete('hksUpdate');u.searchParams.delete('_');history.replaceState(null,'',u.pathname+u.search+u.hash)}}catch(_){}
  try{navigator.serviceWorker?.register?.('sw.js?v=146',{updateViaCache:'none'}).catch(()=>{})}catch(_){}
  const ver=$('.version');if(ver)ver.textContent='Web v1.146';
  try{setStatus('v1.146 מוכן — גרסת iPhone מאוחדת ומהירה.')}catch(_){}
})();
