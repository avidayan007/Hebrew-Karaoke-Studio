const fs=require('fs');
const path=require('path');
const vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'runtime-v222.js'),'utf8');
let playing=false;
const commands=[];
const ytIframe={contentWindow:{postMessage(msg){const x=JSON.parse(msg);commands.push(x);if(x.func==='playVideo')playing=true;if(x.func==='pauseVideo')playing=false}}};
const wrap={querySelector(sel){return sel==='iframe'?ytIframe:null}};
const innerDoc={
  getElementById(id){if(id==='ytMasterA')return wrap;if(id==='ytDeckA')return {};return null},
  querySelector(sel){if(sel==='#ytMasterA iframe')return ytIframe;return null}
};
const consoleFrame={contentDocument:innerDoc,addEventListener(){}};
const statusEl={textContent:''};
const document={getElementById(id){if(id==='console')return consoleFrame;if(id==='status')return statusEl;return null}};
const afd215={getOwner:k=>k==='A'?'youtube':'',startDeck:async()=>false};
const window={
  AFDYouTubeState:{isPlaying:k=>k==='A'&&playing,getTime:()=>({current:0,duration:180,blocked:false}),isLoaded:()=>true,play:()=>false,pause:()=>false,stop:()=>false},
  __afd215:afd215,__afdUnified215:afd215,__afdUnified214:afd215,__afdUnified213:afd215,__afdUnified212:afd215,__afdUnified211:afd215
};
const sandbox={window,document,console,setTimeout,clearTimeout,setInterval:()=>0,performance:{now:()=>Date.now()},Promise,JSON,Math,Date};
vm.runInNewContext(src,sandbox,{filename:'runtime-v222.js'});
(async()=>{
  if(!window.__afd222)throw Error('runtime v222 API missing');
  playing=false;commands.length=0;
  const direct=await window.__afd222.reliableYouTubeStart('A');
  if(!direct)throw Error('reliableYouTubeStart returned false');
  if(!commands.some(x=>x.func==='playVideo'))throw Error('playVideo command was not sent to YouTube iframe');
  playing=false;commands.length=0;
  const viaDeck=await window.__afd215.startDeck('A');
  if(!viaDeck)throw Error('patched startDeck returned false for YouTube');
  if(!commands.some(x=>x.func==='playVideo'))throw Error('patched startDeck did not send playVideo');
  if(typeof window.AFDYouTubeState.play!=='function'||window.AFDYouTubeState.play('A')!==true)throw Error('direct YouTube play API is not installed');
  console.log('AFD v1.5.22 runtime behavior OK: Side View startDeck sends direct YouTube playVideo and confirms playing');
})().catch(e=>{console.error(e);process.exit(1)});
