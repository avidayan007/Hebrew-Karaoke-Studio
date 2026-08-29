(()=>{
  const byId=id=>document.getElementById(id);
  const frame=()=>byId('console');
  const cdoc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let yt={A:null,B:null}, lastItems=[], viewMode='list';
  let bc=null;try{bc=new BroadcastChannel('afd-dj-video')}catch(e){}

  function apiKey(){
    const live=(byId('ytKey')?.value||'').trim();
    if(live)return live;
    try{return (localStorage.getItem('afdYT')||'').trim()}catch(e){return ''}
  }

  function injectStyles(){
    if(byId('afdYTExpandedStyle'))return;
    const s=document.createElement('style');
    s.id='afdYTExpandedStyle';
    s.textContent=`
      #online.afdYTExpanded{display:grid!important;grid-template-columns:1fr!important;padding:8px!important;overflow:hidden!important}
      #online.afdYTExpanded>.card{display:none!important}
      #online.afdYTExpanded>.card.afdYTMainCard{display:flex!important;width:100%!important;height:100%!important;min-height:0!important;padding:10px!important}
      .view.afdYTViewExpanded{height:430px!important;overflow:hidden!important}
      .afdYTTopBar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:3px}
      .afdYTTopBar button{height:30px!important;padding:0 10px!important;font-size:9px!important}
      .afdYTGrow{flex:1}
      #afdYTInlineResults{flex:1;min-height:0;max-height:none!important;overflow:auto!important;margin-top:6px!important}
      #afdYTInlineResults.afdCards{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:7px;padding:7px!important;align-content:start}
      .afdYTListRow{display:grid;grid-template-columns:92px minmax(0,1fr) 48px 48px;gap:8px;align-items:center;padding:7px;border-bottom:1px solid #20262d}
      .afdYTListRow img{width:92px;height:54px;object-fit:cover;border-radius:4px}
      .afdYTListRow b{display:block;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .afdYTListRow span{color:#8d98a5;font-size:9px}
      .afdYTCardItem{display:grid;grid-template-rows:115px minmax(42px,auto) 32px;gap:5px;padding:7px;border:1px solid #29313b;border-radius:6px;background:#090c11}
      .afdYTCardItem img{width:100%;height:115px;object-fit:cover;border-radius:4px}
      .afdYTCardItem b{font-size:10px;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .afdYTCardBtns{display:grid;grid-template-columns:1fr 1fr;gap:5px}
      .afdYTDeckBtn{height:30px!important;border-radius:4px!important;font-weight:900!important;color:#fff!important}
      .afdYTA{border:1px solid #7356a0!important;background:#382153!important}
      .afdYTB{border:1px solid #287fae!important;background:#123f5a!important}
      @media(max-width:800px){.view.afdYTViewExpanded{height:380px!important}.afdYTListRow{grid-template-columns:72px minmax(0,1fr) 42px 42px}.afdYTListRow img{width:72px;height:43px}#afdYTInlineResults.afdCards{grid-template-columns:repeat(auto-fill,minmax(165px,1fr))}.afdYTCardItem{grid-template-rows:92px minmax(40px,auto) 32px}.afdYTCardItem img{height:92px}}
    `;
    document.head.appendChild(s);
  }

  function onlineCard(){
    const btn=byId('ytBtn');
    return btn?.closest('.card')||null;
  }

  function expandYouTube(){
    injectStyles();
    const online=byId('online'),card=onlineCard(),view=online?.closest('.view');
    if(!online||!card)return;
    card.classList.add('afdYTMainCard');
    online.classList.add('afdYTExpanded');
    view?.classList.add('afdYTViewExpanded');
    ensureTopBar();
  }

  function restoreServices(){
    const online=byId('online'),card=onlineCard(),view=online?.closest('.view');
    online?.classList.remove('afdYTExpanded');
    card?.classList.remove('afdYTMainCard');
    view?.classList.remove('afdYTViewExpanded');
  }

  function ensureTopBar(){
    const card=onlineCard(); if(!card)return;
    let bar=byId('afdYTTopBar');
    if(!bar){
      bar=document.createElement('div');
      bar.id='afdYTTopBar';
      bar.className='afdYTTopBar';
      bar.innerHTML='<button id="afdYTListBtn">☰ רשימה</button><button id="afdYTCardsBtn">▦ כרטיסים</button><span class="afdYTGrow"></span><button id="afdYTBackBtn">← חזור לכל השירותים</button>';
      const btn=byId('ytBtn'); btn?.insertAdjacentElement('afterend',bar);
      byId('afdYTListBtn').onclick=()=>{viewMode='list';render(lastItems)};
      byId('afdYTCardsBtn').onclick=()=>{viewMode='cards';render(lastItems)};
      byId('afdYTBackBtn').onclick=restoreServices;
    }
  }

  function ensureUI(){
    injectStyles();
    const btn=byId('ytBtn');
    if(!btn)return null;
    const card=btn.closest('.card');
    if(!card)return null;
    let box=byId('afdYTInlineResults');
    if(!box){
      box=document.createElement('div');
      box.id='afdYTInlineResults';
      box.style.cssText='margin-top:4px;min-height:42px;max-height:210px;overflow:auto;border:1px solid #313944;border-radius:5px;background:#05070a;padding:5px;font-size:9px;color:#dce3eb';
      box.innerHTML='<div style="padding:10px;text-align:center;color:#8994a0">כתוב שם שיר ולחץ חיפוש YouTube</div>';
      card.appendChild(box);
    }
    return box;
  }

  function ytUrl(id,opts={}){
    const p=new URLSearchParams({autoplay:'1',playsinline:'1',rel:'0',enablejsapi:'1',origin:location.origin});
    if(opts.controls===false)p.set('controls','0');
    if(opts.mute)p.set('mute','1');
    return 'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?'+p.toString();
  }

  function command(deck,func,args=[],master=false){
    const d=cdoc(); if(!d)return;
    const f=d.getElementById((master?'ytMaster':'ytDeck')+deck);
    try{f?.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'*')}catch(e){}
  }

  function styleFrame(f,z){Object.assign(f.style,{position:'absolute',inset:'0',width:'100%',height:'100%',border:'0',background:'#000',zIndex:String(z)})}

  function addDeck(deck,item){
    const d=cdoc(); if(!d)return false;
    const video=d.getElementById('vid'+deck),screen=video?.parentElement;
    if(!screen)return false;
    screen.style.position='relative';
    d.getElementById('ytDeck'+deck)?.remove();
    const f=d.createElement('iframe'); f.id='ytDeck'+deck; styleFrame(f,20);
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen'; f.setAttribute('playsinline',''); f.src=ytUrl(item.id); screen.appendChild(f);
    if(video)video.style.display='none';
    const post=d.getElementById('post'+deck); if(post)post.style.display='none';
    const title=d.getElementById('title'+deck); if(title)title.textContent=item.title;
    return true;
  }

  function addMaster(deck,item){
    const d=cdoc(); if(!d)return;
    const screen=d.querySelector('.masterScreen'); if(!screen)return;
    screen.style.position='relative'; d.getElementById('ytMaster'+deck)?.remove();
    const f=d.createElement('iframe'); f.id='ytMaster'+deck; styleFrame(f,15); f.style.pointerEvents='none';
    f.allow='autoplay; encrypted-media; picture-in-picture'; f.src=ytUrl(item.id,{controls:false,mute:true}); screen.appendChild(f);
    const logo=d.getElementById('masterLogo'); if(logo)logo.style.display='none';
  }

  function mix(){
    const d=cdoc(); if(!d)return;
    const x=+(d.getElementById('cross')?.value||50)/100,gA=+(d.getElementById('gainA')?.value||100)/100,gB=+(d.getElementById('gainB')?.value||100)/100;
    command('A','setVolume',[Math.round(Math.cos(x*Math.PI/2)*100*gA)]); command('B','setVolume',[Math.round(Math.sin(x*Math.PI/2)*100*gB)]);
    const a=d.getElementById('ytMasterA'),b=d.getElementById('ytMasterB'); if(a)a.style.opacity=String(1-x); if(b)b.style.opacity=String(x);
    try{bc?.postMessage({type:'mix',value:x})}catch(e){}
  }

  function load(deck,item){
    if(!addDeck(deck,item)){const box=ensureUI();if(box)box.innerHTML='<div style="padding:10px;color:#ff9f9f">Deck '+deck+' עדיין לא מוכן.</div>';return}
    yt[deck]={...item,playing:true}; addMaster(deck,item);
    setTimeout(()=>{mix();command(deck,'playVideo');command(deck,'playVideo',[],true)},700);
    const status=byId('status'); if(status)status.textContent='YouTube loaded → Deck '+deck;
    try{bc?.postMessage({type:'youtube-load',deck,videoId:item.id,title:item.title})}catch(e){}
  }

  function render(items){
    lastItems=items||[];
    const box=ensureUI(); if(!box)return;
    box.classList.toggle('afdCards',viewMode==='cards');
    if(!lastItems.length){box.innerHTML='<div style="padding:14px;text-align:center">לא נמצאו תוצאות.</div>';return}
    if(viewMode==='cards'){
      box.innerHTML=lastItems.map((x,i)=>'<div class="afdYTCardItem" data-i="'+i+'"><img src="'+esc(x.thumb)+'"><div><b>'+esc(x.title)+'</b><span style="color:#8d98a5;font-size:9px">'+esc(x.channel)+'</span></div><div class="afdYTCardBtns"><button class="afdYTDeckBtn afdYTA" data-d="A">LOAD A</button><button class="afdYTDeckBtn afdYTB" data-d="B">LOAD B</button></div></div>').join('');
    }else{
      box.innerHTML=lastItems.map((x,i)=>'<div class="afdYTListRow" data-i="'+i+'"><img src="'+esc(x.thumb)+'"><div style="min-width:0"><b>'+esc(x.title)+'</b><span>'+esc(x.channel)+'</span></div><button class="afdYTDeckBtn afdYTA" data-d="A">A</button><button class="afdYTDeckBtn afdYTB" data-d="B">B</button></div>').join('');
    }
    box.querySelectorAll('[data-i]').forEach(row=>{const item=lastItems[+row.dataset.i];row.querySelectorAll('[data-d]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();load(b.dataset.d,item)})});
  }

  async function searchNow(){
    const box=ensureUI(); if(!box)return;
    expandYouTube();
    const q=(byId('ytSearch')?.value||'').trim();
    if(!q){box.innerHTML='<div style="padding:14px;text-align:center;color:#ffd36a">כתוב שם של שיר או אמן.</div>';return}
    const key=apiKey();
    if(!key){box.innerHTML='<div style="padding:14px;text-align:center;color:#ffd36a"><b>חסר YouTube API Key</b><br>פתח SETTINGS, הדבק את המפתח ולחץ שמור.</div>';return}
    box.classList.remove('afdCards'); box.innerHTML='<div style="padding:18px;text-align:center">מחפש ב‑YouTube...</div>';
    const status=byId('status'); if(status)status.textContent='YouTube search...';
    try{
      const u='https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&safeSearch=moderate&q='+encodeURIComponent(q)+'&key='+encodeURIComponent(key);
      const r=await fetch(u,{cache:'no-store'}),j=await r.json();
      if(!r.ok)throw new Error(j?.error?.message||('YouTube API HTTP '+r.status));
      const items=(j.items||[]).map(x=>({id:x.id?.videoId||'',title:x.snippet?.title||'YouTube',channel:x.snippet?.channelTitle||'',thumb:x.snippet?.thumbnails?.medium?.url||x.snippet?.thumbnails?.default?.url||''})).filter(x=>x.id);
      render(items); if(status)status.textContent='YouTube: '+items.length+' results';
    }catch(e){box.innerHTML='<div style="padding:14px;text-align:center;color:#ff9f9f"><b>שגיאת YouTube API</b><br>'+esc(e.message)+'</div>';if(status)status.textContent='YouTube search error'}
  }

  function bind(){
    ensureUI(); ensureTopBar();
    const btn=byId('ytBtn'); if(btn)btn.onclick=e=>{e.preventDefault();e.stopPropagation();searchNow()};
    const input=byId('ytSearch'); if(input)input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();searchNow()}};
    const d=cdoc(); ['cross','gainA','gainB'].forEach(id=>d?.getElementById(id)?.addEventListener('input',mix));
  }

  window.AFDOpenYT=searchNow;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
  frame()?.addEventListener('load',()=>setTimeout(bind,100)); setTimeout(bind,400);
})();