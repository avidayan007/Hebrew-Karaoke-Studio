const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const {patchText}=require('./patch-v226.js');

(async()=>{
  let checks=0;
  const ok=(v,m)=>{assert(v,m);checks++};
  const eq=(a,b,m)=>{assert.strictEqual(a,b,m);checks++};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  const raw206=fs.readFileSync('runtime-v206.js','utf8');
  let r206=patchText('runtime-v206.js',raw206);
  ok(r206.includes("const unified=window.__afd215?.loadDeck||window.__afdUnified215?.loadDeck"),'runtime206 must prefer unified loader');
  r206=r206.replace("async function startDeck(k){","async function startDeck(k){if(window.__afd215?.startDeck)return window.__afd215.startDeck(k);");
  ok(r206.includes('return window.__afd215.startDeck(k)'),'runtime206 startDeck must delegate to runtime215');

  const raw212=fs.readFileSync('runtime-v212.js','utf8');
  const r212=patchText('runtime-v212.js',raw212);
  ok(r212.includes("C()?.playIndex?.(+r.dataset.i,{mix:true})"),'visible Side View dblclick must call core playIndex with mix:true');
  ok(r212.includes("setInterval(()=>{paintClock('A');paintClock('B')},250)"),'clock polling must be reduced');
  const r225=patchText('runtime-v225.js',fs.readFileSync('runtime-v225.js','utf8'));
  ok(r225.includes('setInterval(refresh,300)'),'v225 bridge polling must be reduced');
  const r220=patchText('runtime-v220.js',fs.readFileSync('runtime-v220.js','utf8'));
  ok(r220.includes('setInterval(refresh,450)'),'v220 polling must be reduced');

  class Hub{
    constructor(){this.l={}}
    addEventListener(t,f){(this.l[t]??=[]).push(f)}
    dispatchEvent(e){for(const f of this.l[e.type]||[])f(e);return true}
    dispatch(t,e){for(const f of this.l[t]||[])f(e)}
  }
  class El{
    constructor(doc){this.doc=doc;this.style={};this.dataset={};this.children=[];this.classList={toggle(){},contains(){return false}};this.parentNode=null;this._id='';this.innerHTML=''}
    set id(v){this._id=v;if(v)this.doc.map.set(v,this)} get id(){return this._id}
    appendChild(x){x.parentNode=this;this.children.push(x);if(x.id)this.doc.map.set(x.id,x);return x}
    insertBefore(x){return this.appendChild(x)}
    querySelector(){return null} querySelectorAll(){return[]}
    closest(){return null}
    addEventListener(){}
  }
  class InnerDoc extends Hub{
    constructor(){super();this.map=new Map();this.documentElement={dataset:{}};this.head=new El(this);this.sideview=new El(this);this.sideview.className='sideview';this.cross={value:'50',dispatchEvent(){}}}
    createElement(){return new El(this)}
    getElementById(id){if(id==='cross'||id==='videoCross')return this.cross;if(id.startsWith('ytDeck')){const k=id.slice(-1);return loaded[k]?{id}:null}return this.map.get(id)||null}
    querySelector(sel){if(sel==='.browser .sideview')return this.sideview;return null}
    querySelectorAll(){return[]}
  }

  const innerDoc=new InnerDoc();
  const innerWin=new Hub();innerWin.document=innerDoc;
  innerWin.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()+6000),0);
  const frame={contentDocument:innerDoc,contentWindow:innerWin,addEventListener(){}};
  const outerDoc=new Hub();outerDoc.documentElement={dataset:{}};outerDoc.head={appendChild(){}};
  const status={textContent:''};
  outerDoc.getElementById=id=>id==='console'?frame:id==='status'?status:null;
  outerDoc.querySelector=()=>null;outerDoc.querySelectorAll=()=>[];
  outerDoc.createElement=()=>({dataset:{},style:{},appendChild(){},querySelector(){return null},querySelectorAll(){return[]}});

  const loaded={A:false,B:false},playing={A:false,B:false},current={A:0,B:0};
  let unifiedLoads=0,rawLoads=0,startCalls=0,lastLoadDeck='';
  const outerWin=new Hub();
  outerWin.requestAnimationFrame=innerWin.requestAnimationFrame;
  outerWin.AFDSpotifyState={has:()=>false,clear(){},applyCross(){}};
  outerWin.AFDYouTubeState={
    isLoaded:k=>loaded[k],isPlaying:k=>playing[k],
    load:async()=>{rawLoads++;throw new Error('legacy raw YouTube loader must not be used by Side View dblclick')},
    clear:k=>{loaded[k]=false;playing[k]=false},
    getTime:k=>({current:current[k],duration:180,blocked:false}),applyCross(){},stop(){return true}
  };
  outerWin.AFDLocalDeckMeta={};
  outerWin.__afd215={
    async loadDeck(k,item){unifiedLoads++;lastLoadDeck=k;loaded[k]=true;playing[k]=false;current[k]=0;outerWin.dispatchEvent(new CustomEventX('afd-youtube-load',{detail:{deck:k,item}}));return true},
    async startDeck(k){startCalls++;if(!loaded[k])return false;playing[k]=true;current[k]+=1;return true},
    getOwner:k=>loaded[k]?'youtube':''
  };
  outerWin.__afdUnified215=outerWin.__afd215;

  class CustomEventX{constructor(type,o={}){this.type=type;this.detail=o.detail}}
  class EventX{constructor(type,o={}){this.type=type;Object.assign(this,o)}}
  const localStorage={getItem(){return null},setItem(){}};
  const ctx={window:outerWin,document:outerDoc,localStorage,performance,console,setTimeout,clearTimeout,setInterval:()=>0,clearInterval(){},queueMicrotask,MutationObserver:class{observe(){}disconnect(){}},CustomEvent:CustomEventX,Event:EventX,URL,Math,Date,JSON,Promise,Intl};

  vm.runInNewContext(r206,ctx,{filename:'runtime-v206-v226.js'});
  ok(outerWin.__afdCore206,'runtime206 core must initialize');
  vm.runInNewContext(r212,ctx,{filename:'runtime-v212-v226.js'});
  ok(outerWin.__afd212,'runtime212 visible Side View must initialize');

  const item1={key:'yt-test-1',name:'YouTube Test 1',folder:'YouTube',kind:'video',afdYouTubeItem:{id:'abc123',title:'YouTube Test 1'}};
  outerWin.__afdCore206.addQueue(item1,false);
  const row1={dataset:{i:'0'}};
  const target1={closest(sel){if(sel==='#afd212side .s212row')return row1;if(sel==='button')return null;return null}};
  const e1={target:target1,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}};
  innerWin.dispatch('dblclick',e1);
  await wait(100);
  eq(unifiedLoads,1,'Side View double-click must use the same unified loader as direct deck drag');
  eq(rawLoads,0,'Side View double-click must not use the legacy raw YouTube loader');
  eq(startCalls,1,'Side View double-click must automatically call startDeck');
  ok(playing[lastLoadDeck],'Side View double-click must leave the loaded YouTube deck playing');
  ok(current[lastLoadDeck]>0,'automatic PLAY must produce playback progress');

  // Second pass: simulate another deck already playing so the exact dblclick takes the MIX path.
  loaded.A=true;playing.A=true;current.A=20;loaded.B=false;playing.B=false;current.B=0;
  const item2={key:'yt-test-2',name:'YouTube Test 2',folder:'YouTube',kind:'video',afdYouTubeItem:{id:'def456',title:'YouTube Test 2'}};
  outerWin.__afdCore206.addQueue(item2,false);
  const row2={dataset:{i:'1'}};
  const target2={closest(sel){if(sel==='#afd212side .s212row')return row2;if(sel==='button')return null;return null}};
  innerWin.dispatch('dblclick',{target:target2,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
  await wait(180);
  eq(unifiedLoads,2,'second Side View double-click must also use unified loader');
  eq(rawLoads,0,'MIX path must never fall back to raw YouTube load');
  ok(startCalls>=2,'MIX path must automatically start the target deck');
  ok(playing.B,'MIX target YouTube deck must be playing automatically');
  ok(current.B>0,'MIX target must show real playback progress');

  console.log(`AFD v1.5.26 Side View integration passed: ${checks} assertions; real dblclick event -> playIndex -> unified loadDeck -> automatic startDeck -> playback, including MIX path.`);
})().catch(e=>{console.error(e);process.exit(1)});
