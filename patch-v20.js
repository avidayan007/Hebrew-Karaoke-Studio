// Hebrew Karaoke Studio Web v1.20
(function(){
 const $=s=>document.querySelector(s);
 const style=document.createElement('style');style.textContent=`.formatBox{border:1px solid #2b4358;border-radius:12px;padding:10px;margin:10px 0;background:#07111c}.formatTitle{font-weight:900;font-size:16px;margin-bottom:8px}.settingsRow{display:grid;grid-template-columns:1fr 1fr;gap:8px}.settingsRow select{margin-bottom:4px}.renderLog{margin-top:8px;padding:8px;border:1px solid #263747;border-radius:8px;white-space:pre-wrap;max-height:150px;overflow:auto;font-size:11px;color:#bcd0e2}@media(max-width:600px){.settingsRow{grid-template-columns:1fr}}`;document.head.appendChild(style);
 const card=$('#export .card');
 if(card){
   const oldVideo=$('#videoQuality')?.previousElementSibling, oldV=$('#videoQuality'), oldAudio=$('#audioQuality')?.previousElementSibling, oldA=$('#audioQuality');
   oldVideo?.remove();oldV?.remove();oldAudio?.remove();oldA?.remove();
   const note=card.querySelector('.exportNote');
   const panel=document.createElement('div');panel.innerHTML=`
   <div class="formatBox"><div class="formatTitle">🎞️ קובץ MP4</div><div class="settingsRow"><label>וידאו<select id="mp4Video"><option value="1080-high">1080p — 8 Mbps</option><option value="1080-master" selected>1080p Master — 12 Mbps</option><option value="4k">4K — 20 Mbps</option></select></label><label>סאונד<select id="mp4Audio"><option value="192">AAC 192 kbps</option><option value="256">AAC 256 kbps</option><option value="320" selected>AAC 320 kbps</option></select></label></div></div>
   <div class="formatBox"><div class="formatTitle">🎬 קובץ WMV</div><div class="settingsRow"><label>וידאו<select id="wmvVideo"><option value="1080-high">1080p — 8 Mbps</option><option value="1080-master" selected>1080p Master — 12 Mbps</option><option value="4k">4K — 20 Mbps</option></select></label><label>סאונד<select id="wmvAudio"><option value="192">WMA 192 kbps</option><option value="256">WMA 256 kbps</option><option value="320" selected>WMA 320 kbps</option></select></label></div></div>
   <div class="renderLog" id="renderLog">מנוע הרינדור מוכן לבדיקה</div>`;
   note?.before(panel);
 }
 function log(s){const e=$('#renderLog');if(e){e.textContent+=`\n${s}`;e.scrollTop=e.scrollHeight}console.log('[render]',s)}
 const oldState=window.setExportState||setExportState;
 setExportState=function(t,p){oldState(t,p);log(t)};
 function preset(q,a){let width=1920,height=1080,videoK='8M';if(q==='1080-master')videoK='12M';if(q==='4k'){width=3840;height=2160;videoK='20M'}return{width,height,videoK,audioK:`${a}k`,fps:30}}
 exportPreset=function(){return preset($('#mp4Video')?.value||'1080-master',$('#mp4Audio')?.value||'320')};
 window.wmvExportPreset=function(){return preset($('#wmvVideo')?.value||'1080-master',$('#wmvAudio')?.value||'320')};
 // Loader with visible sub-steps and hard timeout. It avoids silently hanging forever on iOS.
 loadFFmpeg=async function(){
   if(ffmpegInstance)return ffmpegInstance;
   const timeout=(p,ms,msg)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error(msg)),ms))]);
   try{
    setExportState('שלב 1 — מוריד ספריית FFmpeg…',1);
    const mods=await timeout(Promise.all([import('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm/index.js'),import('https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.2/dist/esm/index.js')]),20000,'Safari לא הצליח להוריד את ספריית FFmpeg');
    const {FFmpeg}=mods[0],{fetchFile,toBlobURL}=mods[1];
    setExportState('שלב 1 — מוריד WebAssembly…',3);
    const base='https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';
    const urls=await timeout(Promise.all([toBlobURL(base+'/ffmpeg-core.js','text/javascript'),toBlobURL(base+'/ffmpeg-core.wasm','application/wasm')]),45000,'Safari לא הצליח להוריד את מנוע WebAssembly');
    setExportState('שלב 1 — פותח WebAssembly בזיכרון…',5);
    const f=new FFmpeg();f.on('log',({message})=>log(message));f.on('progress',({progress})=>{const p=Math.max(0,Math.min(1,Number(progress)||0));if(renderStage==='mp4')oldState('מרנדר MP4…',20+p*55);else if(renderStage==='wmv')oldState('יוצר WMV…',78+p*20)});
    await timeout(f.load({coreURL:urls[0],wasmURL:urls[1]}),45000,'Safari לא הצליח להפעיל FFmpeg WebAssembly');
    ffmpegFetchFile=fetchFile;ffmpegInstance=f;setExportState('מנוע FFmpeg הופעל בהצלחה',8);return f;
   }catch(e){setExportState('שגיאת מנוע: '+e.message,0);throw e}
 };
 // Wrap the current renderer so WMV gets its own requested bitrate after MP4 is built.
 const baseRender=renderDual;
 renderDual=async function(){
   const w=window.wmvExportPreset();window.__wmvPreset=w;
   return baseRender();
 };
 const btn=$('#dualExportBtn');if(btn){btn.textContent='🎬 רנדר MP4 + WMV ביחד';btn.onclick=renderDual}
})();