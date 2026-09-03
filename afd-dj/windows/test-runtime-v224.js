const fs=require('fs');
const assert=require('assert');
const {patchText}=require('./patch-v224.js');

const main212=fs.readFileSync('main-v212.js','utf8');
assert(main212.includes('playNow:deck=>{'),'main-v212 must expose YouTube playNow');

const raw215=fs.readFileSync('runtime-v215.js','utf8');
const patched215=patchText('runtime-v215.js',raw215);
assert(patched215.includes("AFDYouTubeState?.playNow==='function'"),'runtime-v215 must prefer playNow');
assert(!patched215.includes("if(typeof window.AFDYouTubeState?.play==='function')window.AFDYouTubeState.play(k)"),'runtime-v215 must not use toggle play for startDeck');

let playing=false,playNowCalls=0,toggleCalls=0;
const status={textContent:''};
const innerDoc={
  addEventListener(){},
  querySelector(){return null},
  getElementById(){return null}
};
const frame={contentDocument:innerDoc,addEventListener(){}};
global.document={getElementById(id){if(id==='console')return frame;if(id==='status')return status;return null}};
global.setInterval=()=>0;
const api={getOwner:()=> 'youtube',startDeck:async()=>false};
global.window={
  __afd215:api,
  __afdUnified215:api,
  AFDYouTubeState:{
    isPlaying:()=>playing,
    playNow(){playNowCalls++;setTimeout(()=>{playing=true},30);return true},
    play(){toggleCalls++;playing=!playing;throw new Error('toggle play must never be used by Auto Mix')},
    getTime:()=>({current:0,duration:180,blocked:false})
  }
};
require('./runtime-v220.js');
(async()=>{
  const ok=await window.__afd215.startDeck('A');
  assert.strictEqual(ok,true,'patched startDeck must confirm YouTube playing');
  assert(playNowCalls>=1,'playNow must be called');
  assert.strictEqual(toggleCalls,0,'toggle play must never be called');
  assert.strictEqual(playing,true,'YouTube must remain playing');
  console.log('AFD v1.5.24 behavior OK: Side View Auto Mix start uses playNow only and remains playing');
})().catch(e=>{console.error(e);process.exit(1)});
