(()=>{
if(window.__afdWin166){window.__afdWin166.refresh();return}
const $=id=>document.getElementById(id),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const status=s=>{const e=$('status');if(e)e.textContent=s;console.log('[AFD]',s)};

function removeEdit(root=document){
  try{root.querySelectorAll('button,[role="button"],a').forEach(e=>{const t=(e.textContent||'').trim().toLowerCase().replace(/\s+/g,' ');if(['edit','done edit','done','עריכה','סיום עריכה'].includes(t))e.remove()})}catch(e){}
}
function installCleaner(){
  const f=$('console');removeEdit(document);try{removeEdit(f?.contentDocument)}catch(e){}
  if(!window.__afdEditObs){window.__afdEditObs=new MutationObserver(()=>{removeEdit(document);try{removeEdit(f?.contentDocument)}catch(e){}});window.__afdEditObs.observe(document.documentElement,{subtree:true,childList:true})}
  if(f&&!f.dataset.edit166){f.dataset.edit166='1';f.addEventListener('load',()=>setTimeout(()=>{try{removeEdit(f.contentDocument)}catch(e){}},60))}
}
function installResize(){
  let st=$('afdResizeStyle166');if(!st){st=document.createElement('style');st.id='afdResizeStyle166';document.head.appendChild(st)}
  st.textContent='html,body{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important}.wrap{--dock:34vh;width:100%!important;height:100dvh!important;display:grid!important;grid-template-rows:minmax(120px,1fr) 22px var(--dock)!important;overflow:hidden!important}.consoleFrame{width:100%!important;height:100%!important;min-height:0!important}.dock{height:100%!important;min-height:0!important;max-height:none!important;overflow:auto!important;display:flex!important;flex-direction:column!important}.view{height:auto!important;min-height:80px!important;max-height:none!important;flex:1!important}#afdResize166{height:22px!important;cursor:ns-resize!important;background:linear-gradient(#3b4652,#111820)!important;border-top:1px solid #7d8792!important;border-bottom:1px solid #05070a!important;display:flex!important;align-items:center!important;justify-content:center!important;z-index:2147483000!important;touch-action:none!important;user-select:none!important}#afdResize166:after{content:"↕  גרור ספרייה";font:800 10px Arial;color:#dce4ec;background:#9ca7b3;width:150px;height:6px;border-radius:9px;text-indent:170px;white-space:nowrap;line-height:6px}';
  const wrap=document.querySelector('.wrap'),dock=document.querySelector('.dock');if(!wrap||!dock)return;
  let h=$('afdResize166');if(!h){h=document.createElement('div');h.id='afdResize166';dock.parentNode.insertBefore(h,dock)}
  let ratio=.34;try{const n=+localStorage.afdDock166;if(n>=.14&&n<=.8)ratio=n}catch(e){}
  const apply=y=>{const H=Math.max(1,document.documentElement.clientHeight||innerHeight);ratio=clamp((H-y)/H,.14,.8);wrap.style.setProperty('--dock',Math.round(H*ratio)+'px')};
  const saved=()=>{try{localStorage.afdDock166=ratio}catch(e){}};
  if(!h.dataset.bound){h.dataset.bound='1';let id=null,drag=false;
    h.onpointerdown=e=>{if(e.button!==0)return;drag=true;id=e.pointerId;try{h.setPointerCapture(id)}catch(x){};apply(e.clientY);e.preventDefault()};
    h.onpointermove=e=>{if(drag&&e.pointerId===id){apply(e.clientY);e.preventDefault()}};
    h.onpointerup=h.onpointercancel=e=>{if(!drag)return;drag=false;try{h.releasePointerCapture(id)}catch(x){};id=null;saved();e.preventDefault()};
    h.ondblclick=()=>{ratio=.34;const H=Math.max(1,document.documentElement.clientHeight||innerHeight);wrap.style.setProperty('--dock',Math.round(H*ratio)+'px');saved()};
  }
  const H=Math.max(1,document.documentElement.clientHeight||innerHeight);wrap.style.setProperty('--dock',Math.round(H*ratio)+'px');
}
function patchFrame(){
  const f=$('console');if(!f)return;try{const d=f.contentDocument;if(!d?.head)return;let st=d.getElementById('afdFit166');if(!st){st=d.createElement('style');st.id='afdFit166';d.head.appendChild(st)}st.textContent='html,body{width:100%!important;min-width:0!important;overflow-x:hidden!important}.app{width:100%!important;min-width:0!important;max-width:none!important;margin:0!important;transform:none!important}';removeEdit(d)}catch(e){}
}

const CID=()=>localStorage.getItem('afdSP')||'d1b255796dbd444995e8f6e29d4ce2cd',token=()=>sessionStorage.getItem('afdSPToken')||'';
const scopes='streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state';
let items=[],off=0,total=0,q0='',loaded={A:null,B:null},device='',active=null,last=0,queue=Promise.resolve();
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const rand=n=>{const a=new Uint8Array(n||48);crypto.getRandomValues(a);return b64(a)};
const redirect=()=>location.origin+location.pathname;
async function login(q){sessionStorage.afdSPQ166=q;const v=rand(),state='afd166_'+rand(16);sessionStorage.afdSPV166=v;sessionStorage.afdSPS166=state;const c=b64(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)));const u=new URL('https://accounts.spotify.com/authorize');u.search=new URLSearchParams({client_id:CID(),response_type:'code',redirect_uri:redirect(),code_challenge_method:'S256',code_challenge:c,state,scope:scopes});location.href=u}
async function exchange(){const p=new URLSearchParams(location.search),code=p.get('code'),state=p.get('state');if(!code||!state?.startsWith('afd166_'))return false;if(state!==sessionStorage.afdSPS166)throw Error('Spotify login state error');const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:CID(),grant_type:'authorization_code',code,redirect_uri:redirect(),code_verifier:sessionStorage.afdSPV166})});const j=await r.json();if(!r.ok)throw Error(j.error_description||'Spotify login error');sessionStorage.afdSPToken=j.access_token;history.replaceState({},'',redirect());return true}
async function api(path,opt={}){const r=await fetch('https://api.spotify.com/v1'+path,{...opt,headers:{Authorization:'Bearer '+token(),'Content-Type':'application/json',...(opt.headers||{})}});if(r.status===401){sessionStorage.removeItem('afdSPToken');throw Error('החיבור ל-Spotify פג')}if(r.status===403)throw Error('Spotify דורש חשבון Premium');if(!r.ok&&r.status!==204){let m='';try{m=(await r.clone().json()).error?.message||''}catch(e){}throw Error(m||'Spotify HTTP '+r.status)}return r}
function ui(){
  let b=$('spBtn'),i=$('spSearch');if(!b||!i)return null;
  if(!b.dataset.w166){const n=b.cloneNode(true);n.id='spBtn';n.dataset.w166='1';n.textContent='חפש שירים ב-Spotify';n.dataset.afd84='1';b.replaceWith(n);b=n}
  if(!i.dataset.w166){const n=i.cloneNode(true);n.id='spSearch';n.dataset.w166='1';n.placeholder='חפש שיר או אמן';n.dataset.afd84='1';i.replaceWith(n);i=n}
  let r=$('spRows166');if(!r){r=document.createElement('div');r.id='spRows166';r.style.cssText='margin-top:7px;overflow:auto;max-height:390px;border:1px solid #313944;border-radius:6px;background:#05070a';b.closest('.card')?.appendChild(r)}
  return{b,i,r}
}
function render(){
  const U=ui();if(!U)return;
  if(!items.length){U.r.innerHTML='<div style="padding:14px;text-align:center;color:#9ca8b5">לא נמצאו שירים</div>';return}
  U.r.innerHTML=items.map((x,k)=>'<div data-i="'+k+'" style="display:grid;grid-template-columns:52px minmax(0,1fr) 66px 66px;gap:7px;align-items:center;padding:7px;border-bottom:1px solid #20262d;direction:ltr"><img src="'+esc(x.album?.images?.[1]?.url||x.album?.images?.[0]?.url||'')+'" style="width:52px;height:52px;object-fit:cover;border-radius:5px"><div style="min-width:0"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.name)+'</b><span style="font-size:10px;color:#9ca8b5">'+esc((x.artists||[]).map(a=>a.name).join(', '))+'</span></div><button data-d="A">LOAD A</button><button data-d="B">LOAD B</button></div>').join('')+'<div style="display:flex;justify-content:space-between;padding:7px"><button id="spPrev166" '+(off<=0?'disabled':'')+'>◀</button><span>'+(off+1)+'–'+Math.min(off+items.length,total)+' / '+total+'</span><button id="spNext166" '+(off+items.length>=total?'disabled':'')+'>▶</button></div>';
  U.r.querySelectorAll('[data-d]').forEach(b=>b.onclick=e=>{e.preventDefault();const row=b.closest('[data-i]'),x=items[+row.dataset.i];loaded[b.dataset.d]=x;paint(b.dataset.d,x);status('Spotify LOADED • Deck '+b.dataset.d+' • לחץ PLAY')});
  $('spPrev166')?.addEventListener('click',()=>search(q0,Math.max(0,off-20)));
  $('spNext166')?.addEventListener('click',()=>search(q0,off+20));
}
async function search(q,n=0){q=(q||'').trim();if(!q)return;const U=ui();if(!U)return;U.r.innerHTML='<div style="padding:14px;text-align:center;color:#9ca8b5">מחפש שירים ב-Spotify…</div>';if(!token()){await login(q);return}const u=new URL('https://api.spotify.com/v1/search');u.search=new URLSearchParams({q,type:'track',limit:'20',offset:String(n)});let r=await fetch(u,{headers:{Authorization:'Bearer '+token()}});if(r.status===401){sessionStorage.removeItem('afdSPToken');await login(q);return}const j=await r.json();if(!r.ok)throw Error(j.error?.message||'Spotify search error');const t=j.tracks||{};items=t.items||[];off=t.offset||n;total=t.total||0;q0=q;render();status('Spotify • '+total+' שירים')}
function paint(d,x){try{const doc=$('console')?.contentDocument,screen=doc?.getElementById('vid'+d)?.closest('.screen')||doc?.querySelector('.deck'+d+' .screen');if(!screen)return;let e=doc.getElementById('spDeck166'+d);if(!e){e=doc.createElement('div');e.id='spDeck166'+d;e.style.cssText='position:absolute;inset:0;z-index:50;background:#07090c;display:flex;align-items:center;justify-content:center;text-align:center;color:white;pointer-events:none';screen.appendChild(e)}e.innerHTML='<div><img src="'+esc(x.album?.images?.[0]?.url||'')+'" style="width:145px;max-width:75%;border-radius:8px"><div style="font-weight:900;margin-top:7px">'+esc(x.name)+'</div></div>'}catch(e){}}
async function devices(){const r=await api('/me/player/devices'),j=await r.json();return(j.devices||[]).filter(x=>x?.id&&!x.is_restricted)}
async function choose(){let a=await devices(),d=a.find(x=>x.is_active)||a.find(x=>/computer|desktop/i.test(x.type||''))||a[0];if(d)return d;status('Spotify • פותח את Spotify ומחפש נגן…');try{window.open('spotify:','_blank')}catch(e){}for(let k=0;k<16;k++){await sleep(650);a=await devices();d=a.find(x=>x.is_active)||a.find(x=>/computer|desktop/i.test(x.type||''))||a[0];if(d)return d}throw Error('לא נמצא נגן Spotify. ודא שאפליקציית Spotify מותקנת ומחוברת ל-Premium')}
async function play(d){const x=loaded[d];if(!x)return;active=d;const dev=await choose();device=dev.id;status('Spotify • נבחר '+(dev.name||dev.type||'נגן'));await api('/me/player',{method:'PUT',body:JSON.stringify({device_ids:[dev.id],play:false})});await sleep(220);await api('/me/player/play?device_id='+encodeURIComponent(dev.id),{method:'PUT',body:JSON.stringify({uris:[x.uri||('spotify:track:'+x.id)],position_ms:0})});status('Spotify PLAY • Deck '+d+' • '+(dev.name||'Spotify Connect'))}
function deckButton(t,doc){const b=t?.closest?.('.transport .play,[data-act="play"]');if(!b)return null;for(const d of['A','B']){const root=doc.querySelector('.deck'+d)||doc.getElementById('vid'+d)?.closest('.panel');if(root?.contains(b))return d}return null}
function bindDeck(){let doc;try{doc=$('console')?.contentDocument}catch(e){}if(!doc||doc.documentElement.dataset.sp166)return;doc.documentElement.dataset.sp166='1';const go=e=>{const d=deckButton(e.target,doc);if(!d||!loaded[d])return;e.preventDefault();e.stopImmediatePropagation();const n=Date.now();if(n-last<350)return;last=n;queue=queue.then(()=>play(d)).catch(x=>status('Spotify ERROR • '+x.message))};doc.addEventListener('pointerdown',go,true);doc.addEventListener('click',e=>{const d=deckButton(e.target,doc);if(!d||!loaded[d])return;e.preventDefault();e.stopImmediatePropagation();if(Date.now()-last>350)queue=queue.then(()=>play(d)).catch(x=>status('Spotify ERROR • '+x.message))},true)}
function bindSearch(){const U=ui();if(!U||U.b.dataset.bound166)return;U.b.dataset.bound166='1';U.b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();search(U.i.value,0).catch(x=>status('Spotify ERROR • '+x.message))},true);U.i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();search(U.i.value,0).catch(x=>status('Spotify ERROR • '+x.message))}},true)}
function refresh(){installCleaner();installResize();patchFrame();bindSearch();bindDeck()}
window.__afdWin166={refresh};refresh();setTimeout(refresh,250);setTimeout(refresh,800);setInterval(()=>{bindSearch();bindDeck();installCleaner()},1200);
(async()=>{try{const ok=await exchange();if(ok){const q=sessionStorage.afdSPQ166||'';if(q){const U=ui();if(U)U.i.value=q;await search(q,0)}}}catch(e){status('Spotify ERROR • '+e.message)}})();
})();