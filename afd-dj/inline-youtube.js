(()=>{
  const byId=id=>document.getElementById(id);
  const frame=()=>byId('console');
  const cdoc=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let yt={A:null,B:null};
  let bc=null;try{bc=new BroadcastChannel('afd-dj-video')}catch(e){}

  function apiKey(){
    const live=(byId('ytKey')?.value||'').trim();
    if(live)return live;
    try{return (localStorage.getItem('afdYT')||'').trim()}catch(e){return ''}
  }

  function ensureUI(){
    const btn=byId('ytBtn');
    if(!btn)return null;
    const card=btn.closest('.card');
    if(!card)return null;
    const online=byId('online');
    if(online)online.style.overflow='auto';
    const view=card.closest('.view');
    if(view)view.style.overflow='auto';
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

  function styleFrame(f,z){
    Object.assign(f.style,{position:'absolute',inset:'0',width:'100%',height:'100%',border:'0',background:'#000',zIndex:String(z)});
  }

  function addDeck(deck,item){
    const d=cdoc(); if(!d)return false;
    const video=d.getElementById('vid'+deck);
    const screen=video?.parentElement;
    if(!screen)return false;
    screen.style.position='relative';
    d.getElementById('ytDeck'+deck)?.remove();
    const f=d.createElement('iframe');
    f.id='ytDeck'+deck; styleFrame(f,20);
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('playsinline','');
    f.src=ytUrl(item.id);
    screen.appendChild(f);
    if(video)video.style.display='none';
    const post=d.getElementById('post'+deck); if(post)post.style.display='none';
    const title=d.getElementById('title'+deck); if(title)title.textContent=item.title;
    return true;
  }

  function addMaster(deck,item){
    const d=cdoc(); if(!d)return;
    const screen=d.querySelector('.masterScreen'); if(!screen)return;
    screen.style.position='relative';
    d.getElementById('ytMaster'+deck)?.remove();
    const f=d.createElement('iframe');
    f.id='ytMaster'+deck; styleFrame(f,15); f.style.pointerEvents='none';
    f.allow='autoplay; encrypted-media; picture-in-picture';
    f.src=ytUrl(item.id,{controls:false,mute:true});
    screen.appendChild(f);
    const logo=d.getElementById('masterLogo'); if(logo)logo.style.display='none';
  }

  function mix(){
    const d=cdoc(); if(!d)return;
    const x=+(d.getElementById('cross')?.value||50)/100;
    const gA=+(d.getElementById('gainA')?.value||100)/100;
    const gB=+(d.getElementById('gainB')?.value||100)/100;
    command('A','setVolume',[Math.round(Math.cos(x*Math.PI/2)*100*gA)]);
    command('B','setVolume',[Math.round(Math.sin(x*Math.PI/2)*100*gB)]);
    const a=d.getElementById('ytMasterA'),b=d.getElementById('ytMasterB');
    if(a)a.style.opacity=String(1-x); if(b)b.style.opacity=String(x);
    try{bc?.postMessage({type:'mix',value:x})}catch(e){}
  }

  function load(deck,item){
    if(!addDeck(deck,item)){
      const box=ensureUI(); if(box)box.innerHTML='<div style="padding:10px;color:#ff9f9f">Deck '+deck+' עדיין לא מוכן.</div>';
      return;
    }
    yt[deck]={...item,playing:true};
    addMaster(deck,item);
    setTimeout(()=>{mix();command(deck,'playVideo');command(deck,'playVideo',[],true)},700);
    const status=byId('status'); if(status)status.textContent='YouTube loaded → Deck '+deck;
    try{bc?.postMessage({type:'youtube-load',deck,videoId:item.id,title:item.title})}catch(e){}
  }

  function render(items){
    const box=ensureUI(); if(!box)return;
    if(!items.length){box.innerHTML='<div style="padding:10px;text-align:center">לא נמצאו תוצאות.</div>';return}
    box.innerHTML=items.map((x,i)=>'<div data-i="'+i+'" style="display:grid;grid-template-columns:64px minmax(0,1fr) 38px 38px;gap:5px;align-items:center;padding:5px;border-bottom:1px solid #20262d"><img src="'+esc(x.thumb)+'" style="width:64px;height:38px;object-fit:cover;border-radius:3px"><div style="min-width:0"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.title)+'</b><span style="color:#8d98a5">'+esc(x.channel)+'</span></div><button data-d="A" style="height:28px;border:1px solid #7356a0;background:#382153;color:#fff;border-radius:4px;font-weight:900">A</button><button data-d="B" style="height:28px;border:1px solid #287fae;background:#123f5a;color:#fff;border-radius:4px;font-weight:900">B</button></div>').join('');
    box.querySelectorAll('[data-i]').forEach(row=>{
      const item=items[+row.dataset.i];
      row.querySelectorAll('[data-d]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();load(b.dataset.d,item)});
    });
  }

  async function searchNow(){
    const box=ensureUI(); if(!box)return;
    const q=(byId('ytSearch')?.value||'').trim();
    if(!q){box.innerHTML='<div style="padding:10px;text-align:center;color:#ffd36a">כתוב שם של שיר או אמן.</div>';return}
    const key=apiKey();
    if(!key){box.innerHTML='<div style="padding:10px;text-align:center;color:#ffd36a"><b>חסר YouTube API Key</b><br>פתח SETTINGS, הדבק את המפתח ולחץ שמור.</div>';return}
    box.innerHTML='<div style="padding:12px;text-align:center">מחפש ב‑YouTube...</div>';
    const status=byId('status'); if(status)status.textContent='YouTube search...';
    try{
      const u='https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15&safeSearch=moderate&q='+encodeURIComponent(q)+'&key='+encodeURIComponent(key);
      const r=await fetch(u,{cache:'no-store'});
      const j=await r.json();
      if(!r.ok)throw new Error(j?.error?.message||('YouTube API HTTP '+r.status));
      const items=(j.items||[]).map(x=>({id:x.id?.videoId||'',title:x.snippet?.title||'YouTube',channel:x.snippet?.channelTitle||'',thumb:x.snippet?.thumbnails?.medium?.url||x.snippet?.thumbnails?.default?.url||''})).filter(x=>x.id);
      render(items);
      if(status)status.textContent='YouTube: '+items.length+' results';
    }catch(e){
      box.innerHTML='<div style="padding:10px;text-align:center;color:#ff9f9f"><b>שגיאת YouTube API</b><br>'+esc(e.message)+'</div>';
      if(status)status.textContent='YouTube search error';
    }
  }

  function bind(){
    ensureUI();
    const btn=byId('ytBtn');
    if(btn)btn.onclick=e=>{e.preventDefault();e.stopPropagation();searchNow()};
    const input=byId('ytSearch');
    if(input)input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();searchNow()}};
    const d=cdoc();
    ['cross','gainA','gainB'].forEach(id=>d?.getElementById(id)?.addEventListener('input',mix));
  }

  window.AFDOpenYT=searchNow;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
  frame()?.addEventListener('load',()=>setTimeout(bind,100));
  setTimeout(bind,400);
})();