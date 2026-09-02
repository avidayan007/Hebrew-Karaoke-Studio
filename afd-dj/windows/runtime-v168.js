(()=>{
if(window.__afdWin168){window.__afdWin168.refresh();return;}
const $=id=>document.getElementById(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const status=s=>{const e=$('status');if(e)e.textContent=s;console.log('[AFD WIN 168]',s);};
const frame=()=>document.getElementById('console');

let topRatio=.62;
try{
  const saved=Number(localStorage.getItem('afdTopRatio168'));
  if(Number.isFinite(saved)&&saved>=.20&&saved<=.86)topRatio=saved;
}catch(e){}
let drag=null;

function isEditText(t){
  t=String(t||'').trim().toLowerCase().replace(/\s+/g,' ');
  return ['edit','done','done edit','edit layout','done editing','עריכה','סיום עריכה'].includes(t);
}
function cleanEdit(root){
  if(!root?.querySelectorAll)return;
  root.querySelectorAll('button,[role="button"],a').forEach(el=>{if(isEditText(el.textContent))el.remove();});
}
function killOldLayout(){
  ['afdEdit86Btn','afdSplit86','afdSplit85','afdSplit76','afdSplit74','afdMainDivider','afdMainDivider69','afdResize166','afdSplit167','afdDragShield167'].forEach(id=>document.getElementById(id)?.remove());
  cleanEdit(document);
  try{cleanEdit(frame()?.contentDocument);}catch(e){}
}
function viewportH(){return Math.max(420,document.documentElement.clientHeight||window.innerHeight||900);}
function applyTopRatio(){
  const wrap=document.querySelector('.wrap');
  if(!wrap)return;
  const H=viewportH();
  topRatio=clamp(topRatio,.20,.86);
  wrap.style.setProperty('--afd-top168',Math.round(H*topRatio)+'px','important');
}
function endDrag(){
  if(!drag)return;
  window.removeEventListener('mousemove',onMouseMove,true);
  window.removeEventListener('mouseup',endDrag,true);
  window.removeEventListener('blur',endDrag,true);
  const f=frame();
  if(f)f.style.pointerEvents=drag.oldPointerEvents;
  document.getElementById('afdDragShield168')?.remove();
  document.documentElement.style.userSelect=drag.oldUserSelect;
  document.body.style.cursor=drag.oldBodyCursor;
  drag=null;
  try{localStorage.setItem('afdTopRatio168',String(topRatio));}catch(e){}
}
function onMouseMove(e){
  if(!drag)return;
  e.preventDefault();
  const H=viewportH();
  const top=clamp(e.clientY-drag.grabOffset,Math.round(H*.20),Math.round(H*.86));
  topRatio=top/H;
  const wrap=document.querySelector('.wrap');
  if(wrap)wrap.style.setProperty('--afd-top168',Math.round(top)+'px','important');
}
function beginDrag(e){
  if(e.button!==0)return;
  e.preventDefault();
  e.stopPropagation();
  endDrag();
  const split=$('afdSplit168'),f=frame();
  if(!split||!f)return;
  const r=split.getBoundingClientRect();
  drag={
    grabOffset:clamp(e.clientY-r.top,0,Math.max(1,r.height)),
    oldPointerEvents:f.style.pointerEvents,
    oldUserSelect:document.documentElement.style.userSelect,
    oldBodyCursor:document.body.style.cursor
  };
  const shield=document.createElement('div');
  shield.id='afdDragShield168';
  document.body.appendChild(shield);
  f.style.pointerEvents='none';
  document.documentElement.style.userSelect='none';
  document.body.style.cursor='ns-resize';
  window.addEventListener('mousemove',onMouseMove,true);
  window.addEventListener('mouseup',endDrag,true);
  window.addEventListener('blur',endDrag,true);
}
function installSplitter(){
  killOldLayout();
  let st=$('afdWinStyle168');
  if(!st){st=document.createElement('style');st.id='afdWinStyle168';document.head.appendChild(st);}
  st.textContent=`
    html,body{width:100%!important;height:100%!important;min-height:0!important;margin:0!important;overflow:hidden!important}
    .wrap{width:100%!important;height:100vh!important;min-height:0!important;display:grid!important;grid-template-rows:var(--afd-top168) 30px minmax(0,1fr)!important;overflow:hidden!important}
    .consoleFrame{grid-row:1!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;display:block!important}
    #afdSplit168{grid-row:2!important;width:100%!important;height:30px!important;min-height:30px!important;box-sizing:border-box!important;cursor:ns-resize!important;user-select:none!important;z-index:2147483000!important;background:linear-gradient(#65428c,#33204b 48%,#0b0e13)!important;border-top:1px solid #c09cff!important;border-bottom:1px solid #07080b!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;font:900 11px/1 Arial,sans-serif!important;box-shadow:inset 0 1px #ffffff33!important}
    #afdSplit168:before{content:'↕  גרור למעלה / למטה לשינוי גובה הספרייה  ↕';pointer-events:none!important}
    .dock{grid-row:3!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;max-height:none!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;margin:0!important}
    .dock>.toolbar,.dock>.tabs,.dock>.tools{flex:0 0 auto!important}
    .dock>.view{flex:1 1 0!important;height:0!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    #afdDragShield168{position:fixed!important;inset:0!important;z-index:2147483646!important;cursor:ns-resize!important;background:rgba(0,0,0,.001)!important;user-select:none!important}
    #afdEdit86Btn,#afdSplit167,#afdSplit86,#afdResize166{display:none!important}
    #afdSP85Tools{display:none!important}
  `;
  const wrap=document.querySelector('.wrap'),dock=document.querySelector('.dock');
  if(!wrap||!dock)return false;
  let split=$('afdSplit168');
  if(!split){
    split=document.createElement('div');
    split.id='afdSplit168';
    split.title='גרור לשינוי גובה הספרייה';
    dock.parentNode.insertBefore(split,dock);
  }
  if(!split.dataset.bound168){
    split.dataset.bound168='1';
    split.addEventListener('mousedown',beginDrag,true);
    split.addEventListener('dblclick',()=>{
      topRatio=.62;
      applyTopRatio();
      try{localStorage.setItem('afdTopRatio168',String(topRatio));}catch(e){}
    });
  }
  applyTopRatio();
  return true;
}
function patchConsole(){
  const f=frame();
  if(!f)return;
  try{
    const d=f.contentDocument;
    if(!d?.head)return;
    cleanEdit(d);
    let st=d.getElementById('afdFit168');
    if(!st){st=d.createElement('style');st.id='afdFit168';d.head.appendChild(st);}
    st.textContent='html,body{width:100%!important;min-width:0!important;overflow-x:hidden!important}.app{width:100%!important;min-width:0!important;max-width:none!important;margin:0!important;transform:none!important;transform-origin:top left!important}';
  }catch(e){}
}

const SP_CID=()=>localStorage.getItem('afdSP')||'d1b255796dbd444995e8f6e29d4ce2cd';
const SP_TOKEN=()=>sessionStorage.getItem('afdSPToken')||'';
const SP_SCOPES='streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative';
const spRedirect=()=>location.origin+location.pathname;
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const rand=(n=64)=>{const a=new Uint8Array(n);crypto.getRandomValues(a);return b64(a);};
let spItems=[],spOffset=0,spTotal=0,spQuery='',spLoaded={A:null,B:null},spLastGesture=0,spChain=Promise.resolve();

function clearSpotifyModes(){
  sessionStorage.removeItem('afdSPPlaylistsOpen');
  document.body.classList.remove('afdSpotifyPlaylists','afdSpotifyResults');
  const p=$('afdPL101Panel');if(p)p.style.display='none';
  ['afdSPResults','afdSP167Results','spRows166'].forEach(id=>document.getElementById(id)?.remove());
}
function markSpotifyControl(el){
  ['win167','win168','afd84','afd83','afdSP103','bound166','bound167','bound168'].forEach(k=>el.dataset[k]='1');
}
function spotifyUI(){
  let b=$('spBtn'),i=$('spSearch');
  if(!b||!i)return null;
  if(!b.dataset.win168){
    const n=b.cloneNode(true);
    n.id='spBtn';n.textContent='חפש שירים ב-Spotify';n.onclick=null;n.removeAttribute('onclick');
    markSpotifyControl(n);b.replaceWith(n);b=n;
  }
  if(!i.dataset.win168){
    const n=i.cloneNode(true);
    n.id='spSearch';n.placeholder='חפש שיר או אמן';n.onkeydown=null;n.removeAttribute('onkeydown');
    markSpotifyControl(n);i.replaceWith(n);i=n;
  }
  let r=$('afdSP168Results');
  if(!r){
    r=document.createElement('div');r.id='afdSP168Results';
    r.style.cssText='margin-top:7px;overflow:auto;min-height:70px;max-height:390px;border:1px solid #313944;border-radius:6px;background:#05070a';
    b.closest('.card')?.appendChild(r);
  }
  return {b,i,r};
}
function timeoutSignal(ms){
  const c=new AbortController();
  const t=setTimeout(()=>c.abort(),ms);
  return {signal:c.signal,done:()=>clearTimeout(t)};
}
async function spotifyStartLogin(q){
  if(sessionStorage.getItem('afdSPAuthBusy168')==='1')return;
  clearSpotifyModes();
  sessionStorage.setItem('afdSPAuthBusy168','1');
  sessionStorage.setItem('afdSPPendingQ168',q||'');
  const verifier=rand(64),state='afd168_'+rand(18);
  sessionStorage.setItem('afdSPVerifier168',verifier);
  sessionStorage.setItem('afdSPState168',state);
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier));
  const challenge=b64(digest);
  const u=new URL('https://accounts.spotify.com/authorize');
  u.search=new URLSearchParams({
    client_id:SP_CID(),response_type:'code',redirect_uri:spRedirect(),
    code_challenge_method:'S256',code_challenge:challenge,state,scope:SP_SCOPES
  });
  status('Spotify • פותח חלון התחברות…');
  location.href=u.toString();
}
async function spotifyAuthCallback(url){
  try{
    const u=new URL(url);
    const code=u.searchParams.get('code');
    const state=u.searchParams.get('state');
    const err=u.searchParams.get('error');
    if(err)throw Error('Spotify authorization: '+err);
    const want=sessionStorage.getItem('afdSPState168');
    const verifier=sessionStorage.getItem('afdSPVerifier168');
    if(!code||!state||state!==want||!verifier)throw Error('Spotify login state error');
    const ts=timeoutSignal(15000);
    let r;
    try{
      r=await fetch('https://accounts.spotify.com/api/token',{
        method:'POST',signal:ts.signal,
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({
          client_id:SP_CID(),grant_type:'authorization_code',code,
          redirect_uri:spRedirect(),code_verifier:verifier
        })
      });
    }finally{ts.done();}
    const j=await r.json();
    if(!r.ok)throw Error(j.error_description||j.error||'Spotify token error');
    sessionStorage.setItem('afdSPToken',j.access_token);
    sessionStorage.setItem('afdSP82PremiumAuth','1');
    sessionStorage.setItem('afdSP82Scopes',j.scope||SP_SCOPES);
    sessionStorage.removeItem('afdSPAuthBusy168');
    const q=sessionStorage.getItem('afdSPPendingQ168')||'';
    status('Spotify • התחברת בהצלחה');
    if(q){
      const U=spotifyUI();if(U)U.i.value=q;
      await spotifySearch(q,0);
    }
    return true;
  }catch(e){
    sessionStorage.removeItem('afdSPAuthBusy168');
    spotifyFail(e);
    return false;
  }
}
function spotifyFail(e){
  const msg=e?.name==='AbortError'?'Spotify לא הגיב בזמן. נסה שוב.':String(e?.message||e||'Spotify error');
  status('Spotify ERROR • '+msg);
  const U=spotifyUI();
  if(U)U.r.innerHTML='<div style="padding:14px;text-align:center;color:#ffb4b4">'+esc(msg)+'</div>';
}
async function spotifySearch(q,offset=0){
  q=String(q||'').trim();if(!q)return;
  clearSpotifyModes();
  const U=spotifyUI();if(!U)return;
  U.r.innerHTML='<div style="padding:14px;text-align:center;color:#9ca8b5">מחפש שירים ב-Spotify…</div>';
  if(!SP_TOKEN()){await spotifyStartLogin(q);return;}
  const u=new URL('https://api.spotify.com/v1/search');
  u.search=new URLSearchParams({q,type:'track',limit:'20',offset:String(offset)});
  const ts=timeoutSignal(12000);
  let r;
  try{r=await fetch(u,{signal:ts.signal,headers:{Authorization:'Bearer '+SP_TOKEN()}});}
  finally{ts.done();}
  if(r.status===401){
    sessionStorage.removeItem('afdSPToken');
    sessionStorage.removeItem('afdSPAuthBusy168');
    await spotifyStartLogin(q);return;
  }
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw Error(j?.error?.message||('Spotify HTTP '+r.status));
  const t=j.tracks||{};
  spItems=t.items||[];spOffset=t.offset||offset;spTotal=t.total||0;spQuery=q;
  spotifyRender();
  status('Spotify • נמצאו '+spTotal+' שירים');
}
function spotifyRender(){
  const U=spotifyUI();if(!U)return;
  if(!spItems.length){
    U.r.innerHTML='<div style="padding:14px;text-align:center;color:#9ca8b5">לא נמצאו שירים</div>';return;
  }
  U.r.innerHTML=spItems.map((x,k)=>'<div data-sp168-i="'+k+'" style="display:grid;grid-template-columns:54px minmax(0,1fr) 68px 68px;gap:8px;align-items:center;padding:8px;border-bottom:1px solid #20262d;direction:ltr"><img src="'+esc(x.album?.images?.[1]?.url||x.album?.images?.[0]?.url||'')+'" style="width:54px;height:54px;object-fit:cover;border-radius:5px"><div style="min-width:0"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.name)+'</b><span style="display:block;font-size:10px;color:#9ca8b5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc((x.artists||[]).map(a=>a.name).join(', '))+'</span></div><button data-sp168-deck="A">LOAD A</button><button data-sp168-deck="B">LOAD B</button></div>').join('')+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px"><button id="spPrev168" '+(spOffset<=0?'disabled':'')+'>◀ הקודם</button><span style="font-size:10px">'+(spOffset+1)+'–'+Math.min(spOffset+spItems.length,spTotal)+' מתוך '+spTotal+'</span><button id="spNext168" '+(spOffset+spItems.length>=spTotal?'disabled':'')+'>הבא ▶</button></div>';
  U.r.querySelectorAll('[data-sp168-deck]').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    const row=b.closest('[data-sp168-i]');
    const item=spItems[Number(row.dataset.sp168I)];
    const deck=b.dataset.sp168Deck;
    spLoaded[deck]=item;
    window.dispatchEvent(new CustomEvent('afd-spotify-load',{detail:{deck,item}}));
    paintSpotify(deck,item);
    status('Spotify LOADED • Deck '+deck+' • לחץ PLAY');
  }));
  $('spPrev168')?.addEventListener('click',()=>spotifySearch(spQuery,Math.max(0,spOffset-20)).catch(spotifyFail));
  $('spNext168')?.addEventListener('click',()=>spotifySearch(spQuery,spOffset+20).catch(spotifyFail));
}
function paintSpotify(deck,it){
  try{
    const d=frame()?.contentDocument;
    const screen=d?.getElementById('vid'+deck)?.closest('.screen')||d?.querySelector('.deck'+deck+' .screen');
    if(!screen)return;
    if(getComputedStyle(screen).position==='static')screen.style.position='relative';
    let h=d.getElementById('afdSP168Deck'+deck);
    if(!h){
      h=d.createElement('div');h.id='afdSP168Deck'+deck;
      h.style.cssText='position:absolute;inset:0;z-index:70;background:#07090c;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;color:white;pointer-events:none';
      screen.appendChild(h);
    }
    h.innerHTML='<div><img src="'+esc(it.album?.images?.[0]?.url||'')+'" style="width:145px;max-width:75%;border-radius:8px"><div style="font-weight:900;margin-top:7px">'+esc(it.name)+'</div><div style="font-size:10px;color:#aeb7c1">'+esc((it.artists||[]).map(a=>a.name).join(', '))+'</div></div>';
  }catch(e){}
}
async function spApi(path,opt={}){
  if(!SP_TOKEN())throw Error('אין חיבור Spotify');
  const ts=timeoutSignal(12000);
  let r;
  try{
    r=await fetch('https://api.spotify.com/v1'+path,{
      ...opt,signal:ts.signal,
      headers:{Authorization:'Bearer '+SP_TOKEN(),'Content-Type':'application/json',...(opt.headers||{})}
    });
  }finally{ts.done();}
  if(r.status===401){sessionStorage.removeItem('afdSPToken');throw Error('החיבור ל-Spotify פג');}
  if(r.status===403)throw Error('Spotify דורש חשבון Premium והרשאת Playback');
  if(!r.ok&&r.status!==204){let m='';try{m=(await r.clone().json())?.error?.message||'';}catch(e){}throw Error(m||('Spotify HTTP '+r.status));}
  return r;
}
async function spotifyDevices(){
  const r=await spApi('/me/player/devices');
  const j=await r.json();
  return (j.devices||[]).filter(x=>x?.id&&!x.is_restricted);
}
async function chooseSpotifyDevice(){
  let list=await spotifyDevices();
  let d=list.find(x=>x.is_active)||list.find(x=>/computer|desktop/i.test(x.type||''))||list[0];
  if(d)return d;
  status('Spotify • פותח את אפליקציית Spotify…');
  try{window.open('spotify:','_blank');}catch(e){}
  for(let i=0;i<14;i++){
    await sleep(700);
    list=await spotifyDevices();
    d=list.find(x=>x.is_active)||list.find(x=>/computer|desktop/i.test(x.type||''))||list[0];
    if(d)return d;
  }
  throw Error('לא נמצא נגן Spotify פעיל. פתח Spotify במחשב ונגן שיר פעם אחת.');
}
async function spotifyPlay(deck){
  const it=spLoaded[deck];if(!it)return;
  const uri=it.uri||(it.id?'spotify:track:'+it.id:'');
  if(!uri)throw Error('Spotify track URI missing');
  const dev=await chooseSpotifyDevice();
  status('Spotify • מנגן דרך '+(dev.name||'Spotify Connect'));
  await spApi('/me/player',{method:'PUT',body:JSON.stringify({device_ids:[dev.id],play:false})});
  await sleep(180);
  await spApi('/me/player/play?device_id='+encodeURIComponent(dev.id),{method:'PUT',body:JSON.stringify({uris:[uri],position_ms:0})});
  status('Spotify PLAY • Deck '+deck+' • '+(dev.name||'Spotify Connect'));
}
function deckFromPlay(target,doc){
  const b=target?.closest?.('.transport .play,[data-act="play"]');if(!b)return null;
  for(const deck of ['A','B']){
    const root=doc.querySelector('.deck'+deck)||doc.getElementById('vid'+deck)?.closest('.panel');
    if(root?.contains(b))return deck;
  }
  return null;
}
function bindDeckPlay(){
  let d;try{d=frame()?.contentDocument;}catch(e){}
  if(!d||d.documentElement.dataset.afdSP168)return;
  d.documentElement.dataset.afdSP168='1';
  const go=e=>{
    const deck=deckFromPlay(e.target,d);
    if(!deck||!spLoaded[deck])return;
    e.preventDefault();e.stopImmediatePropagation();
    const now=Date.now();if(now-spLastGesture<350)return;spLastGesture=now;
    spChain=spChain.then(()=>spotifyPlay(deck)).catch(spotifyFail);
  };
  d.addEventListener('pointerdown',go,true);
  d.addEventListener('click',e=>{
    const deck=deckFromPlay(e.target,d);
    if(!deck||!spLoaded[deck])return;
    e.preventDefault();e.stopImmediatePropagation();
    if(Date.now()-spLastGesture>350)spChain=spChain.then(()=>spotifyPlay(deck)).catch(spotifyFail);
  },true);
}
function bindSpotifySearch(){
  clearSpotifyModes();
  const U=spotifyUI();if(!U)return;
  if(!U.b.dataset.search168){
    U.b.dataset.search168='1';
    U.b.addEventListener('click',e=>{
      e.preventDefault();e.stopImmediatePropagation();
      spotifySearch(U.i.value,0).catch(spotifyFail);
    },true);
  }
  if(!U.i.dataset.search168){
    U.i.dataset.search168='1';
    U.i.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        e.preventDefault();e.stopImmediatePropagation();
        spotifySearch(U.i.value,0).catch(spotifyFail);
      }
    },true);
  }
}
function refresh(){
  installSplitter();
  patchConsole();
  cleanEdit(document);
  bindSpotifySearch();
  bindDeckPlay();
}
window.__afdWin168={refresh,spotifyAuthCallback};
window.__afdSpotifyCallback168=spotifyAuthCallback;
refresh();
frame()?.addEventListener('load',()=>setTimeout(refresh,100));
setTimeout(refresh,250);
setTimeout(refresh,900);
setInterval(()=>{
  installSplitter();
  cleanEdit(document);
  bindSpotifySearch();
  bindDeckPlay();
},1500);
window.addEventListener('resize',()=>applyTopRatio(),{passive:true});
})();