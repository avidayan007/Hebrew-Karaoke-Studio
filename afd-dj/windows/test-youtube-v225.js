const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const {patchText}=require('./patch-v225.js');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let checks=0;const ok=(v,msg)=>{assert(v,msg);checks++};const eq=(a,b,msg)=>{assert.strictEqual(a,b,msg);checks++};

// Audit the actual web source the Electron page was designed around.
const core=fs.readFileSync('../inline-youtube-core-v48.js','utf8');
ok(core.includes("window.addEventListener('afd-deck-transport'"),'web core must listen for transport events');
ok(core.includes("if(action==='play')playYT(deck)"),'web core play event must call playYT');
ok(core.includes('p.playVideo()'),'web core must reach YouTube Player.playVideo');
ok(core.includes("d.getElementById('ytMaster'+deck)"),'web core must create ytMaster deck wrapper');
ok(core.includes('getCurrentTime'),'web core must expose player time internally');
const ultra=fs.readFileSync('../ultra.html','utf8');
ok(ultra.includes('data-act="play" data-d="A"'),'Deck A PLAY must carry deck id');
ok(ultra.includes('data-act="play" data-d="B"'),'Deck B PLAY must carry deck id');
const station=fs.readFileSync('../workstation.html','utf8');
ok(station.includes('allow="autoplay; fullscreen"'),'console iframe must allow autoplay');
ok(station.includes('inline-youtube.js'),'workstation must load YouTube loader');
const loader=fs.readFileSync('../inline-youtube.js','utf8');
ok(loader.includes("inline-youtube-core-v48.js"),'web loader must load YouTube core');

// Verify the real runtime-v215 source is patched at the exact manual transport start point.
const raw215=fs.readFileSync('runtime-v215.js','utf8');
const patched215=patchText('runtime-v215.js',raw215);
ok(patched215.includes("const fn=window.AFDYouTubeState?.playNow"),'patched runtime215 must use playNow bridge');
ok(patched215.includes('await Promise.resolve(fn(k))'),'runtime215 must await the bridge result');
ok(!patched215.includes("if(typeof window.AFDYouTubeState?.play==='function')window.AFDYouTubeState.play(k)"),'runtime215 start must not use legacy toggle play');

