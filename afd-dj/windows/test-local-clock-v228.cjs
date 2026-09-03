const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

(async()=>{
 let checks=0;const ok=(v,m)=>{assert(v,m);checks++};const eq=(a,b,m)=>{assert.strictEqual(a,b,m);checks++};
 class Hub{constructor(){this.l={}}addEventListener(t,f){(this.l[t]??=[]).push(f)}dispatchEvent(e){for(const f of this.l[e.type]||[])f(e);return true}emit(t,e={}){e.type=t;for(const f of this.l[t]||[])f(e)}}
 class El extends Hub{constructor(){super();this.dataset={};this.style={};this.value='0';this.textContent='';this.src='';this.currentSrc='';this.currentTime=0;this.duration=0;this.paused=true;this.ended=false}closest(){return null}}
 class Doc{constructor(){this.map=new Map();this.documentElement={dataset:{}}}getElementById(id){return this.map.get(id)||null}}
 const d=new Doc(),innerWin=new Hub();innerWin.document=d;
 const frame=new Hub();frame.contentDocument=d;frame.contentWindow=innerWin;
 for(const k of ['A','B']){const v=new El();v.src='afdmedia://media/'+k;v.currentSrc=v.src;v.duration=180;v.currentTime=k==='B'?12.6:5.2;v.paused=false;d.map.set('vid'+k,v);const m=new El();m.src='';m.currentSrc='';d.map.set('master'+k,m);const t=new El();d.map.set('time'+k,t);const rem=new El();d.map.set('remain'+k,rem);const seek=new El();d.map.set('seek'+k,seek);const over=new El();over.style.display='grid';d.map.set('afdClock212'+k,over)}
 const outerDoc={getElementById:id=>id==='console'?frame:null};
 const outerWin=new Hub();outerWin.AFDLocalDeckMeta={A:{name:'A'},B:{name:'B'}};outerWin.__afd215={getOwner:k=>'local'};
 const intervals=[];const ctx={window:outerWin,document:outerDoc,console,setTimeout,clearTimeout,setInterval:(fn,ms)=>{intervals.push({fn,ms});return intervals.length},clearInterval(){},Math,Number,String,Promise,Date,performance};
 const src=fs.readFileSync('runtime-v228.js','utf8').replace(/__AFD_VERSION__/g,'1.5.28');vm.runInNewContext(src,ctx,{filename:'runtime-v228.js'});
 ok(outerWin.__afd228,'clock API must initialize');eq(intervals.length,1,'one lightweight fallback clock interval expected');eq(intervals[0].ms,250,'fallback clock interval must be 250ms');
 eq(d.getElementById('timeB').textContent,'00:12','Deck B elapsed must reflect Local currentTime');eq(d.getElementById('remainB').textContent,'-02:47','Deck B remain must reflect Local duration');ok(Number(d.getElementById('seekB').value)>69&&Number(d.getElementById('seekB').value)<71,'Deck B seek must reflect progress');eq(d.getElementById('afdClock212B').style.display,'none','stale online clock overlay must be hidden on Local Deck B');
 const vb=d.getElementById('vidB');vb.currentTime=37.9;vb.emit('timeupdate',{});eq(d.getElementById('timeB').textContent,'00:37','Deck B timeupdate must repaint elapsed');eq(d.getElementById('remainB').textContent,'-02:22','Deck B timeupdate must repaint remaining');
 const seekB=d.getElementById('seekB');seekB.value='500';seekB.emit('input',{target:seekB,stopImmediatePropagation(){}});ok(Math.abs(vb.currentTime-90)<0.01,'Local Deck B seek input must write directly to media currentTime');
 seekB.emit('pointerup',{target:seekB,stopImmediatePropagation(){}});eq(d.getElementById('timeB').textContent,'01:30','Deck B clock must repaint after seek');
 outerWin.__afd215.getOwner=k=>k==='B'?'youtube':'local';d.getElementById('timeB').textContent='LOCK';intervals[0].fn();eq(d.getElementById('timeB').textContent,'LOCK','Local clock must not overwrite online Deck B time');
 outerWin.__afd215.getOwner=k=>'local';vb.currentTime=91.2;intervals[0].fn();eq(d.getElementById('timeB').textContent,'01:31','fallback interval must keep Local Deck B progressing');
 console.log(`AFD v1.5.28 Local clock passed: ${checks} assertions; Deck B elapsed/remain/seek update from real local media time, stale online overlay hidden, local seek writes currentTime.`);
})().catch(e=>{console.error(e);process.exit(1)});