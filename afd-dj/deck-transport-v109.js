(()=>{
 const fr=()=>document.getElementById('console'),D=()=>{try{return fr()?.contentDocument}catch(e){return null}};
 const ytCmd=(d,deck,func,args=[])=>{['ytDeck','ytMaster'].forEach(p=>{const f=d.getElementById(p+deck);try{f?.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'*')}catch(e){}})};
 function allStop(d,deck,action){
   const media=d.getElementById('vid'+deck);
   try{media?.pause();if(action==='stop'&&media){media.currentTime=0}}catch(e){}
   ytCmd(d,deck,'pauseVideo');if(action==='stop')ytCmd(d,deck,'seekTo',[0,true]);
   window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck,action,source:'universal'}}));
 }
 function bind(){const d=D();if(!d)return;['A','B'].forEach(deck=>{const media=d.getElementById('vid'+deck),root=d.querySelector('.deck'+deck)||media?.closest('.panel'),tr=root?.querySelector('.transport');if(!tr)return;let pause=tr.querySelector('.afdPause109'),stop=tr.querySelector('.afdStop109');if(!pause){pause=d.createElement('button');pause.className='afdPause109';pause.textContent='PAUSE';pause.style.cssText='font-weight:900;background:#6b5414;color:#fff;border:1px solid #d8b23c;border-radius:5px';tr.appendChild(pause)}if(!stop){stop=d.createElement('button');stop.className='afdStop109';stop.textContent='STOP';stop.style.cssText='font-weight:900;background:#641d28;color:#fff;border:1px solid #d64a5e;border-radius:5px';tr.appendChild(stop)}if(pause.dataset.afd110)return;pause.dataset.afd110=stop.dataset.afd110='1';const hit=(btn,action)=>{const go=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();allStop(d,deck,action)};btn.addEventListener('pointerdown',go,{capture:true,passive:false});btn.addEventListener('touchstart',go,{capture:true,passive:false});btn.addEventListener('click',go,true)};hit(pause,'pause');hit(stop,'stop')})}
 fr()?.addEventListener('load',()=>setTimeout(bind,100));setTimeout(bind,250);setInterval(bind,1000);
})();