(()=>{
 const frame=()=>document.getElementById('console');
 const cdoc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
 function enhanceDeck(){
  const d=cdoc();if(!d?.head)return;
  let st=d.getElementById('afdDeckSimple49');if(!st){st=d.createElement('style');st.id='afdDeckSimple49';d.head.appendChild(st)}
  st.textContent=`
   .pads{display:none!important}
   .transport{grid-template-columns:1fr 1fr!important;gap:10px!important;margin-top:6px!important}
   .transport .cue{display:none!important}
   .transport .play,.transport .sync{height:48px!important;font-size:13px!important;border-radius:7px!important;letter-spacing:.5px!important}
   .wave{cursor:pointer!important;touch-action:none!important}
   .afdWaveProgress{position:absolute!important;left:0!important;top:0!important;bottom:0!important;width:0%;pointer-events:none!important;background:linear-gradient(90deg,#ffffff08,#ffffff18)!important;border-right:2px solid #fff!important;z-index:4!important}
   .deckA .afdWaveProgress{border-right-color:#d7b4ff!important}.deckB .afdWaveProgress{border-right-color:#7bd8ff!important}
  `;
  ['A','B'].forEach(deck=>{
   const media=d.getElementById('vid'+deck),panel=media?.closest('.panel'),wave=panel?.querySelector('.wave');if(!media||!wave)return;
   let prog=wave.querySelector('.afdWaveProgress');if(!prog){prog=d.createElement('div');prog.className='afdWaveProgress';wave.appendChild(prog)}
   const draw=()=>{const dur=media.duration||0;prog.style.width=(dur?Math.max(0,Math.min(100,media.currentTime/dur*100)):0)+'%'};
   const seek=e=>{const r=wave.getBoundingClientRect(),x=Math.max(0,Math.min(r.width,e.clientX-r.left)),p=r.width?x/r.width:0;if(Number.isFinite(media.duration)&&media.duration>0){media.currentTime=p*media.duration;draw()}};
   if(!wave.dataset.afdSeek49){wave.dataset.afdSeek49='1';let drag=false;wave.addEventListener('pointerdown',e=>{drag=true;wave.setPointerCapture?.(e.pointerId);seek(e)});wave.addEventListener('pointermove',e=>{if(drag)seek(e)});wave.addEventListener('pointerup',()=>drag=false);wave.addEventListener('pointercancel',()=>drag=false);media.addEventListener('timeupdate',draw);media.addEventListener('loadedmetadata',draw)}
  });
 }
 async function importDirectory(){
  const input=document.getElementById('folderInput'),status=document.getElementById('status');
  if(!input)return;
  if(!window.showDirectoryPicker){input.click();return}
  try{
   const root=await window.showDirectoryPicker({mode:'read'}),files=[];
   async function walk(dir,path=''){
    for await(const [name,h] of dir.entries()){
     if(h.kind==='file'){
      const f=await h.getFile();
      if(f.type.startsWith('audio/')||f.type.startsWith('video/')||/\.(mp3|wav|m4a|aac|flac|ogg|mp4|mov|m4v|webm)$/i.test(name)){
       try{Object.defineProperty(f,'webkitRelativePath',{value:(path?path+'/':'')+name})}catch(e){}
       files.push(f)
      }
     }else await walk(h,path?path+'/'+name:name)
    }
   }
   await walk(root,root.name);
   const dt=new DataTransfer();files.forEach(f=>dt.items.add(f));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));if(status)status.textContent=`נוספו ${files.length} קבצי אודיו/וידאו מהתיקייה`;
  }catch(e){if(e?.name!=='AbortError'&&status)status.textContent='לא ניתן לפתוח תיקייה במכשיר הזה — השתמש בהוסף קבצים'}
 }
 function enhanceLibrary(){
  const folderBtn=document.getElementById('folderBtn'),filesBtn=document.getElementById('filesBtn'),folderInput=document.getElementById('folderInput'),filesInput=document.getElementById('filesInput');if(!folderBtn)return;
  folderBtn.textContent='📁 הוסף תיקייה';filesBtn&&(filesBtn.textContent='＋ הוסף קבצים');
  if(folderInput){folderInput.setAttribute('accept','audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.mp4,.mov,.m4v,.webm')}
  if(filesInput){filesInput.setAttribute('accept','audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.mp4,.mov,.m4v,.webm');filesInput.setAttribute('multiple','')}
  if(!folderBtn.dataset.afdFolder49){folderBtn.dataset.afdFolder49='1';folderBtn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();importDirectory()},true)}
 }
 function run(){enhanceDeck();enhanceLibrary()}
 frame()?.addEventListener('load',()=>setTimeout(enhanceDeck,130));setTimeout(run,250);setTimeout(run,900);setTimeout(run,1700);
})();