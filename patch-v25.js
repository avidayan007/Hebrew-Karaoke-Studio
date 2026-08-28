// Hebrew Karaoke Studio Web v1.26 — container-safe studio audio choices
(function(){
 const $=s=>document.querySelector(s);
 const mp4=$('#mp4Audio'),wmv=$('#wmvAudio');
 // MP4 does not accept raw pcm_s16le/pcm_s24le in this FFmpeg MP4 muxer.
 // ALAC is lossless and valid inside MP4; AAC remains the maximum-compatibility option.
 if(mp4) mp4.innerHTML=`<option value="aac320">AAC 320 kbps — תאימות גבוהה</option><option value="alac" selected>ALAC Lossless — איכות אולפן ללא איבוד</option>`;
 // ASF/WMV accepts uncompressed PCM, so keep both studio PCM choices plus WMA compatibility.
 if(wmv) wmv.innerHTML=`<option value="wma320">WMA 320 kbps — תאימות גבוהה</option><option value="pcm16" selected>PCM / WAV Quality — 48kHz / 16-bit / 1536 kbps</option><option value="pcm24">PCM Studio — 48kHz / 24-bit / 2304 kbps</option>`;
 function audioArgs(mode,container){
   if(container==='mp4'){
     if(mode==='alac')return ['-c:a','alac','-ar','48000','-ac','2'];
     return ['-c:a','aac','-b:a','320k','-ar','48000','-ac','2'];
   }
   if(mode==='pcm24')return ['-c:a','pcm_s24le','-ar','48000','-ac','2'];
   if(mode==='pcm16')return ['-c:a','pcm_s16le','-ar','48000','-ac','2'];
   return ['-c:a','wmav2','-b:a','320k','-ar','48000','-ac','2'];
 }
 function label(mode,container){
   if(container==='mp4')return mode==='alac'?'ALAC Lossless':'AAC 320 kbps';
   return mode==='pcm24'?'PCM Studio 24-bit':mode==='pcm16'?'PCM/WAV 16-bit':'WMA 320 kbps';
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
        const container=isWmv?'wmv':'mp4';
        const mode=isWmv?($('#wmvAudio')?.value||'pcm16'):($('#mp4Audio')?.value||'alac');
        const ca=a.indexOf('-c:a');
        if(ca>=0){
          let end=ca+2;
          while(end<a.length && ['-b:a','-ar','-ac'].includes(a[end])) end+=2;
          a.splice(ca,end-ca,...audioArgs(mode,container));
        }
        setExportState((isWmv?'WMV':'MP4')+' — סאונד: '+label(mode,container),isWmv?78:20);
       }
      }
      return ex(a,timeout,...rest);
    };
    f.__aviAudioChoices=true;
   }
   return f;
 };
 const v=document.querySelector('.version');if(v)v.textContent='Web v1.26';
})();