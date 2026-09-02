(()=>{
if(window.__afdWin167){window.__afdWin167.refresh();return;}
const $=id=>document.getElementById(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const status=s=>{const e=$('status');if(e)e.textContent=s;console.log('[AFD WIN 167]',s);};
const frame=()=>document.getElementById('console');

const LEGACY_IDS=['afdEdit86Btn','afdSplit86','afdSplit85','afdSplit76','afdSplit74','afdMainDivider','afdMainDivider69','afdResize166'];
const LEGACY_STYLES=['afdEdit86Parent','afdResizeStyle166'];
function isEditText(t){
  t=String(t||'').trim().toLowerCase().replace(/\s+/g,' ');
  return t==='edit'||t==='done'||t==='done edit'||t==='edit layout'||t==='done editing'||t==='עריכה'||t==='סיום עריכה';
}
function cleanRoot(root){
  if(!root?.querySelectorAll)return;
  root.querySelectorAll('button,[role="button"],a').forEach(el=>{if(isEditText(el.textContent))el.remove();});
}
function killLegacy(){
  LEGACY_IDS.forEach(id=>document.getElementById(id)?.remove());
  LEGACY_STYLES.forEach(id=>document.getElementById(id)?.remove());
  document.querySelectorAll('script[src*="edit-control"],script[src*="ipad-edit"]').forEach(s=>s.remove());
  cleanRoot(document);
  try{cleanRoot(frame()?.contentDocument);}catch(e){}
}
function installCleaner(){
  killLegacy();
  if(!window.__afdClean167){
    window.__afdClean167=new MutationObserver(()=>killLegacy());
    window.__afdClean167.observe(document.documentElement,{subtree:true,childList:true});
  }
}

function installResize(){
  killLegacy();
  let style=$('afdWinStyle167');
  if(!style){style=document.createElement('style');style.id='afdWinStyle167';document.head.appendChild(style);}
  style.textContent=`
    html,body{width:100%!important;height:100%!important;min-height:0!important;margin:0!important;overflow:hidden!important}
    .wrap{--afd-top167:62vh;width:100%!important;height:100dvh!important;min-height:0!important;display:grid!important;grid-template-rows:var(--afd-top167) 28px minmax(0,1fr)!important;overflow:hidden!important}
    .consoleFrame{grid-row:1!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;display:block!important}
    #afdSplit167{grid-row:2!important;width:100%!important;height:28px!important;min-height:28px!important;box-sizing:border-box!important;cursor:ns-resize!important;touch-action:none!important;user-select:none!important;z-index:2147483000!important;background:linear-gradient(#5c3a82,#2c1b43 45%,#0d1015)!important;border-top:1px solid #b48cff!important;border-bottom:1px solid #08090c!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;font:900 11px/1 Arial,sans-serif!important;letter-spacing:.2px!important;box-shadow:inset 0 1px #ffffff33!important}
    #afdSplit167:before{content:'↕';margin-right:8px;font-size:16px}
    #afdSplit167:after{content:'גרור למעלה / למטה לשינוי גובה הספרייה';pointer-events:none}
    .dock{grid-row:3!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;max-height:none!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;margin:0!important}
    .dock>.toolbar,.dock>.tabs,.dock>.tools{flex:0 0 auto!important}
    .dock>.view{flex:1 1 0!important;height:0!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    #afdDragShield167{position:fixed!important;inset:0!important;z-index:2147483646!important;cursor:ns-resize!important;background:transparent!important;touch-action:none!important;user-select:none!important}
    #afdEdit86Btn,[id^="afdSplit86"],[id^="afdSplit85"],[id^="afdSplit76"],[id^="afdSplit74"],#afdResize166{display:none!important}
    #afdSP85Tools{display:none!important}
  `;
  const wrap=document.querySelector('.wrap'),dock=document.querySelector('.dock'),f=frame();
  if(!wrap||!dock||!f)return false;
  let split=$('afdSplit167');
  if(!split){
    split=document.createElement('div');split.id='afdSplit167';split.title='גרור לשינוי גובה הספרייה';
    dock.parentNode.insertBefore(split,dock);
  }
  const KEY='afdTopRatio167';
  let ratio=.62;
  try{const n=Number(localStorage.getItem(KEY));if(Number.isFinite(n)&&n>=.22&&n<=.84)ratio=n;}catch(e){}
  const applyRatio=r=>{
    ratio=clamp(Number(r)||.62,.22,.84);
    const H=Math.max(420,document.documentElement.clientHeight||innerHeight||900);
    wrap.style.setProperty('--afd-top167',Math.round(H*ratio)+'px','important');
    return ratio;
  };
  applyRatio(ratio);
  if(!split.dataset.bound167){
    split.dataset.bound167='1';
    const begin=e=>{
      if(e.button!=null&&e.button!==0)return;
      e.preventDefault();e.stopPropagation();
      const H=Math.max(420,document.documentElement.clientHeight||innerHeight||900);
      const startY=e.clientY,startTop=f.getBoundingClientRect().height;
      const shield=document.createElement('div');shield.id='afdDragShield167';document.body.appendChild(shield);
      const oldPE=f.style.pointerEvents;f.style.pointerEvents='none';
      const move=ev=>{
        ev.preventDefault();
        const top=clamp(startTop+(ev.clientY-startY),Math.round(H*.22),Math.round(H*.84));
        ratio=top/H;
        wrap.style.setProperty('--afd-top167',Math.round(top)+'px','important');
        try{window.dispatchEvent(new Event('resize'));}catch(x){}
      };
      const end=ev=>{
        if(ev)ev.preventDefault();
        shield.removeEventListener('pointermove',move,true);shield.removeEventListener('pointerup',end,true);shield.removeEventListener('pointercancel',end,true);
        shield.remove();f.style.pointerEvents=oldPE;
        try{localStorage.setItem(KEY,String(ratio));}catch(x){}
      };
      shield.addEventListener('pointermove',move,true);shield.addEventListener('pointerup',end,true);shield.addEventListener('pointercancel',end,true);
      try{shield.setPointerCapture(e.pointerId);}catch(x){}
    };
    split.addEventListener('pointerdown',begin,true);
    split.addEventListener('dblclick',()=>{ratio=.62;applyRatio(ratio);try{localStorage.setItem(KEY,String(ratio));}catch(e){};});
  }
  if(!window.__afdResizeKeep167){
    window.__afdResizeKeep167=true;
    addEventListener('resize',()=>applyRatio(ratio),{passive:true});
  }
  return true;
}
function patchFrame(){
  const f=frame();if(!f)return;
  try{
    const d=f.contentDocument;if(!d?.head)return;
    ['afdReflow86','afdFit166','afdWindowsFrameFitV164','afdWindowsFrameFitV163'].forEach(id=>d.getElementById(id)?.remove());
    let st=d.getElementById('afdFit167');if(!st){st=d.createElement('style');st.id='afdFit167';d.head.appendChild(st);}
    st.textContent='html,body{width:100%!important;min-width:0!important;overflow-x:hidden!important}.app{width:100%!important;min-width:0!important;max-width:none!important;margin:0!important;transform:none!important;transform-origin:top left!important}';
    cleanRoot(d);
  }catch(e){}
}

const SP_DEFAULT_CID='d1b255796dbd444995e8f6e29d4ce2cd';
const cid=()=>localStorage.getItem('afdSP')||SP_DEFAULT_CID;
const token=()=>sessionStorage.getItem('afdSPToken')||'';
const scopes='streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative';
const redirect=()=>location.origin+location.pathname;
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const rand=(n=48)=>{const a=new Uint8Array(n);crypto.getRandomValues(a);return b64(a);};
let spItems=[],spOffset=0,spTotal=0,spQuery='',spLoaded={A:null,B:null},spDevice='',spActive=null,spLast=0,spChain=Promise.resolve();
function clearPlaylistMode(){
  sessionStorage.removeItem('afdSPPlaylistsOpen');
  document.body.classList.remove('afdSpotifyPlaylists');
  const p=$('afdPL101Panel');if(p)p.style.display='none';
}
async function spLogin(q){
  clearPlaylistMode();
  sessionStorage.setItem('afdSPTrackQ167',q||'');
  const verifier=rand(64),state='afd167_'+rand(16);
  sessionStorage.setItem('afdSPVerifier167',verifier);sessionStorage.setItem('afdSPState167',state);
  const challenge=b64(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier)));
  const u=new URL('https://accounts.spotify.com/authorize');
  u.search=new URLSearchParams({client_id:cid(),response_type:'code',redirect_uri:redirect(),code_challenge_method:'S256',code_challenge:challenge,state,scope:scopes});
  status('Spotify • מתחבר…');
  location.href=u.toString();
}
async function spExchange(){
  const p=new URLSearchParams(location.search),code=p.get('code'),state=p.get('state');
  if(!code||!state?.startsWith('afd167_'))return false;
  const want=sessionStorage.getItem('afdSPState167'),verifier=sessionStorage.getItem('afdSPVerifier167');
  if(!want||state!==want||!verifier)throw Error('Spotify login state error');
  const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:cid(),grant_type:'authorization_code',code,redirect_uri:redirect(),code_verifier:verifier})});
  const j=await r.json();if(!r.ok)throw Error(j.error_description||'Spotify login error');
  sessionStorage.setItem('afdSPToken',j.access_token);sessionStorage.setItem('afdSP82Scopes',j.scope||scopes);
  history.replaceState({},'',redirect());
  return true;
}
async function spApi(path,opt={}){
  if(!token())throw Error('Spotify login required');
  const r=await fetch('https://api.spotify.com/v1'+path,{...opt,headers:{Authorization:'Bearer '+token(),'Content-Type':'application/json',...(opt.headers||{})}});
  if(r.status===401){sessionStorage.removeItem('afdSPToken');throw Error('SPOTIFY_LOGIN_EXPIRED');}
  if(r.status===403)throw Error('Spotify דורש Premium והרשאת Playback');
  if(!r.ok&&r.status!==204){let msg='';try{msg=(await r.clone().json())?.error?.message||'';}catch(e){}throw Error(msg||('Spotify HTTP '+r.status));}
  return r;
}
function spUI(){
  let b=$('spBtn'),i=$('spSearch');if(!b||!i)return null;
  if(!b.dataset.win167){
    const n=b.cloneNode(true);n.id='spBtn';n.textContent='חפש שירים ב-Spotify';n.onclick=null;n.removeAttribute('onclick');
    n.dataset.win167='1';n.dataset.afd84='1';n.dataset.afd83='1';n.dataset.afdSP103='1';b.replaceWith(n);b=n;
  }
  if(!i.dataset.win167){
    const n=i.cloneNode(true);n.id='spSearch';n.placeholder='חפש שיר או אמן';n.onkeydown=null;n.removeAttribute('onkeydown');
    n.dataset.win167='1';n.dataset.afd84='1';n.dataset.afd83='1';n.dataset.afdSP103='1';i.replaceWith(n);i=n;
  }
  let r=$('afdSP167Results');
  if(!r){r=document.createElement('div');r.id='afdSP167Results';r.style.cssText='margin-top:7px;overflow:auto;min-height:70px;max-height:390px;border:1px solid #313944;border-radius:6px;background:#05070a';b.closest('.card')?.appendChild(r);}
  return {b,i,r};
}
function spRender(){
  const U=spUI();if(!U)return;
  if(!spItems.length){U.r.innerHTML='<div style="padding:14px;text-align:center;color:#9ca8b5">לא נמצאו שירים</div>';return;}
  U.r.innerHTML=spItems.map((x,k)=>'<div data-i="'+k+'" style="display:grid;grid-template-columns:54px minmax(0,1fr) 66px 66px;gap:8px;align-items:center;padding:8px;border-bottom:1px solid #20262d;direction:ltr"><img src="'+esc(x.album?.images?.[1]?.url||x.album?.images?.[0]?.url||'')+'" style="width:54px;height:54px;object-fit:cover;border-radius:5px"><div style="min-width:0"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.name)+'</b><span style="display:block;font-size:10px;color:#9ca8b5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc((x.artists||[]).map(a=>a.name).join(', '))+'</span></div><button data-d="A">LOAD A</button><button data-d="B">LOAD B</button></div>').join('')+'<div style="display:flex;align-items:center;justify-content:space-between;padding:8px"><button id="spPrev167" '+(spOffset<=0?'disabled':'')+'>◀ הקודם</button><span style="font-size:10px">'+(spOffset+1)+'–'+Math.min(spOffset+spItems.length,spTotal)+' מתוך '+spTotal+'</span><button id="spNext167" '+(spOffset+spItems.length>=spTotal?'disabled':'')+'>הבא ▶</button></div>';
  U.r.querySelectorAll('[data-d]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const row=b.closest('[data-i]'),x=spItems[+row.dataset.i];spLoaded[b.dataset.d]=x;spPaint(b.dataset.d,x);status('Spotify LOADED • Deck '+b.dataset.d+' • לחץ PLAY');});
  $('spPrev167')?.addEventListener('click',()=>spSearch(spQuery,Math.max(0,spOffset-20)).catch(spFail));
  $('spNext167')?.addEventListener('click',()=>spSearch(spQuery,spOffset+20).catch(spFail));
}
async function spSearch(q,offset=0){
  q=String(q||'').trim();if(!q)return;
  clearPlaylistMode();
  document.body.classList.remove('afdSpotifyResults');
  $('afdSPResults')?.remove();
  const U=spUI();if(!U)return;
  U.r.innerHTML='<div style="padding:14px;text-align:center;color:#9ca8b5">מחפש שירים ב-Spotify…</div>';
  if(!token()){await spLogin(q);return;}
  const u=new URL('https://api.spotify.com/v1/search');u.search=new URLSearchParams({q,type:'track',limit:'20',offset:String(offset)});
  const r=await fetch(u,{headers:{Authorization:'Bearer '+token()}});
  if(r.status===401){sessionStorage.removeItem('afdSPToken');await spLogin(q);return;}
  const j=await r.json();if(!r.ok)throw Error(j.error?.message||'Spotify search error');
  const t=j.tracks||{};spItems=t.items||[];spOffset=t.offset||offset;spTotal=t.total||0;spQuery=q;spRender();status('Spotify • נמצאו '+spTotal+' שירים');
}
function spPaint(deck,x){
  try{const d=frame()?.contentDocument,screen=d?.getElementById('vid'+deck)?.closest('.screen')||d?.querySelector('.deck'+deck+' .screen');if(!screen)return;if(getComputedStyle(screen).position==='static')screen.style.position='relative';let e=d.getElementById('spDeck167'+deck);if(!e){e=d.createElement('div');e.id='spDeck167'+deck;e.style.cssText='position:absolute;inset:0;z-index:60;background:#07090c;display:flex;align-items:center;justify-content:center;text-align:center;color:white;pointer-events:none';screen.appendChild(e);}e.innerHTML='<div><img src="'+esc(x.album?.images?.[0]?.url||'')+'" style="width:145px;max-width:75%;border-radius:8px"><div style="font-weight:900;margin-top:7px">'+esc(x.name)+'</div><div style="font-size:10px;color:#aeb7c1">'+esc((x.artists||[]).map(a=>a.name).join(', '))+'</div></div>'; }catch(e){}
}
async function spDevices(){const r=await spApi('/me/player/devices'),j=await r.json();return(j.devices||[]).filter(x=>x?.id&&!x.is_restricted);}
async function spChooseDevice(){
  let list=await spDevices();
  let d=list.find(x=>x.is_active)||list.find(x=>/computer|desktop/i.test(x.type||''))||list[0];
  if(d)return d;
  status('Spotify • פותח את אפליקציית Spotify…');
  try{window.open('spotify:','_blank');}catch(e){}
  for(let k=0;k<20;k++){await sleep(600);list=await spDevices();d=list.find(x=>x.is_active)||list.find(x=>/computer|desktop/i.test(x.type||''))||list[0];if(d)return d;}
  throw Error('לא נמצא נגן Spotify פעיל. פתח Spotify במחשב והפעל שיר פעם אחת');
}
async function spPlay(deck){
  const x=spLoaded[deck];if(!x)return;
  spActive=deck;status('Spotify • מחפש נגן…');
  const dev=await spChooseDevice();spDevice=dev.id;
  await spApi('/me/player',{method:'PUT',body:JSON.stringify({device_ids:[dev.id],play:false})});
  await sleep(250);
  await spApi('/me/player/play?device_id='+encodeURIComponent(dev.id),{method:'PUT',body:JSON.stringify({uris:[x.uri||('spotify:track:'+x.id)],position_ms:0})});
  status('Spotify PLAY • Deck '+deck+' • '+(dev.name||'Spotify Connect'));
}
function spFail(e){
  const m=String(e?.message||e||'Spotify error');
  if(m==='SPOTIFY_LOGIN_EXPIRED'){const U=spUI();spLogin(U?.i?.value||spQuery).catch(x=>status('Spotify ERROR • '+x.message));return;}
  status('Spotify ERROR • '+m);
}
function deckFor(t,d){const b=t?.closest?.('.transport .play,[data-act="play"]');if(!b)return null;for(const deck of['A','B']){const root=d.querySelector('.deck'+deck)||d.getElementById('vid'+deck)?.closest('.panel');if(root?.contains(b))return deck;}return null;}
function bindDeck(){
  let d;try{d=frame()?.contentDocument;}catch(e){}if(!d||d.documentElement.dataset.sp167)return;
  d.documentElement.dataset.sp167='1';
  const go=e=>{const deck=deckFor(e.target,d);if(!deck||!spLoaded[deck])return;e.preventDefault();e.stopImmediatePropagation();const now=Date.now();if(now-spLast<350)return;spLast=now;spChain=spChain.then(()=>spPlay(deck)).catch(spFail);};
  d.addEventListener('pointerdown',go,true);
  d.addEventListener('click',e=>{const deck=deckFor(e.target,d);if(!deck||!spLoaded[deck])return;e.preventDefault();e.stopImmediatePropagation();if(Date.now()-spLast>350)spChain=spChain.then(()=>spPlay(deck)).catch(spFail);},true);
}
function bindSearch(){
  const U=spUI();if(!U)return;
  U.b.dataset.afd84='1';U.b.dataset.afd83='1';U.b.dataset.afdSP103='1';
  U.i.dataset.afd84='1';U.i.dataset.afd83='1';U.i.dataset.afdSP103='1';
  if(!U.b.dataset.bound167){
    U.b.dataset.bound167='1';
    U.b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();spSearch(U.i.value,0).catch(spFail);},true);
    U.i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();spSearch(U.i.value,0).catch(spFail);}},true);
  }
}

function refresh(){
  installCleaner();installResize();patchFrame();clearPlaylistMode();bindSearch();bindDeck();
}
window.__afdWin167={refresh};
refresh();setTimeout(refresh,150);setTimeout(refresh,500);setTimeout(refresh,1200);
setInterval(()=>{installCleaner();installResize();bindSearch();bindDeck();},800);
(async()=>{
  try{
    const ok=await spExchange();
    if(ok){const q=sessionStorage.getItem('afdSPTrackQ167')||'';if(q){const U=spUI();if(U)U.i.value=q;await spSearch(q,0);}}
  }catch(e){spFail(e);}
})();
setTimeout(()=>status('AFD Windows v1.2.6 READY'),250);
})();