// Avi Karaoke Studio Web v1.125 — external display mirrors live lyric size/export + deep virtual waveform zoom
(function(){
  const audio=document.getElementById('audio');
  const preview=document.getElementById('preview');
  const lyrics=document.getElementById('lyricsPreview');
  const extBtn=document.getElementById('hksExternalDisplay102');

  // ---------- External audience display mirrors LIVE preview styling ----------
  if(preview&&lyrics&&extBtn){
    let ext=null,timer=null;
    const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&Number(getComputedStyle(el).opacity||1)>0;
    function lyricStyle(){
      const cs=getComputedStyle(lyrics),ph=Math.max(1,preview.clientHeight),pw=Math.max(1,preview.clientWidth);
      const fs=parseFloat(cs.fontSize)||48;
      let lh=parseFloat(cs.lineHeight);if(!Number.isFinite(lh))lh=fs*1.15;
      return {fontVh:(fs/ph)*100,lineHeight:lh/fs,widthPct:(lyrics.clientWidth/pw)*100,fontFamily:cs.fontFamily,fontWeight:cs.fontWeight,color:cs.color,textShadow:cs.textShadow,textAlign:cs.textAlign};
    }
    function snap(){
      const l=document.querySelector('.brandL'),r=document.querySelector('.brandR');
      const im=document.getElementById('bgImg'),v=document.getElementById('bgVideo');
      const title=document.getElementById('hksSongTitleSlide');
      const titleCs=title?getComputedStyle(title):null;
      const ph=Math.max(1,preview.clientHeight);
      return {
        lyrics:lyrics.innerHTML||'',lyricsVisible:visible(lyrics),lyricsStyle:lyricStyle(),
        title:title?.textContent||'',titleVisible:visible(title),titleStyle:titleCs?{fontVh:((parseFloat(titleCs.fontSize)||48)/ph)*100,fontFamily:titleCs.fontFamily,fontWeight:titleCs.fontWeight,color:titleCs.color,textShadow:titleCs.textShadow}:null,
        left:l?.textContent||'',right:r?.textContent||'',leftStyle:l?.getAttribute('style')||'',rightStyle:r?.getAttribute('style')||'',
        image:im&&!im.hidden?im.src:'',video:v&&!v.hidden?v.src:'',videoTime:v?.currentTime||0,videoPaused:v?.paused??true
      };
    }
    function send(){if(!ext||ext.closed){ext=null;return}try{ext.postMessage({type:'hks-audience-125',data:snap()},location.origin)}catch(_){}}
    function openExternal(){
      ext=window.open('','avi-karaoke-audience','popup=yes,width=1280,height=720');
      if(!ext){alert('הדפדפן חסם את חלון המסך החיצוני. אשר חלונות קופצים ונסה שוב.');return}
      ext.document.open();ext.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>Avi Karaoke — External Display</title><style>
      html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000;font-family:Arial,"Noto Sans Hebrew",sans-serif;color:#fff}#stage{position:fixed;inset:0;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden}#bg,#vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}#vid{display:none}#shade{position:absolute;inset:0;background:rgba(0,0,0,.08)}.brand{position:absolute;z-index:3;top:2.2%;font-weight:900;font-size:clamp(16px,2vw,34px);color:#2584e6}.left{left:2.5%;direction:ltr}.right{right:2.5%}#lyrics,#title{position:relative;z-index:4;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}#title{position:absolute;inset:0;width:100%;padding:4%;box-sizing:border-box}#fs{position:fixed;right:12px;bottom:12px;z-index:9;padding:10px 14px;border:1px solid #d9a52d;border-radius:9px;background:#17120a;color:#f6d36f;font-weight:900;opacity:.8}#fs:hover{opacity:1}</style></head><body><div id="stage"><img id="bg"><video id="vid" muted playsinline></video><div id="shade"></div><div id="bl" class="brand left"></div><div id="br" class="brand right"></div><div id="lyrics"></div><div id="title"></div></div><button id="fs">⛶ מסך מלא</button><script>
      const bg=document.getElementById('bg'),vid=document.getElementById('vid'),ly=document.getElementById('lyrics'),ti=document.getElementById('title'),bl=document.getElementById('bl'),br=document.getElementById('br');
      addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='hks-audience-125')return;const d=e.data.data||{},s=d.lyricsStyle||{};ly.innerHTML=d.lyrics||'';ly.style.display=d.lyricsVisible?'flex':'none';ly.style.width=(s.widthPct||90)+'%';ly.style.fontSize=(s.fontVh||8)+'vh';ly.style.lineHeight=String(s.lineHeight||1.15);ly.style.fontFamily=s.fontFamily||'Arial';ly.style.fontWeight=s.fontWeight||'900';ly.style.color=s.color||'#fff';ly.style.textShadow=s.textShadow||'0 3px 8px #000';ly.style.textAlign=s.textAlign||'center';const ts=d.titleStyle||{};ti.textContent=d.title||'';ti.style.display=d.titleVisible?'flex':'none';ti.style.fontSize=(ts.fontVh||8)+'vh';ti.style.fontFamily=ts.fontFamily||'Arial';ti.style.fontWeight=ts.fontWeight||'900';ti.style.color=ts.color||'#fff';ti.style.textShadow=ts.textShadow||'0 3px 8px #000';bl.textContent=d.left||'';br.textContent=d.right||'';if(d.leftStyle)bl.setAttribute('style',d.leftStyle);if(d.rightStyle)br.setAttribute('style',d.rightStyle);if(d.video){if(vid.src!==d.video)vid.src=d.video;vid.style.display='block';bg.style.display='none';if(Math.abs((vid.currentTime||0)-(d.videoTime||0))>.5)try{vid.currentTime=d.videoTime||0}catch(_){ }if(!d.videoPaused)vid.play().catch(()=>{});else vid.pause()}else if(d.image){bg.src=d.image;bg.style.display='block';vid.style.display='none';vid.pause()}else{bg.style.display='none';vid.style.display='none'}});document.getElementById('fs').onclick=()=>document.documentElement.requestFullscreen?.();<\/script></body></html>`);ext.document.close();setTimeout(send,120);clearInterval(timer);timer=setInterval(send,90);ext.focus();
    }
    extBtn.onclick=openExternal;
    ['hksFontMinus','hksFontPlus'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(send,0)));
    window.__hksExternalDisplay125={open:openExternal,send};
  }

  // ---------- Export lyric font size follows live preview size ----------
  if(preview&&lyrics){
    try{
      const original=window.buildAss;
      if(typeof original==='function'&&!original.__hksLiveSize125){
        const wrapped=function(duration){
          let ass=original(duration);
          try{
            const fs=parseFloat(getComputedStyle(lyrics).fontSize)||48;
            const ph=Math.max(1,preview.clientHeight||1);
            const assSize=Math.max(24,Math.min(260,Math.round((fs/ph)*1080)));
            ass=ass.replace(/^(Style:\s*Lyrics,[^\n]*)$/gmi,line=>{const p=line.split(',');if(p.length>3){p[2]=String(assSize);return p.join(',')}return line});
          }catch(_){}
          return ass;
        };
        wrapped.__hksLiveSize125=true;window.buildAss=wrapped;
      }
    }catch(e){console.warn('[v125 export live lyric size]',e)}
  }

  // ---------- Deep waveform zoom WITHOUT making a giant canvas ----------
  const oldCanvas=document.getElementById('hksSyncWaveCanvas');
  const viewport=document.getElementById('hksSyncWaveViewport115');
  const controls=document.getElementById('hksWaveZoom115');
  if(oldCanvas&&viewport&&controls&&audio){
    // Replace canvas to remove all old conflicting pointer listeners.
    const canvas=oldCanvas.cloneNode(false);canvas.id='hksSyncWaveCanvas';oldCanvas.replaceWith(canvas);canvas.style.width='100%';canvas.style.maxWidth='none';canvas.style.touchAction='none';viewport.style.overflowX='hidden';
    const ctx=canvas.getContext('2d');
    const count=document.getElementById('hksSyncWaveCount'),selText=document.getElementById('hksSyncWaveSelected');
    let minus=document.getElementById('hksSyncMinus50'),plus=document.getElementById('hksSyncPlus50');
    if(minus){const n=minus.cloneNode(true);minus.replaceWith(n);minus=n}if(plus){const n=plus.cloneNode(true);plus.replaceWith(n);plus=n}
    let selected=-1,mode=null,dragIndex=-1,startCurrent=0,pending=0,pid=null;
    const KEYZ='hksWaveZoom125',KEYP='hksWavePan125';
    let zoom=Math.max(1,Math.min(100,Number(localStorage.getItem(KEYZ)||localStorage.getItem('hksWaveZoom115')||1)));
    let pan=Math.max(0,Math.min(1,Number(localStorage.getItem(KEYP)||0)));
    const timed=w=>!!w&&w.time!=null&&Number.isFinite(Number(w.time));
    const dur=()=>{try{return Number(audio.duration)||Number(audioBuffer?.duration)||0}catch(_){return Number(audio.duration)||0}};
    function view(){const d=dur();if(!d)return{start:0,end:1,span:1};const span=d/zoom,maxStart=Math.max(0,d-span),start=maxStart*pan;return{start,end:start+span,span}}
    window.__hksWaveView125={get zoom(){return zoom},get pan(){return pan},view,set(z,p){zoom=Math.max(1,Math.min(100,Number(z)||1));if(p!=null)pan=Math.max(0,Math.min(1,Number(p)||0));applyControls();draw()}};
    function timeFromX(x){const r=canvas.getBoundingClientRect(),v=view();return Math.max(v.start,Math.min(v.end,v.start+((x-r.left)/Math.max(1,r.width))*v.span))}
    function xForTime(t){const r=canvas.getBoundingClientRect(),v=view();return r.left+((Number(t)-v.start)/Math.max(.0001,v.span))*r.width}
    function nearest(x){if(!Array.isArray(words))return-1;const v=view();let best=-1,dist=18;for(let i=0;i<words.length;i++){if(!timed(words[i]))continue;const t=Number(words[i].time);if(t<v.start||t>v.end)continue;const dd=Math.abs(x-xForTime(t));if(dd<=dist){best=i;dist=dd}}return best}
    function clamp(i,t){let min=0,max=dur()||t;try{for(let p=i-1;p>=0;p--)if(timed(words[p])){min=Number(words[p].time)+.001;break}for(let n=i+1;n<words.length;n++)if(timed(words[n])){max=Math.min(max,Number(words[n].time)-.001);break}}catch(_){}if(max<min)max=min;return Math.max(min,Math.min(max,Number(t)||0))}
    let waveKey='',waveCols=null;
    function buildWave(cols,v){if(!audioBuffer)return null;const data=audioBuffer.getChannelData(0),out=new Float32Array(cols*2),d=dur()||audioBuffer.duration||1;const a=Math.max(0,Math.floor((v.start/d)*data.length)),b=Math.min(data.length,Math.ceil((v.end/d)*data.length)),len=Math.max(1,b-a),seg=len/cols;for(let x=0;x<cols;x++){let mn=1,mx=-1,s=a+Math.floor(x*seg),e=Math.max(s+1,a+Math.floor((x+1)*seg)),stride=Math.max(1,Math.floor((e-s)/28));for(let p=s;p<e;p+=stride){const q=data[p]||0;if(q<mn)mn=q;if(q>mx)mx=q}out[x*2]=mn;out[x*2+1]=mx}return out}
    function draw(){const r=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height||150)),dpr=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#050d16';ctx.fillRect(0,0,w,h);const v=view(),cols=Math.min(1400,Math.max(300,w)),key=`${audioBuffer?.length||0}:${cols}:${v.start.toFixed(3)}:${v.end.toFixed(3)}`;if(audioBuffer){if(key!==waveKey){waveKey=key;waveCols=buildWave(cols,v)}if(waveCols){ctx.strokeStyle='#45a5e8';ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<cols;x++){const px=(x/(cols-1))*w,mn=waveCols[x*2],mx=waveCols[x*2+1];ctx.moveTo(px,(1+mn)*h/2);ctx.lineTo(px,(1+mx)*h/2)}ctx.stroke()}}let total=0;if(Array.isArray(words)){for(let i=0;i<words.length;i++){const q=words[i];if(!timed(q))continue;total++;const t=Number(q.time);if(t<v.start||t>v.end)continue;const x=((t-v.start)/v.span)*w;ctx.strokeStyle=i===selected?'#ffd36a':'#ff9f1c';ctx.lineWidth=i===selected?3:1.5;ctx.beginPath();ctx.moveTo(x,5);ctx.lineTo(x,h-5);ctx.stroke()}}const at=Number(audio.currentTime)||0;if(at>=v.start&&at<=v.end){const x=((at-v.start)/v.span)*w;ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}if(count)count.textContent=`${total} נקודות מסונכרנות • זום ${Math.round(zoom*100)}%`;const sw=Array.isArray(words)?words[selected]:null;if(selText)selText.textContent=timed(sw)?`מילה: ${sw.t} — ${Number(sw.time).toFixed(3)} שנ׳`:'לא נבחרה מילה';if(minus)minus.disabled=!timed(sw);if(plus)plus.disabled=!timed(sw)}

    // New pan slider for moving through the enlarged timeline.
    let panSlider=document.getElementById('hksWavePan125');if(!panSlider){panSlider=document.createElement('input');panSlider.type='range';panSlider.id='hksWavePan125';panSlider.min='0';panSlider.max='1000';panSlider.step='1';panSlider.title='הזז את חלון גל הקול שמאלה/ימינה';panSlider.style.cssText='width:100%;margin:2px 0 7px;accent-color:#b56cff';controls.insertAdjacentElement('afterend',panSlider)}
    const zVal=document.getElementById('hksZoomVal115'),zin=document.getElementById('hksZoomIn115'),zout=document.getElementById('hksZoomOut115'),zreset=document.getElementById('hksZoomReset115');
    function applyControls(){if(zVal)zVal.textContent=Math.round(zoom*100)+'%';panSlider.value=String(Math.round(pan*1000));panSlider.disabled=zoom<=1;try{localStorage.setItem(KEYZ,String(zoom));localStorage.setItem(KEYP,String(pan))}catch(_){}}
    function changeZoom(next){const d=dur(),v=view(),focus=(Number(audio.currentTime)>=v.start&&Number(audio.currentTime)<=v.end)?Number(audio.currentTime):(v.start+v.end)/2;zoom=Math.max(1,Math.min(100,next));const span=d?d/zoom:1,maxStart=Math.max(0,d-span),start=Math.max(0,Math.min(maxStart,focus-span/2));pan=maxStart?start/maxStart:0;waveKey='';applyControls();draw()}
    if(zin)zin.onclick=()=>changeZoom(Math.min(100,zoom*1.5));if(zout)zout.onclick=()=>changeZoom(Math.max(1,zoom/1.5));if(zreset)zreset.onclick=()=>{zoom=1;pan=0;waveKey='';applyControls();draw()};
    panSlider.oninput=()=>{pan=Number(panSlider.value)/1000;waveKey='';applyControls();draw()};
    viewport.addEventListener('wheel',e=>{if(zoom<=1)return;if(e.shiftKey||Math.abs(e.deltaX)>0){pan=Math.max(0,Math.min(1,pan+(e.deltaX||e.deltaY)/3000));panSlider.value=String(Math.round(pan*1000));waveKey='';draw();e.preventDefault()}},{passive:false});

    let guide=document.getElementById('hksDragGuide125');if(!guide){guide=document.createElement('div');guide.id='hksDragGuide125';guide.style.cssText='position:fixed;top:0;left:0;width:2px;height:0;pointer-events:none;z-index:2147483647;display:none;background:#fff';document.body.appendChild(guide)}
    function showGuide(x,color){const r=canvas.getBoundingClientRect();guide.style.display='block';guide.style.top=r.top+'px';guide.style.left=Math.max(r.left,Math.min(r.right,x))+'px';guide.style.height=r.height+'px';guide.style.background=color;guide.style.boxShadow=`0 0 7px ${color}`}
    function hideGuide(){guide.style.display='none'}
    canvas.addEventListener('pointerdown',e=>{const hit=nearest(e.clientX);mode=hit>=0?'marker':'cursor';dragIndex=hit;startCurrent=Number(current)||0;pid=e.pointerId;pending=hit>=0?Number(words[hit].time):timeFromX(e.clientX);if(hit>=0){selected=hit;showGuide(e.clientX,'#ffd36a')}else showGuide(e.clientX,'#fff');try{canvas.setPointerCapture?.(e.pointerId)}catch(_){}e.preventDefault()});
    canvas.addEventListener('pointermove',e=>{if(!mode){canvas.style.cursor=nearest(e.clientX)>=0?'ew-resize':'crosshair';return}pending=timeFromX(e.clientX);if(mode==='marker')pending=clamp(dragIndex,pending);showGuide(e.clientX,mode==='marker'?'#ffd36a':'#fff');e.preventDefault()});
    function finish(e,cancel){if(!mode)return;const m=mode,i=dragIndex,t=pending;mode=null;dragIndex=-1;hideGuide();try{canvas.releasePointerCapture?.(pid)}catch(_){}pid=null;if(cancel){draw();return}if(m==='marker'&&i>=0){words[i].time=clamp(i,t);current=startCurrent;audio.currentTime=Number(words[i].time)||0;try{renderWords();updateSyncPreview()}catch(_){}draw();try{setStatus(`נקודת הסנכרון של "${words[i]?.t||''}" הוזזה.`)}catch(_){}}else{audio.currentTime=t;window.__hksResync121?.arm?.(t);draw();try{setStatus('נקודת חזרה נבחרה — לחץ ▶ נגן לסנכרון כדי להתחיל סנכרון חדש מהנקודה הזאת.')}catch(_){}}}
    canvas.addEventListener('pointerup',e=>finish(e,false));canvas.addEventListener('pointercancel',e=>finish(e,true));
    function nudge(delta){if(selected<0||!timed(words[selected]))return;words[selected].time=clamp(selected,Number(words[selected].time)+delta);audio.currentTime=words[selected].time;try{renderWords();updateSyncPreview()}catch(_){}draw()}
    minus?.addEventListener('click',()=>nudge(-.05));plus?.addEventListener('click',()=>nudge(.05));
    audio.addEventListener('timeupdate',()=>requestAnimationFrame(draw));audio.addEventListener('loadedmetadata',draw);window.addEventListener('resize',()=>setTimeout(draw,50));['syncBtn','syncBtn2','undoBtn','resetBtn','startBtn','startBtn2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(draw,0)));
    window.__hksDrawSyncWave=draw;window.__hksSelectSyncMarker56=i=>{selected=Number(i);draw()};applyControls();draw();
  }

  const ver=document.querySelector('.version');if(ver)ver.textContent='Web v1.125';
})();