// Execute the patched runtime-v215 and exercise the actual Window-capture PLAY handler.
class Hub{constructor(){this.l={}}addEventListener(t,f){(this.l[t]??=[]).push(f)}dispatch(t,e){for(const f of this.l[t]||[])f(e)}}
let manualPlaying=false,manualPlay=0,manualPause=0;
const innerWin=new Hub();
const innerDoc={documentElement:{dataset:{}},getElementById(id){if(id==='ytDeckA')return{id};return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){}};
innerWin.document=innerDoc;innerWin.requestAnimationFrame=f=>setTimeout(()=>f(performance.now()),1);
const frame={contentDocument:innerDoc,contentWindow:innerWin,addEventListener(){}};
const outerDoc={documentElement:{dataset:{}},head:{appendChild(){}},getElementById(id){if(id==='console')return frame;if(id==='status')return{textContent:''};return null},querySelectorAll(){return[]},querySelector(){return null},addEventListener(){},createElement(){return{dataset:{},style:{},appendChild(){},querySelectorAll(){return[]}}}};
const outerWin=new Hub();
Object.assign(outerWin,{AFDSpotifyState:{has:()=>false},AFDYouTubeState:{isLoaded:k=>k==='A',isPlaying:()=>manualPlaying,playNow:async()=>{manualPlay++;manualPlaying=true;return true},pause:()=>{manualPause++;manualPlaying=false;return true},stop:()=>{manualPlaying=false;return true},clear(){},getTime:()=>({current:manualPlaying?1:0,duration:180,blocked:false})},AFDLocalDeckMeta:{},__afdCore206:{addQueue(){return true},queue:[]}});
const ctx={window:outerWin,document:outerDoc,localStorage:{getItem(){return null},setItem(){}},performance,console,setTimeout,clearTimeout,setInterval:()=>0,CustomEvent:class{constructor(type,o={}){this.type=type;this.detail=o.detail}},Event:class{},URL,Math,Date,JSON,Promise};
vm.runInNewContext(patched215,ctx,{filename:'runtime-v215-patched.js'});
ok(outerWin.__afd215,'runtime215 API must initialize');
const btn={dataset:{d:'A',act:'play'},closest(sel){return sel==='[data-act]'?this:null}};
const ev=()=>({target:btn,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
innerWin.dispatch('click',ev());await wait(30);
eq(manualPlay,1,'first manual PLAY click must invoke playNow exactly once');
eq(manualPlaying,true,'first manual PLAY click must leave YouTube playing');
innerWin.dispatch('click',ev());await wait(20);
eq(manualPause,1,'second manual PLAY click must pause exactly once');
eq(manualPlaying,false,'second manual PLAY click must leave YouTube paused');
innerWin.dispatch('click',ev());await wait(30);
eq(manualPlay,2,'third manual PLAY click must start again');
eq(manualPlaying,true,'third manual PLAY click must leave YouTube playing');

// Execute runtime-v225 against a remote-core-like API that has NO playNow/pause/stop/seek.
let current=0,rawPlaying=false,ignoreCore=false,corePlayEvents=0,directPlay=0,directPause=0;
const hub=new Hub();
let tickTimer=null;function startClock(){if(tickTimer)return;tickTimer=setInterval(()=>{if(rawPlaying)current+=0.08},40)}startClock();
hub.AFDYouTubeState={isPlaying:()=>rawPlaying,getTime:()=>({current,duration:180,blocked:false})};
hub.addEventListener('afd-deck-transport',e=>{const a=e.detail?.action;if(a==='play'){corePlayEvents++;if(!ignoreCore)rawPlaying=true}else if(a==='pause'){rawPlaying=false}else if(a==='stop'){rawPlaying=false;current=0}});
hub.dispatchEvent=e=>{hub.dispatch(e.type,e);return true};
const iframe={contentWindow:{postMessage(raw){const m=JSON.parse(raw);if(m.func==='playVideo'){directPlay++;rawPlaying=true}else if(m.func==='pauseVideo'){directPause++;rawPlaying=false}else if(m.func==='seekTo')current=Number(m.args?.[0])||0}}};
const wrap={querySelector:s=>s==='iframe'?iframe:null};
const playClass={on:false,toggle(_n,v){this.on=!!v}};
const bridgeDoc={getElementById(id){if(id==='console')return bridgeFrame;if(id==='status')return{textContent:''};if(id==='ytDeckA')return{id};if(id==='ytMasterA')return wrap;if(id==='seekA')return{value:'0',dispatchEvent(){}};return null},querySelector(sel){if(sel.includes('data-act="play"')&&sel.includes('A'))return{classList:playClass};if(sel.includes('#ytMasterA'))return iframe;return null}};
const bridgeInner={getElementById:bridgeDoc.getElementById.bind(bridgeDoc),querySelector:bridgeDoc.querySelector.bind(bridgeDoc)};
const bridgeFrame={contentDocument:bridgeInner,addEventListener(){}};
const bctx={window:hub,document:bridgeDoc,console,performance,setTimeout,clearTimeout,setInterval:()=>0,CustomEvent:class{constructor(type,o={}){this.type=type;this.detail=o.detail}},Event:class{constructor(type,o={}){this.type=type;Object.assign(this,o)}},Date,Math,JSON,Promise};
vm.runInNewContext(fs.readFileSync('runtime-v225.js','utf8'),bctx,{filename:'runtime-v225.js'});
ok(typeof hub.AFDYouTubeState.playNow==='function','bridge must add playNow to old web API');
ok(typeof hub.AFDYouTubeState.pause==='function','bridge must add pause to old web API');
ok(typeof hub.AFDYouTubeState.stop==='function','bridge must add stop to old web API');
ok(typeof hub.AFDYouTubeState.seek==='function','bridge must add seek to old web API');
rawPlaying=false;current=0;const p1=await hub.AFDYouTubeState.playNow('A');
eq(p1,true,'bridge playNow must succeed through core event');
eq(corePlayEvents,1,'bridge must send core PLAY only once when it works');
ok(current>0,'verified PLAY must require actual timer progress');
eq(hub.AFDYouTubeState.isPlaying('A'),true,'verified isPlaying must be true after time advances');
const beforeEvents=corePlayEvents;await hub.AFDYouTubeState.playNow('A');
eq(corePlayEvents,beforeEvents,'calling playNow while already playing must never toggle/pause');
hub.AFDYouTubeState.pause('A');await wait(60);
eq(rawPlaying,false,'bridge pause must stop playback');
ok(directPause>=1,'bridge pause must also send safe direct pauseVideo');

// Force core event failure: direct iframe playVideo must recover playback.
ignoreCore=true;rawPlaying=false;current=10;hub.__afd225.refresh();const directBefore=directPlay;const p2=await hub.AFDYouTubeState.playNow('A');
eq(p2,true,'direct iframe fallback must recover when core event does nothing');
ok(directPlay>directBefore,'fallback must send playVideo directly to YouTube iframe');
ok(current>10,'fallback success must be verified by actual time progress');
eq(hub.AFDYouTubeState.isPlaying('A'),true,'fallback must end in verified playing state');
clearInterval(tickTimer);

// Auto Mix layer must call the bridge once, never legacy toggle play.
let autoPlaying=false,autoCalls=0,legacyCalls=0,autoCurrent=0;
const autoStatus={textContent:''};const autoInner={addEventListener(){},querySelector(){return null},getElementById(){return null}};const autoFrame={contentDocument:autoInner,addEventListener(){}};
const autoApi={getOwner:()=> 'youtube',startDeck:async()=>false};
const autoWin={__afd215:autoApi,__afdUnified215:autoApi,AFDYouTubeState:{isPlaying:()=>autoPlaying,playNow:async()=>{autoCalls++;autoPlaying=true;autoCurrent+=1;return true},play(){legacyCalls++;throw Error('legacy play forbidden')},getTime:()=>({current:autoCurrent,duration:180,blocked:false})}};
const autoCtx={window:autoWin,document:{getElementById(id){if(id==='console')return autoFrame;if(id==='status')return autoStatus;return null}},console,performance,setTimeout,clearTimeout,setInterval:()=>0,Event:class{},Promise,Math,Date};
vm.runInNewContext(fs.readFileSync('runtime-v220.js','utf8'),autoCtx,{filename:'runtime-v220.js'});
const autoOK=await autoWin.__afd215.startDeck('A');
eq(autoOK,true,'Auto Mix startDeck must confirm YouTube playing');
eq(autoCalls,1,'Auto Mix must call playNow exactly once');
eq(legacyCalls,0,'Auto Mix must never call legacy toggle play');

console.log(`AFD v1.5.25 YouTube PLAY audit passed: ${checks} assertions; manual PLAY/PAUSE/PLAY + verified event path + direct iframe fallback + Auto Mix.`);
