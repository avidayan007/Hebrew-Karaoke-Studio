(()=>{
  const $=id=>document.getElementById(id);
  const frame=()=>$('console');
  const cdoc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let yt={A:null,B:null},lastItems=[],viewMode='list',itemScale=1;
  let bc=null,audioCtx=null;
  const eqNodes={A:null,B:null};
  try{bc=new BroadcastChannel('afd-dj-video')}catch(e){}

  function apiKey(){const live=($('ytKey')?.value||'').trim();if(live)return live;try{return(localStorage.getItem('afdYT')||'').trim()}catch(e){return''}}

  function injectParentStyles(){
    if($('afdYTExpandedStyle'))return;
    const s=document.createElement('style');s.id='afdYTExpandedStyle';s.textContent=`
      body.afdYTFocus .toolbar,body.afdYTFocus .tabs,body.afdYTFocus .tools{display:none!important}
      body.afdYTFocus .dock{padding:6px!important;border-top:1px solid #3d4652!important}
      body.afdYTFocus .view{margin-top:0!important}
      #online.afdYTExpanded{display:grid!important;grid-template-columns:1fr!important;padding:8px!important;overflow:hidden!important}
      #online.afdYTExpanded>.card{display:none!important}
      #online.afdYTExpanded>.card.afdYTMainCard{display:flex!important;width:100%!important;height:100%!important;min-height:0!important;padding:10px!important}
      .view.afdYTViewExpanded{height:min(650px,66vh)!important;min-height:430px!important;overflow:hidden!important}
      .afdYTTopBar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:3px}
      .afdYTTopBar button{height:30px!important;padding:0 10px!important;font-size:9px!important}
      .afdYTGrow{flex:1}.afdYTSizeLabel{font-size:9px;color:#b6c0cb;min-width:42px;text-align:center}
      #afdYTInlineResults{flex:1;min-height:0;max-height:none!important;overflow:auto!important;margin-top:6px!important}
      #afdYTInlineResults.afdCards{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--yt-card-min,220px),1fr));gap:8px;padding:8px!important;align-content:start}
      .afdYTListRow{display:grid;grid-template-columns:var(--yt-list-img-w,58px) minmax(0,1fr) 52px 52px;gap:10px;align-items:center;padding:var(--yt-row-pad,8px);border-bottom:1px solid #20262d;min-height:var(--yt-row-h,66px)}
      .afdYTListRow img{width:var(--yt-list-img-w,58px);height:var(--yt-list-img-h,34px);object-fit:cover;border-radius:4px}
      .afdYTListRow b{display:block;font-size:var(--yt-title-size,14px);line-height:1.3;white-space:normal}
      .afdYTListRow span{color:#aab4c0;font-size:var(--yt-meta-size,11px)}
      .afdYTCardItem{display:grid;grid-template-rows:var(--yt-card-img-h,82px) minmax(58px,auto) 34px;gap:6px;padding:var(--yt-card-pad,8px);border:1px solid #29313b;border-radius:6px;background:#090c11}
      .afdYTCardItem img{width:100%;height:var(--yt-card-img-h,82px);object-fit:cover;border-radius:4px}
      .afdYTCardItem b{font-size:var(--yt-title-size,14px);line-height:1.25;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .afdYTCardItem span{font-size:var(--yt-meta-size,11px)!important}
      .afdYTCardBtns{display:grid;grid-template-columns:1fr 1fr;gap:5px}.afdYTDeckBtn{height:32px!important;border-radius:4px!important;font-weight:900!important;color:#fff!important}
      .afdYTA{border:1px solid #7356a0!important;background:#382153!important}.afdYTB{border:1px solid #287fae!important;background:#123f5a!important}
      @media(max-width:800px){.view.afdYTViewExpanded{height:min(590px,68vh)!important;min-height:390px!important}.afdYTTopBar button{padding:0 8px!important}}
    `;document.head.appendChild(s);applyScale();
  }

  function applyScale(){
    const r=document.documentElement,s=itemScale;
    r.style.setProperty('--yt-list-img-w',Math.round(58*s)+'px');r.style.setProperty('--yt-list-img-h',Math.round(34*s)+'px');
    r.style.setProperty('--yt-row-h',Math.round(66*s)+'px');r.style.setProperty('--yt-row-pad',Math.max(5,Math.round(8*s))+'px');
    r.style.setProperty('--yt-title-size',Math.max(11,Math.round(14*s))+'px');r.style.setProperty('--yt-meta-size',Math.max(9,Math.round(11*s))+'px');
    r.style.setProperty('--yt-card-min',Math.round(220*s)+'px');r.style.setProperty('--yt-card-img-h',Math.round(82*s)+'px');r.style.setProperty('--yt-card-pad',Math.max(5,Math.round(8*s))+'px');
    const l=$('afdYTSizeLabel');if(l)l.textContent=Math.round(s*100)+'%';
  }

  function ensurePermanentMixer(){
    const d=cdoc();if(!d)return;
    if(!d.getElementById('afdPermanentMixerStyle')){
      const st=d.createElement('style');st.id='afdPermanentMixerStyle';st.textContent=`
        .eq{display:flex!important;flex-direction:row!important;justify-content:center!important;align-items:stretch!important;gap:3px!important;padding:3px 1px!important}
        .eq .knobWrap{display:none!important}
        .afdEqSlider{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:2px}
        .afdEqSlider b{font-size:5.5px;color:#aab5c1;letter-spacing:.2px;writing-mode:vertical-rl;transform:rotate(180deg);height:34px;line-height:1}
        .afdEqSlider input[type=range]{appearance:none;-webkit-appearance:none;writing-mode:vertical-lr;direction:rtl;width:15px;height:152px;margin:0;padding:0;background:transparent;accent-color:#9a5fff}
        .deckB .afdEqSlider input[type=range]{accent-color:#2aa9ff}
        .afdEqSlider input[type=range]::-webkit-slider-runnable-track{width:4px;background:linear-gradient(#89919a,#252a30);border-radius:4px;box-shadow:inset 0 0 2px #000}
        .afdEqSlider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:10px;margin-left:-6px;border-radius:2px;border:1px solid #b9c0c8;background:linear-gradient(#e3e6e9,#666d75 45%,#20242a);box-shadow:0 1px 3px #000}
        .afdEqSlider small{font-size:5.5px;color:#7f8a96;height:11px}
        .fader{position:relative;display:flex!important;flex-direction:column!important;align-items:center!important;gap:4px!important;margin-top:6px!important}
        .fader:before{content:'VOLUME';font-size:7px;color:#aab4c0;font-weight:800;letter-spacing:.5px}
        .fader input[type=range]{appearance:none;-webkit-appearance:none;writing-mode:vertical-lr!important;direction:rtl!important;width:26px!important;height:132px!important;accent-color:#9b5fff}
        .channel:last-child .fader input[type=range]{accent-color:#2aa9ff}
      `;d.head.appendChild(st);
    }
    ['A','B'].forEach(deck=>{
      const panel=d.getElementById('vid'+deck)?.closest('.panel');if(!panel)return;
      const eq=panel.querySelector('.eq');
      if(eq&&!d.getElementById('afdEqBass'+deck)){
        eq.insertAdjacentHTML('beforeend',
          '<label class="afdEqSlider"><b>BASS</b><input id="afdEqBass'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqBassTxt'+deck+'">0</small></label>'+ 
          '<label class="afdEqSlider"><b>MID</b><input id="afdEqMid'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqMidTxt'+deck+'">0</small></label>'+ 
          '<label class="afdEqSlider"><b>TREBLE</b><input id="afdEqTreble'+deck+'" type="range" min="-12" max="12" step="1" value="0"><small id="afdEqTrebleTxt'+deck+'">0</small></label>');
        ['Bass','Mid','Treble'].forEach(k=>{
          const el=d.getElementById('afdEq'+k+deck);if(!el)return;
          el.oninput=e=>{const v=+e.target.value;d.getElementById('afdEq'+k+'Txt'+deck).textContent=(v>0?'+':'')+v;applyLocalEq(deck)};
        });
      }
      const gain=d.getElementById('gain'+deck);
      if(gain){
        gain.min=0;gain.max=100;if(!gain.value)gain.value=100;
        gain.addEventListener('input',()=>mix());
      }
      const media=d.getElementById('vid'+deck);
      if(media&&!media.dataset.afdEqBound){media.dataset.afdEqBound='1';media.addEventListener('loadedmetadata',()=>{if(!yt[deck]){enableEq(deck,true);setTimeout(()=>analyzeLocalBpm(deck),200)}})}
    });
  }

  function enableEq(deck,on){const d=cdoc();if(!d)return;['Bass','Mid','Treble'].forEach(k=>{const e=d.getElementById('afdEq'+k+deck);if(e)e.disabled=!on})}

  function setupLocalEq(deck){
    const d=cdoc(),m=d?.getElementById('vid'+deck);if(!m||yt[deck])return null;if(eqNodes[deck])return eqNodes[deck];
    try{
      audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
      const src=audioCtx.createMediaElementSource(m),low=audioCtx.createBiquadFilter(),mid=audioCtx.createBiquadFilter(),high=audioCtx.createBiquadFilter();
      low.type='lowshelf';low.frequency.value=180;mid.type='peaking';mid.frequency.value=1200;mid.Q.value=.8;high.type='highshelf';high.frequency.value=6000;
      src.connect(low).connect(mid).connect(high).connect(audioCtx.destination);eqNodes[deck]={src,low,mid,high};return eqNodes[deck];
    }catch(e){return null}
  }

  function applyLocalEq(deck){
    const d=cdoc();if(!d||yt[deck])return;const n=setupLocalEq(deck);if(!n){enableEq(deck,false);return}
    n.low.gain.value=+(d.getElementById('afdEqBass'+deck)?.value||0);n.mid.gain.value=+(d.getElementById('afdEqMid'+deck)?.value||0);n.high.gain.value=+(d.getElementById('afdEqTreble'+deck)?.value||0);
  }

  function setBpm(deck,val,note=''){
    const d=cdoc();if(!d)return;const el=d.getElementById('bpm'+deck);if(el)el.textContent=val||'—';
    let n=d.getElementById('afdBpmNote'+deck);if(!n){const p=d.getElementById('vid'+deck)?.closest('.panel');if(p){n=d.createElement('div');n.id='afdBpmNote'+deck;n.style.cssText='font-size:7px;color:#87929f;text-align:center;margin-top:2px';p.appendChild(n)}}if(n)n.textContent=note;
  }

  async function analyzeLocalBpm(deck){
    if(yt[deck]){setBpm(deck,'—','YouTube: BPM אוטומטי לא זמין');return}
    const d=cdoc(),m=d?.getElementById('vid'+deck);if(!m?.src)return;
    setBpm(deck,'…','מנתח BPM...');
    try{
      const ab=await fetch(m.src).then(r=>r.arrayBuffer());audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const buf=await audioCtx.decodeAudioData(ab.slice(0));
      const ch=buf.getChannelData(0),sr=buf.sampleRate,step=1024,max=Math.min(ch.length,sr*90),env=[];
      for(let i=0;i<max;i+=step){let e=0;for(let j=i;j<Math.min(i+step,max);j++)e+=Math.abs(ch[j]);env.push(e/step)}
      const lo=Math.floor(60*step*env.length/(sr*200)),hi=Math.ceil(60*step*env.length/(sr*70));let bestLag=0,best=-Infinity;
      for(let lag=Math.max(1,lo);lag<=Math.min(hi,env.length-2);lag++){let c=0;for(let i=lag;i<env.length;i++)c+=env[i]*env[i-lag];if(c>best){best=c;bestLag=lag}}
      let bpm=bestLag?60*sr/(step*bestLag):0;while(bpm<70&&bpm>0)bpm*=2;while(bpm>200)bpm/=2;
      setBpm(deck,bpm?bpm.toFixed(1):'—',bpm?'BPM אוטומטי':'BPM לא זוהה');
    }catch(e){setBpm(deck,'—','BPM לא זוהה')}
  }

  function onlineCard(){return $('ytBtn')?.closest('.card')||null}
  function ensureUI(){injectParentStyles();const btn=$('ytBtn');if(!btn)return null;const card=btn.closest('.card');if(!card)return null;let box=$('afdYTInlineResults');if(!box){box=document.createElement('div');box.id='afdYTInlineResults';box.style.cssText='margin-top:4px;min-height:42px;max-height:210px;overflow:auto;border:1px solid #313944;border-radius:5px;background:#05070a;padding:5px;font-size:10px;color:#dce3eb';box.innerHTML='<div style="padding:10px;text-align:center;color:#8994a0">כתוב שם שיר ולחץ חיפוש YouTube</div>';card.appendChild(box)}return box}

  function focusConsole(on){const d=cdoc(),f=frame();if(!d||!f)return;let st=d.getElementById('afdYTFocusStyle');if(on){if(!st){st=d.createElement('style');st.id='afdYTFocusStyle';st.textContent='.browser{display:none!important}.app{padding-bottom:0!important}';d.head.appendChild(st)}requestAnimationFrame(()=>{const con=d.querySelector('.console'),app=d.querySelector('.app');const h=Math.ceil((con?.getBoundingClientRect().bottom||app?.scrollHeight||650)+12);f.style.height=Math.max(560,h)+'px'})}else{st?.remove();f.style.height=''}}
  function enterYouTubeMode(){injectParentStyles();document.body.classList.add('afdYTFocus');const online=$('online'),card=onlineCard(),view=online?.closest('.view');if(!online||!card)return;card.classList.add('afdYTMainCard');online.classList.add('afdYTExpanded');view?.classList.add('afdYTViewExpanded');ensureTopBar();focusConsole(true)}
  function restoreServices(){const online=$('online'),card=onlineCard(),view=online?.closest('.view');online?.classList.remove('afdYTExpanded');card?.classList.remove('afdYTMainCard');view?.classList.remove('afdYTViewExpanded');document.body.classList.remove('afdYTFocus');focusConsole(false)}

  function ensureTopBar(){const card=onlineCard();if(!card)return;if($('afdYTTopBar'))return;const bar=document.createElement('div');bar.id='afdYTTopBar';bar.className='afdYTTopBar';bar.innerHTML='<button id="afdYTListBtn">☰ רשימה</button><button id="afdYTCardsBtn">▦ כרטיסים</button><button id="afdYTMinus">− קטן</button><span id="afdYTSizeLabel" class="afdYTSizeLabel">100%</span><button id="afdYTPlus">＋ גדול</button><span class="afdYTGrow"></span><button id="afdYTBackBtn">← חזור לממשק הרגיל</button>';$('ytBtn')?.insertAdjacentElement('afterend',bar);$('afdYTListBtn').onclick=()=>{viewMode='list';render(lastItems)};$('afdYTCardsBtn').onclick=()=>{viewMode='cards';render(lastItems)};$('afdYTMinus').onclick=()=>{itemScale=Math.max(.65,+(itemScale-.1).toFixed(2));applyScale();render(lastItems)};$('afdYTPlus').onclick=()=>{itemScale=Math.min(1.7,+(itemScale+.1).toFixed(2));applyScale();render(lastItems)};$('afdYTBackBtn').onclick=restoreServices;applyScale()}

  function ytUrl(id,o={}){const p=new URLSearchParams({autoplay:'1',playsinline:'1',rel:'0',enablejsapi:'1',origin:location.origin});if(o.controls===false)p.set('controls','0');if(o.mute)p.set('mute','1');return'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?'+p.toString()}
  function command(deck,func,args=[],master=false){const d=cdoc();if(!d)return;const f=d.getElementById((master?'ytMaster':'ytDeck')+deck);try{f?.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'*')}catch(e){}}
  function styleFrame(f,z){Object.assign(f.style,{position:'absolute',inset:'0',width:'100%',height:'100%',border:'0',background:'#000',zIndex:String(z)})}

  function addDeck(deck,item){const d=cdoc();if(!d)return false;const video=d.getElementById('vid'+deck),screen=video?.parentElement;if(!screen)return false;screen.style.position='relative';d.getElementById('ytDeck'+deck)?.remove();const f=d.createElement('iframe');f.id='ytDeck'+deck;styleFrame(f,20);f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.setAttribute('playsinline','');f.src=ytUrl(item.id);screen.appendChild(f);if(video)video.style.display='none';const post=d.getElementById('post'+deck);if(post)post.style.display='none';const title=d.getElementById('title'+deck);if(title)title.textContent=item.title;yt[deck]={...item,playing:true};enableEq(deck,false);setBpm(deck,'—','YouTube: BPM/EQ לא זמינים מהזרם הרשמי');return true}
  function addMaster(deck,item){const d=cdoc();if(!d)return;const screen=d.querySelector('.masterScreen');if(!screen)return;screen.style.position='relative';d.getElementById('ytMaster'+deck)?.remove();const f=d.createElement('iframe');f.id='ytMaster'+deck;styleFrame(f,15);f.style.pointerEvents='none';f.allow='autoplay; encrypted-media; picture-in-picture';f.src=ytUrl(item.id,{controls:false,mute:true});screen.appendChild(f);const logo=d.getElementById('masterLogo');if(logo)logo.style.display='none'}

  function mix(){const d=cdoc();if(!d)return;const x=+(d.getElementById('cross')?.value||50)/100,gA=+(d.getElementById('gainA')?.value||100)/100,gB=+(d.getElementById('gainB')?.value||100)/100;command('A','setVolume',[Math.round(Math.cos(x*Math.PI/2)*100*gA)]);command('B','setVolume',[Math.round(Math.sin(x*Math.PI/2)*100*gB)]);const a=d.getElementById('ytMasterA'),b=d.getElementById('ytMasterB');if(a)a.style.opacity=String(1-x);if(b)b.style.opacity=String(x);try{bc?.postMessage({type:'mix',value:x})}catch(e){}}

  function load(deck,item){if(!addDeck(deck,item)){const box=ensureUI();if(box)box.innerHTML='<div style="padding:10px;color:#ff9f9f">Deck '+deck+' עדיין לא מוכן.</div>';return}addMaster(deck,item);setTimeout(()=>{mix();command(deck,'playVideo');command(deck,'playVideo',[],true)},700);const status=$('status');if(status)status.textContent='YouTube loaded → Deck '+deck;try{bc?.postMessage({type:'youtube-load',deck,videoId:item.id,title:item.title})}catch(e){}}

  function render(items){lastItems=items||[];const box=ensureUI();if(!box)return;box.classList.toggle('afdCards',viewMode==='cards');if(!lastItems.length){box.innerHTML='<div style="padding:14px;text-align:center">לא נמצאו תוצאות.</div>';return}if(viewMode==='cards'){box.innerHTML=lastItems.map((x,i)=>'<div class="afdYTCardItem" data-i="'+i+'"><img src="'+esc(x.thumb)+'"><div><b>'+esc(x.title)+'</b><span>'+esc(x.channel)+'</span></div><div class="afdYTCardBtns"><button class="afdYTDeckBtn afdYTA" data-d="A">LOAD A</button><button class="afdYTDeckBtn afdYTB" data-d="B">LOAD B</button></div></div>').join('')}else{box.innerHTML=lastItems.map((x,i)=>'<div class="afdYTListRow" data-i="'+i+'"><img src="'+esc(x.thumb)+'"><div style="min-width:0"><b>'+esc(x.title)+'</b><span>'+esc(x.channel)+'</span></div><button class="afdYTDeckBtn afdYTA" data-d="A">A</button><button class="afdYTDeckBtn afdYTB" data-d="B">B</button></div>').join('')}box.querySelectorAll('[data-i]').forEach(row=>{const item=lastItems[+row.dataset.i];row.querySelectorAll('[data-d]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();load(b.dataset.d,item)})})}

  async function searchNow(){const box=ensureUI();if(!box)return;enterYouTubeMode();const q=($('ytSearch')?.value||'').trim();if(!q){box.innerHTML='<div style="padding:14px;text-align:center;color:#ffd36a">כתוב שם של שיר או אמן.</div>';return}const key=apiKey();if(!key){box.innerHTML='<div style="padding:14px;text-align:center;color:#ffd36a"><b>חסר YouTube API Key</b><br>פתח SETTINGS, הדבק את המפתח ולחץ שמור.</div>';return}box.classList.remove('afdCards');box.innerHTML='<div style="padding:18px;text-align:center">מחפש ב‑YouTube...</div>';const status=$('status');if(status)status.textContent='YouTube search...';try{const u='https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&safeSearch=moderate&q='+encodeURIComponent(q)+'&key='+encodeURIComponent(key);const r=await fetch(u,{cache:'no-store'}),j=await r.json();if(!r.ok)throw new Error(j?.error?.message||('YouTube API HTTP '+r.status));const items=(j.items||[]).map(x=>({id:x.id?.videoId||'',title:x.snippet?.title||'YouTube',channel:x.snippet?.channelTitle||'',thumb:x.snippet?.thumbnails?.medium?.url||x.snippet?.thumbnails?.default?.url||''})).filter(x=>x.id);render(items);if(status)status.textContent='YouTube: '+items.length+' results'}catch(e){box.innerHTML='<div style="padding:14px;text-align:center;color:#ff9f9f"><b>שגיאת YouTube API</b><br>'+esc(e.message)+'</div>';if(status)status.textContent='YouTube search error'}}

  function hookDeckButtons(){const d=cdoc();if(!d||d.documentElement.dataset.afdYTButtons)return;d.documentElement.dataset.afdYTButtons='1';d.addEventListener('click',e=>{const b=e.target.closest?.('[data-act]');if(!b)return;const deck=b.dataset.d;if(!deck||!yt[deck])return;if(b.dataset.act==='play'){e.preventDefault();e.stopImmediatePropagation();yt[deck].playing=!yt[deck].playing;command(deck,yt[deck].playing?'playVideo':'pauseVideo');b.classList.toggle('on',yt[deck].playing)}else if(b.dataset.act==='cue'){e.preventDefault();e.stopImmediatePropagation();command(deck,'seekTo',[0,true]);command(deck,'pauseVideo');yt[deck].playing=false}},true)}

  function bind(){injectParentStyles();ensureUI();ensureTopBar();ensurePermanentMixer();hookDeckButtons();const btn=$('ytBtn');if(btn)btn.onclick=e=>{e.preventDefault();e.stopPropagation();searchNow()};const input=$('ytSearch');if(input)input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();searchNow()}};const d=cdoc();['cross','gainA','gainB'].forEach(id=>d?.getElementById(id)?.addEventListener('input',mix))}

  window.AFDOpenYT=searchNow;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
  frame()?.addEventListener('load',()=>setTimeout(bind,120));
  setTimeout(bind,500);
})();