// Hebrew Karaoke Studio Web v1.25 — selectable audio formats for MP4 + WMV
(function(){
 const $=s=>document.querySelector(s);
 const mp4=$('#mp4Audio'),wmv=$('#wmvAudio');
 if(mp4) mp4.innerHTML=`<option value="aac320">AAC 320 kbps — תאימות גבוהה</option><option value="pcm16" selected>PCM / WAV Quality — 48kHz / 16-bit / 1536 kbps</option><option value="pcm24">PCM Studio — 48kHz / 24-bit / 2304 kbps</option>`;
 if(wmv) wmv.innerHTML=`<option value="wma320">WMA 320 kbps — תאימות גבוהה</option><option value="pcm16" selected>PCM / WAV Quality — 48kHz / 16-bit / 1536 kbps</option><option value="pcm24">PCM Studio — 48kHz / 24-bit / 2304 kbps</option>`;
 function audioArgs(mode,container){
   if(mode==='pcm24')return ['-c:a','pcm_s24le','-ar','48000','-ac','2'];
   if(mode==='pcm16')return ['-c:a','pcm_s16le','-ar','48000','-ac','2'];
   return container==='wmv'?['-c:a','wmav2','-b:a','320k']:['-c:a','aac','-b:a','320k'];
 }
 const prev=loadFFmpeg;
 loadFFmpeg=async function(){
   const f=await prev();
   if(!f.__aviAudioChoices){
    const ex=f.exec.bind(f);
    f.exec=async function(args,timeout,...rest){
      let a=Array.isArray(args)?[...args]:args;
      if(Array.isArray(a)){
       const isWmv=a.includes('output.wmv'),isMp4=a.includes('output.mp4')&&!isWmv;
       if(isWmv||isMp4){
        const mode=isWmv?($('#wmvAudio')?.value||'pcm16'):($('#mp4Audio')?.value||'pcm16');
        const ca=a.indexOf('-c:a');
        if(ca>=0){let end=ca+2;if(a[end]==='-b:a')end+=2;if(a[end]==='-ar')end+=2;if(a[end]==='-ac')end+=2;a.splice(ca,end-ca,...audioArgs(mode,isWmv?'wmv':'mp4'));}
        setExportState((isWmv?'WMV':'MP4')+' — סאונד: '+(mode==='pcm24'?'PCM Studio 24-bit':mode==='pcm16'?'PCM/WAV 16-bit':'320 kbps'),isWmv?78:20);
       }
      }
      return ex(a,timeout,...rest);
    };
    f.__aviAudioChoices=true;
   }
   return f;
 };
 const v=document.querySelector('.version');if(v)v.textContent='Web v1.25';
})();