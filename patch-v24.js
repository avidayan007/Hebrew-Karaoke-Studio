// Hebrew Karaoke Studio Web v1.24 — WMV with studio-quality PCM audio
(function(){
  const $=s=>document.querySelector(s);

  // WMV is the video container. For the audio track we use uncompressed PCM,
  // the same audio encoding normally stored in WAV files: 48kHz / 16-bit stereo.
  const wmvAudio=$('#wmvAudio');
  if(wmvAudio){
    wmvAudio.innerHTML='<option value="pcm" selected>WAV / PCM Lossless — 48 kHz / 16-bit — 1536 kbps</option>';
  }

  function wmvVideoPreset(){
    const q=$('#wmvVideo')?.value||'1080-master';
    if(q==='4k') return {width:3840,height:2160,videoK:'20M'};
    if(q==='1080-high') return {width:1920,height:1080,videoK:'8M'};
    return {width:1920,height:1080,videoK:'12M'};
  }
  window.wmvExportPreset=function(){return {...wmvVideoPreset(),audioMode:'pcm',audioCodec:'pcm_s16le',sampleRate:48000,channels:2,audioLabel:'PCM Lossless 48kHz/16-bit stereo'};};

  // Patch the final WMV conversion command without disturbing the working
  // iPhone FFmpeg loader. MP4 stays AAC; WMV gets PCM lossless audio.
  const previousLoad=loadFFmpeg;
  loadFFmpeg=async function(){
    const f=await previousLoad();
    if(!f.__aviWmvPcmPatched){
      const originalExec=f.exec.bind(f);
      f.exec=async function(args,timeout,...rest){
        let a=Array.isArray(args)?[...args]:args;
        if(Array.isArray(a)&&a.includes('output.wmv')){
          const vp=wmvVideoPreset();
          const bv=a.indexOf('-b:v');
          if(bv>=0&&bv+1<a.length)a[bv+1]=vp.videoK;
          const ca=a.indexOf('-c:a');
          if(ca>=0){
            // remove old WMA codec + bitrate pair
            a.splice(ca,4,'-c:a','pcm_s16le','-ar','48000','-ac','2');
          }
          setExportState('שלב 4/4 — יוצר WMV עם סאונד WAV/PCM ללא דחיסה…',78);
        }
        return originalExec(a,timeout,...rest);
      };
      f.__aviWmvPcmPatched=true;
    }
    return f;
  };

  const version=document.querySelector('.version');
  if(version)version.textContent='Web v1.24';
})();