(()=>{
if(window.__afd225){window.__afd225.refresh();return}
window.__afd225Active=true;
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const verify={A:{base:0,last:0,ok:false},B:{base:0,last:0,ok:false}};
let boundApi=null,native={};
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 225]',t)}
function getTime(k){try{return window.AFDYouTubeState?.getTime?.(k)||{current:0,duration:0,blocked:false}}catch(e){return{current:0,duration:0,blocked:false}}}
function resetVerify(k){const c=Number(getTime(k).current)||0;verify[k]={base:c,last:c,ok:false}}
function rawPlaying(k){try{return!!native.isPlaying?.(k)}catch(e){return false}}
function verifiedPlaying(k){
 if(!verify[k]||!rawPlaying(k)){if(verify[k])verify[k].ok=false;return false}
 const cur=Number(getTime(k).current)||0,v=verify[k];
 if(cur>v.base+0.025||cur>v.last+0.025)v.ok=true;
 v.last=cur;return!!v.ok
}
function loaded(k){try{return!!native.isLoaded?.(k)||!!D()?.getElementById('ytDeck'+k)||!!D()?.querySelector?.('#ytMaster'+k+' iframe')}catch(e){return false}}
function ytFrame(k){const d=D(),w=d?.getElementById('ytMaster'+k);return w?.querySelector?.('iframe')||null}
function direct(k,func,args=[]){const f=ytFrame(k);if(!f?.contentWindow)return false;try{f.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*');return true}catch(e){return false}}
function dispatchCore(k,action){try{window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action,afd225:true}}));return true}catch(e){return false}}
async function playNow(k){
 if(!['A','B'].includes(k)||!loaded(k)){status('YOUTUBE PLAY ERROR • DECK '+k+' לא טעון');return false}
 if(verifiedPlaying(k))return true;
 resetVerify(k);const t0=Date.now();let sent=false;
 try{
  if(typeof native.playNow==='function'){sent=(await Promise.resolve(native.playNow(k)))!==false}
  else sent=dispatchCore(k,'play')
 }catch(e){console.warn('[AFD 225] native/core play',e)}
 if(!sent)sent=direct(k,'playVideo',[]);
 for(let i=0;i<18;i++){
  const t=getTime(k);if(t.blocked){status('YOUTUBE • הסרטון חסום לניגון בתוך האפליקציה');return false}
  if(verifiedPlaying(k)){status('YOUTUBE PLAYING VERIFIED • DECK '+k+' • '+(Date.now()-t0)+'ms');return true}
  if(i>=1)direct(k,'playVideo',[]);
  await sleep(i<4?180:320)
 }
 status('YOUTUBE PLAY ERROR • DECK '+k+' קיבל PLAY אבל הזמן לא התקדם');return false
}
function pause(k){if(!['A','B'].includes(k))return false;verify[k].ok=false;let ok=false;try{if(typeof native.pause==='function')ok=native.pause(k)!==false;else ok=dispatchCore(k,'pause')}catch(e){}direct(k,'pauseVideo',[]);return ok||true}
function stop(k){if(!['A','B'].includes(k))return false;verify[k].ok=false;let ok=false;try{if(typeof native.stop==='function')ok=native.stop(k)!==false;else ok=dispatchCore(k,'stop')}catch(e){}direct(k,'pauseVideo',[]);direct(k,'seekTo',[0,true]);resetVerify(k);return ok||true}
function seek(k,sec){if(!['A','B'].includes(k))return false;const n=Math.max(0,Number(sec)||0);verify[k]={base:n,last:n,ok:false};let ok=false;try{if(typeof native.seek==='function')ok=native.seek(k,n)!==false}catch(e){}const d=D(),r=d?.getElementById('seek'+k),t=getTime(k),dur=Number(t.duration)||0;if(r&&dur>0){r.value=String(Math.max(0,Math.min(1000,n/dur*1000)));try{r.dispatchEvent(new Event('input',{bubbles:true,cancelable:true}))}catch(e){}}return direct(k,'seekTo',[n,true])||ok}
function install(){
 const y=window.AFDYouTubeState;if(!y)return false;
 if(y===boundApi&&y.playNow?.__afd225)return true;
 boundApi=y;
 native={
  isPlaying:typeof y.isPlaying==='function'?y.isPlaying.bind(y):()=>false,
  isLoaded:typeof y.isLoaded==='function'?y.isLoaded.bind(y):null,
  playNow:typeof y.playNow==='function'&&!y.playNow.__afd225?y.playNow.bind(y):null,
  pause:typeof y.pause==='function'&&!y.pause.__afd225?y.pause.bind(y):null,
  stop:typeof y.stop==='function'&&!y.stop.__afd225?y.stop.bind(y):null,
  seek:typeof y.seek==='function'&&!y.seek.__afd225?y.seek.bind(y):null
 };
 resetVerify('A');resetVerify('B');
 const p=k=>playNow(k);p.__afd225=true;const pa=k=>pause(k);pa.__afd225=true;const st=k=>stop(k);st.__afd225=true;const sk=(k,s)=>seek(k,s);sk.__afd225=true;const ip=k=>verifiedPlaying(k);ip.__afd225=true;const il=k=>loaded(k);il.__afd225=true;
 y.playNow=p;y.pause=pa;y.stop=st;y.seek=sk;y.isPlaying=ip;y.isLoaded=il;
 status('AFD 1.5.25 • YouTube PLAY bridge ready');return true
}
function syncButtons(){const d=D(),y=window.AFDYouTubeState;if(!d||!y)return;for(const k of ['A','B']){const b=d.querySelector?.('[data-act="play"][data-d="'+k+'"]');if(b)b.classList?.toggle?.('on',!!y.isPlaying?.(k))}}
function refresh(){window.__afd225Active=true;install();syncButtons()}
window.__afd225={refresh,playNow,pause,stop,seek,direct,verifiedPlaying,loaded};
F()?.addEventListener('load',()=>setTimeout(()=>{boundApi=null;refresh()},120));refresh();setInterval(refresh,140);
})();
