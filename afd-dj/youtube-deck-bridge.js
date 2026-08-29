(function(){
  const ORIGIN=location.origin;
  let bc=null;
  try{bc=new BroadcastChannel('afd-dj-video')}catch(e){}

  function ytSrc(id,opts){
    opts=opts||{};
    const p=new URLSearchParams({autoplay:'1',playsinline:'1',rel:'0',enablejsapi:'1',origin:ORIGIN});
    if(opts.controls===false)p.set('controls','0');
    if(opts.mute)p.set('mute','1');
    return 'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?'+p.toString();
  }

  function makeFrame(doc,id,master){
    const f=doc.createElement('iframe');
    f.id=id;
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen=true;
    f.setAttribute('playsinline','');
    Object.assign(f.style,{position:'absolute',inset:'0',width:'100%',height:'100%',border:'0',background:'#000',zIndex:'20'});
    if(master)f.style.pointerEvents='none';
    return f;
  }

  function loadIntoConsole(videoId,title){
    const consoleFrame=document.getElementById('console');
    if(!consoleFrame)return;
    let doc;
    try{doc=consoleFrame.contentDocument}catch(e){return}
    if(!doc)return;

    const deckVideo=doc.getElementById('vidA');
    const deckScreen=deckVideo&&deckVideo.parentElement;
    const masterA=doc.getElementById('masterA');
    const masterScreen=masterA&&masterA.parentElement;
    if(!deckScreen||!masterScreen)return;

    let old=doc.getElementById('afdYoutubeDeckA'); if(old)old.remove();
    old=doc.getElementById('afdYoutubeMaster'); if(old)old.remove();

    deckScreen.style.position='relative';
    masterScreen.style.position='relative';

    const deckFrame=makeFrame(doc,'afdYoutubeDeckA',false);
    deckFrame.src=ytSrc(videoId,{controls:true,mute:false});
    deckScreen.appendChild(deckFrame);

    const masterFrame=makeFrame(doc,'afdYoutubeMaster',true);
    masterFrame.src=ytSrc(videoId,{controls:false,mute:true});
    masterScreen.appendChild(masterFrame);

    const titleA=doc.getElementById('titleA');
    if(titleA)titleA.textContent=title||'YouTube';
    const postA=doc.getElementById('postA');
    if(postA)postA.style.display='none';
    const masterLogo=doc.getElementById('masterLogo');
    if(masterLogo)masterLogo.style.display='none';

    const timeA=doc.getElementById('timeA');
    const remainA=doc.getElementById('remainA');
    if(timeA)timeA.textContent='YT';
    if(remainA)remainA.textContent='▶';

    // Make the existing Deck A PLAY/CUE buttons control the official YouTube iframe.
    function command(func,args){
      try{deckFrame.contentWindow.postMessage(JSON.stringify({event:'command',func:func,args:args||[]}), '*')}catch(e){}
      try{masterFrame.contentWindow.postMessage(JSON.stringify({event:'command',func:func,args:args||[]}), '*')}catch(e){}
    }
    const playBtn=doc.querySelector('[data-act="play"][data-d="A"]');
    const cueBtn=doc.querySelector('[data-act="cue"][data-d="A"]');
    if(playBtn){
      playBtn.onclick=function(){
        const on=playBtn.classList.toggle('on');
        command(on?'playVideo':'pauseVideo');
      };
      playBtn.classList.add('on');
    }
    if(cueBtn){cueBtn.onclick=function(){command('pauseVideo');command('seekTo',[0,true]);if(playBtn)playBtn.classList.remove('on')}}

    try{bc&&bc.postMessage({type:'youtube',videoId:videoId,title:title||'YouTube'})}catch(e){}

    const overlay=document.getElementById('afdYTOverlay');
    const searchFrame=document.getElementById('afdYTFrame');
    if(overlay)overlay.classList.remove('on');
    if(searchFrame)searchFrame.src='about:blank';
  }

  window.addEventListener('message',function(e){
    if(e.origin!==ORIGIN)return;
    const d=e.data||{};
    if(d.type==='afd-youtube-load'&&d.videoId){
      loadIntoConsole(String(d.videoId),String(d.title||'YouTube'));
    }
  });
})();