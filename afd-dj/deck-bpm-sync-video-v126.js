(()=>{
 const $=id=>document.getElementById(id),frame=()=>$('console'),doc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}},lib=()=>{try{return library||[]}catch(e){return[]}};
 const cache=()=>{try{return JSON.parse(localStorage.getItem('afdBpmCache')||'{}')}catch(e){return{}}},key=f=>`${f.name}|${f.size}|${f.lastModified}`;
 const state={A:{base:0,item:null},B:{base:0,item:null}},pending={A:null,B:null};
 function bpmFor(item){if(!item)return 0;const v=parseFloat(item.bpm||cache()[key(item.f)]||0);return Number.isFinite(v)?v:0}
 function show(deck,bpm){const d=doc(),o=d?.getElementById('bpm'+deck);if(o&&bpm)o.textContent=(+bpm).toFixed(1)}
 function setVideo(deck){const d=doc();if(!d)return;const v=d.getElementById('videoCross');if(!v)return;v.value=deck==='A'?'100':'0';v.dispatchEvent(new Event('input',{bubbles:true}));v.dispatchEvent(new Event('change',{bubbles:true}))}
 function playing(deck){const d=doc(),m=d?.getElementById('vid'+deck);return !!(m&&!m.paused&&!m.ended&&m.currentTime>0)}
 function onLoad(deck,item){state[deck].item=item;const b=bpmFor(item);if(b){state[deck].base=b;show(deck,b)}else{pending[deck]=item;const wait=setInterval(()=>{const now=bpmFor(item);if(now){clearInterval(wait);state[deck].base=now;show(deck,now)}},250);setTimeout(()=>clearInterval(wait),15000)}
 const other=deck==='A'?'B':'A';if(!playing(other))setVideo(deck);
 }
 function bindRows(){document.querySelectorAll('#rows .row').forEach(r=>{if(r.dataset.afd126)return;r.dataset.afd126='1';r.querySelectorAll('[data-d]').forEach(b=>b.addEventListener('click',()=>onLoad(b.dataset.d,lib()[+r.dataset.i]),true))})}
 function bindDeck(){const d=doc();if(!d)return;['A','B'].forEach(deck=>{const panel=d.getElementById('vid'+deck)?.closest('.panel')||d.querySelector('.deck'+deck),sync=panel?.querySelector('.transport .sync'),pitch=d.getElementById('pitch'+deck),media=d.getElementById('vid'+deck);if(!sync||!pitch||sync.dataset.afd126)return;sync.dataset.afd126='1';sync.addEventListener('click',e=>{const other=deck==='A'?'B':'A',mine=state[deck].base||parseFloat(d.getElementById('bpm'+deck)?.textContent)||0,target=state[other].base||parseFloat(d.getElementById('bpm'+other)?.textContent)||0;if(!mine||!target)return;e.preventDefault();e.stopImmediatePropagation();const pct=Math.max(-10,Math.min(10,(target/mine-1)*100));pitch.value=String(pct);if(media)media.playbackRate=1+pct/100;pitch.dispatchEvent(new Event('change',{bubbles:true}));const read=d.getElementById('afdPitchRead'+deck);if(read)read.textContent=(pct>0?'+':'')+pct.toFixed(1)+'%';show(deck,mine)},true)})}
 function run(){bindRows();bindDeck();['A','B'].forEach(x=>{if(state[x].base)show(x,state[x].base)})}
 frame()?.addEventListener('load',()=>setTimeout(run,350));new MutationObserver(()=>requestAnimationFrame(run)).observe(document.documentElement,{childList:true,subtree:true});setTimeout(run,600);setInterval(run,2000);
})();