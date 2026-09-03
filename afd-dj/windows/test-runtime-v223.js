const assert=require('assert');
let loaded=false,playing=false,playIndexCalls=0,directStartCalls=0;
const els={status:{textContent:''},titleA:{textContent:'Old Local'},titleB:{textContent:'Empty'}};
const innerDoc={
 getElementById(id){if(id==='ytDeckB'&&loaded)return{id};return els[id]||null},
 querySelector(sel){return null}
};
const frame={contentDocument:innerDoc,addEventListener(){}};
global.document={getElementById(id){if(id==='console')return frame;if(id==='status')return els.status;return null}};
global.setInterval=()=>0;
global.window={
 __afdCore206:{
  async playIndex(i,opts){
   playIndexCalls++;assert.strictEqual(i,0);assert.deepStrictEqual(opts,{mix:true});
   loaded=true;els.titleB.textContent='Test YouTube Song';
   const end=Date.now()+3000;while(Date.now()<end&&!playing)await new Promise(r=>setTimeout(r,10));
   return playing;
  }
 },
 AFDYouTubeState:{isLoaded:k=>k==='B'&&loaded,isPlaying:k=>k==='B'&&playing},
 __afd222:{async reliableYouTubeStart(k){assert.strictEqual(k,'B');directStartCalls++;playing=true;return true}}
};
require('./runtime-v223.js');
(async()=>{
 const item={name:'Test YouTube Song',afdYouTubeItem:{id:'abc123',title:'Test YouTube Song'}};
 const ok=await window.__afd223.playSideYouTube(0,item);
 assert.strictEqual(ok,true,'Side View YouTube flow must complete');
 assert.strictEqual(playIndexCalls,1,'real playIndex must run exactly once');
 assert.strictEqual(directStartCalls,1,'direct YouTube autoplay must be kicked exactly once');
 assert.strictEqual(playing,true,'YouTube must be playing before flow resolves');
 console.log('AFD v1.5.23 exact Side View dblclick behavior OK: playIndex + direct YouTube PLAY + mix continuation');
})().catch(e=>{console.error(e);process.exit(1)});
