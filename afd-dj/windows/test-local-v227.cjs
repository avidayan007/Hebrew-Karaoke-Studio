const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const {patchText:p225}=require('./patch-v225.js');
const {patchText:p226}=require('./patch-v226.js');
const {patchText:p227}=require('./patch-v227.js');

(async()=>{
  let checks=0;
  const ok=(v,m)=>{assert(v,m);checks++};
  const eq=(a,b,m)=>{assert.strictEqual(a,b,m);checks++};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  let r225=p227('runtime-v225.js',fs.readFileSync('runtime-v225.js','utf8'));
  r225=p226('runtime-v225.js',r225);
  ok(r225.includes("function loaded(k){try{return!!native.isLoaded?.(k)||!!D()?.getElementById('ytDeck'+k)}catch(e){return false}}"),'YouTube loaded state must ignore persistent master iframe');
  ok(!r225.includes("querySelector?.('#ytMaster'+k+' iframe')"),'persistent hidden YouTube iframe must never own a deck');

  let r215=p227('runtime-v215.js',fs.readFileSync('runtime-v215.js','utf8'));
  r215=p225('runtime-v215.js',r215);
  ok(r215.includes("local=!!(window.AFDLocalDeckMeta?.[k]&&v&&(v.currentSrc||v.src))"),'explicit Local media must have ownership priority');
  ok(r215.includes("for(let attempt=0;attempt<3;attempt++)"),'Local PLAY must retry and verify');
  ok(r215.includes("waitFor(()=>!v.paused&&!v.ended,1800)"),'Local PLAY must verify media really started');

  class Hub{
    constructor(){this.l={}}
    addEventListener(t,f){(this.l[t]??=[]).push(f)}
    dispatchEvent(e){for(const f of this.l[e.type]||[])f(e);return true}
    dispatch(t,e){for(const f of this.l[t]||[])f(e)}
  }
  class El{
    constructor(doc){this.doc=doc;this.style={};this.dataset={};this.children=[];this.parentNode=null;this._id='';this.innerHTML='';this.className='';this.classList={toggle(){},contains:n=>String(this.className).split(/\s+/).includes(n)}}
    set id(v){this._id=v;if(v)this.doc.map.set(v,this)} get id(){return this._id}
    appendChild(x){x.parentNode=this;this.children.push(x);if(x.id)this.doc.map.set(x.id,x);return x}
    insertBefore(x){return this.appendChild(x)}
    remove(){if(this._id)this.doc.map.delete(this._id)}
    querySelector(){return null} querySelectorAll(){return[]}
    closest(){return null}
    addEventListener(){}
  }
  class MediaEl extends El{
    constructor(doc,k){super(doc);this.k=k;this.src='';this.paused=true;this.ended=false;this.currentTime=0;this.readyState=4;this.volume=1;this.muted=false;this.playCalls=0;this.pauseCalls=0}
    get currentSrc(){return this.src}
    async play(){this.playCalls++;if(!this.src)throw Error('no source');this.paused=false;this.ended=false;this.currentTime+=0.25;return true}
    pause(){this.pauseCalls++;this.paused=true}
    load(){}
    removeAttribute(n){if(n==='src')this.src=''}
  }
  class InnerDoc extends Hub{
    constructor(){super();this.map=new Map();this.documentElement={dataset:{}};this.head=new El(this);this.body=new El(this);this.sideview=new El(this);this.sideview.className='sideview';this.cross={value:'50',dispatchEvent(){}};for(const k of ['A','B']){const v=new MediaEl(this,k);v.id='vid'+k;const m=new MediaEl(this,'m'+k);m.id='master'+k;m.style.display='none';const t=new El(this);t.id='title'+k}}
    createElement(){return new El(this)}
    getElementById(id){if(id==='cross'||id==='videoCross')return this.cross;return this.map.get(id)||null}
    querySelector(sel){if(sel==='.browser .sideview')return this.sideview;return null}
    querySelectorAll(){return[]}
  }
  class CE{constructor(type,o={}){this.type=type;this.detail=o.detail}}
  class EV{constructor(type,o={}){this.type=type;Object.assign(this,o)}}

  const innerDoc=new InnerDoc();
  const innerWin=new Hub();innerWin.document=innerDoc;innerWin.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()+6000),0);
  const frame={contentDocument:innerDoc,contentWindow:innerWin,addEventListener(){}};
  const outerDoc=new Hub();outerDoc.documentElement={dataset:{}};outerDoc.head={appendChild(){}};outerDoc.body={appendChild(){}};
  const status={textContent:''};
  outerDoc.getElementById=id=>id==='console'?frame:id==='status'?status:null;
  outerDoc.querySelector=()=>null;outerDoc.querySelectorAll=()=>[];
  outerDoc.createElement=()=>({dataset:{},style:{},appendChild(){},querySelector(){return null},querySelectorAll(){return[]}});

  const spLoaded={A:false,B:false},spPlaying={A:false,B:false};
  let spPlayCalls=0,localLoads=0;
  const outerWin=new Hub();outerWin.requestAnimationFrame=innerWin.requestAnimationFrame;
  outerWin.AFDLocalDeckMeta={A:null,B:null};
  outerWin.AFDWindowsLoadState={cancel(){}};
  outerWin.AFDWindowsLoadItem=async(k,it)=>{localLoads++;const v=innerDoc.getElementById('vid'+k);v.src='afdmedia://media/local-'+localLoads;v.paused=true;v.ended=false;v.currentTime=0;v.readyState=4;outerWin.AFDLocalDeckMeta[k]={key:it.key||'',path:it.path||'',name:it.name||'Local',kind:it.kind||'music'};outerWin.dispatchEvent(new CE('afd-local-load',{detail:{deck:k,item:outerWin.AFDLocalDeckMeta[k]}}));return true};
  outerWin.AFDYouTubeState={
    // Deliberately stale: reproduces the persistent hidden YouTube player that caused Local to lose deck ownership.
    isLoaded:()=>true,isPlaying:()=>false,getTime:()=>({current:0,duration:180,blocked:false}),
    stop(){return true},pause(){return true},clear(){},applyCross(){},load:async()=>true,playNow:async()=>true
  };
  outerWin.AFDSpotifyState={
    has:k=>spLoaded[k],isPlaying:k=>spPlaying[k],
    async playNow(k){spPlayCalls++;spPlaying[k]=true;return true},
    async pauseNow(k){spPlaying[k]=false;return true},async stopNow(k){spPlaying[k]=false;return true},
    clear(k){spLoaded[k]=false;spPlaying[k]=false},applyCross(){},setLevel(){}
  };
  outerWin.addEventListener('afd-spotify-load',e=>{const k=e.detail?.deck;if(k){spLoaded[k]=true;spPlaying[k]=false}});

  const localStorage={getItem(){return null},setItem(){}};
  const ctx={window:outerWin,document:outerDoc,localStorage,performance,console,setTimeout,clearTimeout,setInterval:()=>0,clearInterval(){},queueMicrotask,MutationObserver:class{observe(){}disconnect(){}},CustomEvent:CE,Event:EV,URL,Math,Date,JSON,Promise,Intl};
  vm.runInNewContext(r215,ctx,{filename:'runtime-v215-v227.js'});
  ok(outerWin.__afd215,'runtime215 must initialize');

  async function verifyLocalDirect(k,label){
    const v=innerDoc.getElementById('vid'+k),before=v.playCalls;
    const item={key:'local-'+label,path:'C:/Music/'+label+'.mp3',name:'Local '+label,folder:'Local',kind:'music'};
    eq(await outerWin.__afd215.loadDeck(k,item),true,label+' Local load must succeed');
    eq(outerWin.__afd215.getOwner(k),'local',label+' Local must own deck even with stale YouTube state');
    eq(await outerWin.__afd215.startDeck(k),true,label+' Local PLAY must succeed');
    ok(v.playCalls>before,label+' must call media.play()');
    eq(v.paused,false,label+' must remain playing');
    ok(v.currentTime>0,label+' playback time must advance');
    eq(await outerWin.__afd215.toggleDeck(k),true,label+' pause must succeed');
    eq(v.paused,true,label+' must pause');
    eq(await outerWin.__afd215.toggleDeck(k),true,label+' resume must succeed');
    eq(v.paused,false,label+' must resume');
  }

  // Repeat the realistic Local path on both decks several times, rather than relying on a single lucky pass.
  for(const label of ['A-first','B-first','A-repeat','B-repeat','A-after-online','B-after-online']){
    await verifyLocalDirect(label.startsWith('A')?'A':'B',label);
  }

  // Manual deck PLAY click after Local load.
  const va=innerDoc.getElementById('vidA');va.pause();
  const btn={dataset:{d:'A',act:'play'},closest(sel){return sel==='[data-act]'?this:null}};
  innerWin.dispatch('click',{target:btn,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
  await wait(50);
  eq(va.paused,false,'manual Deck A PLAY click must start Local media');
  eq(outerWin.__afd215.getOwner('A'),'local','manual Local PLAY must keep Local ownership');

  // Spotify -> Local -> Spotify transitions on both decks. This catches ownership contamination in both directions.
  for(const k of ['A','B']){
    eq(await outerWin.__afd215.loadDeck(k,{afdSpotifyItem:{id:'sp-'+k,uri:'spotify:track:'+k,name:'Spotify '+k},name:'Spotify '+k}),true,'Spotify load '+k+' must succeed');
    eq(outerWin.__afd215.getOwner(k),'spotify','Spotify must own deck '+k);
    eq(await outerWin.__afd215.startDeck(k),true,'Spotify PLAY '+k+' must succeed');
    eq(spPlaying[k],true,'Spotify must be playing '+k);
    await verifyLocalDirect(k,'Local-after-Spotify-'+k);
    eq(spLoaded[k],false,'Local replacement must clear Spotify '+k);
    eq(await outerWin.__afd215.loadDeck(k,{afdSpotifyItem:{id:'sp2-'+k,uri:'spotify:track:2'+k,name:'Spotify 2 '+k},name:'Spotify 2 '+k}),true,'Spotify reload '+k+' must succeed');
    eq(outerWin.__afd215.getOwner(k),'spotify','Spotify must regain ownership '+k);
  }
  ok(spPlayCalls>=2,'Spotify play bridge must remain active');

  // Exact Side View Local dblclick path: runtime206 unified loader + delegated runtime215 startDeck.
  for(const k of ['A','B']){const v=innerDoc.getElementById('vid'+k);v.pause();v.removeAttribute('src');outerWin.AFDLocalDeckMeta[k]=null;spLoaded[k]=false;spPlaying[k]=false}
  let r206=p226('runtime-v206.js',fs.readFileSync('runtime-v206.js','utf8'));
  r206=r206.replace("async function startDeck(k){","async function startDeck(k){if(window.__afd215?.startDeck)return window.__afd215.startDeck(k);");
  vm.runInNewContext(r206,ctx,{filename:'runtime-v206-v227.js'});
  ok(outerWin.__afdCore206,'runtime206 must initialize for Side View Local test');
  let r212=p226('runtime-v212.js',fs.readFileSync('runtime-v212.js','utf8'));
  r212=r212.replace("function bindTransport(){","function bindTransport(){return;");
  vm.runInNewContext(r212,ctx,{filename:'runtime-v212-v227.js'});
  ok(outerWin.__afd212,'runtime212 must initialize for Side View Local test');

  for(let pass=0;pass<4;pass++){
    const idx=outerWin.__afdCore206.queue.length;
    outerWin.__afdCore206.addQueue({key:'side-local-'+pass,path:'C:/Music/SideLocal-'+pass+'.mp3',name:'Side Local '+pass,folder:'Local',kind:'music'},false);
    const row={dataset:{i:String(idx)}};
    const target={closest(sel){if(sel==='#afd212side .s212row')return row;if(sel==='button')return null;return null}};
    innerWin.dispatch('dblclick',{target,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
    await wait(130);
    const sidePlaying=['A','B'].some(k=>{const v=innerDoc.getElementById('vid'+k);return!!v.src&&!v.paused&&v.currentTime>0&&outerWin.__afd215.getOwner(k)==='local'});
    ok(sidePlaying,'Side View Local double-click pass '+pass+' must load and auto-PLAY a Local deck');
  }

  console.log(`AFD v1.5.27 Local/all-source regression passed: ${checks} assertions across repeated direct Local PLAY, manual transport, Spotify↔Local transitions, stale YouTube ownership, and repeated Side View Local double-click autoplay.`);
})().catch(e=>{console.error(e);process.exit(1)});
