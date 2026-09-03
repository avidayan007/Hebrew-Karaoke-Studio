(()=>{
if(window.__afd222){window.__afd222.refresh();return}
window.__afd222Active=true;
const F=()=>document.getElementById('console');
const D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let lastApi=null;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD 222]',t)}
function owner(k){try{return window.__afd215?.getOwner?.(k)||window.__afdUnified215?.getOwner?.(k)||''}catch(e){return''}}
function ytFrame(k){const d=D(),wrap=d?.getElementById('ytMaster'+k);return wrap?.querySelector?.('iframe')||d?.querySelector?.('#ytMaster'+k+' iframe')||null}
function command(k,func,args=[]){
 const f=ytFrame(k);if(!f?.contentWindow)return false;
 try{f.contentWindow.postMessage(JSON.stringify({event:'command',func,args}), '*');return true}catch(e){status('YOUTUBE COMMAND ERROR • '+(e?.message||e));return false}
}
function directPlay(k){return command(k,'playVideo',[])}
function directPause(k){return command(k,'pauseVideo',[])}
function directStop(k){const a=directPause(k),b=command(k,'seekTo',[0,true]);return a||b}
function directSeek(k,sec){return command(k,'seekTo',[Math.max(0,Number(sec)||0),true])}
async function reliableYouTubeStart(k){
 const y=window.AFDYouTubeState;if(!y){status('YOUTUBE PLAY ERROR • מנוע YouTube לא זמין');return false}
 if(y.isPlaying?.(k))return true;
 const end=performance.now()+12000;let attempts=0,frameSeen=false;
 while(performance.now()<end){
  attempts++;
  const sent=directPlay(k);frameSeen=frameSeen||sent;
  if(!sent&&typeof y.__afd222FallbackPlay==='function')try{y.__afd222FallbackPlay(k)}catch(e){}
  const until=performance.now()+850;
  while(performance.now()<until){
   if(y.isPlaying?.(k)){status('YOUTUBE PLAY • DECK '+k+' • AUTO START OK');return true}
   const t=y.getTime?.(k)||{};if(t.blocked){status('YOUTUBE • הסרטון חסום לניגון בתוך האפליקציה');return false}
   await sleep(70)
  }
  await sleep(Math.min(420,100+attempts*35))
 }
 status(frameSeen?'YOUTUBE PLAY ERROR • נשלחה פקודת PLAY אבל הנגן לא התחיל':'YOUTUBE PLAY ERROR • נגן YouTube עדיין לא מוכן');return false
}
function installDirectApi(){
 const y=window.AFDYouTubeState;if(!y)return false;
 if(y!==lastApi){
  if(typeof y.play==='function'&&!y.play.__afd222)y.__afd222FallbackPlay=y.play.bind(y);
  if(typeof y.pause==='function'&&!y.pause.__afd222)y.__afd222FallbackPause=y.pause.bind(y);
  if(typeof y.stop==='function'&&!y.stop.__afd222)y.__afd222FallbackStop=y.stop.bind(y);
  lastApi=y
 }
 const play=k=>directPlay(k);play.__afd222=true;
 const pause=k=>directPause(k);pause.__afd222=true;
 const stop=k=>directStop(k);stop.__afd222=true;
 const seek=(k,sec)=>directSeek(k,sec);seek.__afd222=true;
 y.play=play;y.pause=pause;y.stop=stop;y.seek=seek;
 const d=D();if(d)y.isLoaded=k=>!!d.getElementById('ytDeck'+k)||!!ytFrame(k);
 return true
}
function patchStartDeck(){
 const api=window.__afd215||window.__afdUnified215;if(!api||typeof api.startDeck!=='function')return false;
 if(api.startDeck.__afd222)return true;
 const prev=api.startDeck.bind(api);
 const fn=async k=>owner(k)==='youtube'?reliableYouTubeStart(k):prev(k);fn.__afd222=true;fn.__afd222Prev=prev;api.startDeck=fn;
 for(const n of ['__afdUnified215','__afdUnified214','__afdUnified213','__afdUnified212','__afdUnified211'])if(window[n]===api)window[n].startDeck=fn;
 return true
}
function refresh(){window.__afd222Active=true;const a=installDirectApi(),b=patchStartDeck();if(a&&b)window.__afd222Ready=true}
window.__afd222={refresh,reliableYouTubeStart,directPlay,directPause,directStop,directSeek,command};
F()?.addEventListener('load',()=>setTimeout(refresh,500));refresh();setInterval(refresh,300);
})();
