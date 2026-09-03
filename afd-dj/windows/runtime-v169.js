(()=>{
if(window.__afdWin169){window.__afdWin169.refresh();return;}

const DEFAULT_CLIENT_ID='d1b255796dbd444995e8f6e29d4ce2cd';
const ACCESS_KEY='afdSPAccess169';
const REFRESH_KEY='afdSPRefresh169';
const EXPIRES_KEY='afdSPExpires169';
const nativeFetch=window.fetch.bind(window);
let refreshing=null;

function status(text){
  const e=document.getElementById('status');
  if(e)e.textContent=text;
  console.log('[AFD WIN 169]',text);
}
function clientId(){
  try{return String(localStorage.getItem('afdSP')||DEFAULT_CLIENT_ID).trim()||DEFAULT_CLIENT_ID}catch(e){return DEFAULT_CLIENT_ID}
}
function restoreClientEditor(){
  const input=document.getElementById('spId');
  if(input){
    if(document.activeElement!==input)input.value=String(localStorage.getItem('afdSP')||'');
    input.readOnly=false;
    input.removeAttribute('readonly');
    input.title='Spotify Client ID שלך נשמר במחשב הזה';
  }
  const save=document.getElementById('saveSettings2');
  if(save){
    save.textContent='שמור';
    save.disabled=false;
    save.title='שמור Spotify Client ID';
  }
}
function storeTokenPayload(j){
  if(!j||typeof j!=='object')return;
  const now=Date.now();
  if(j.access_token){
    try{localStorage.setItem(ACCESS_KEY,j.access_token);}catch(e){}
    try{sessionStorage.setItem('afdSPToken',j.access_token);}catch(e){}
  }
  if(j.refresh_token){
    try{localStorage.setItem(REFRESH_KEY,j.refresh_token);}catch(e){}
  }
  if(j.expires_in){
    try{localStorage.setItem(EXPIRES_KEY,String(now+Math.max(30,Number(j.expires_in)-60)*1000));}catch(e){}
  }
}
function migrateExisting(){
  restoreClientEditor();
  let session='';
  try{session=sessionStorage.getItem('afdSPToken')||'';}catch(e){}
  if(session){
    try{if(!localStorage.getItem(ACCESS_KEY))localStorage.setItem(ACCESS_KEY,session);}catch(e){}
  }else{
    try{
      const saved=localStorage.getItem(ACCESS_KEY)||'';
      if(saved)sessionStorage.setItem('afdSPToken',saved);
    }catch(e){}
  }
}
async function refreshSpotifyToken(force=false){
  if(refreshing)return refreshing;
  refreshing=(async()=>{
    let refresh='';
    try{refresh=localStorage.getItem(REFRESH_KEY)||'';}catch(e){}
    if(!refresh)return false;
    if(!force){
      let exp=0;
      try{exp=Number(localStorage.getItem(EXPIRES_KEY)||0);}catch(e){}
      let access='';
      try{access=localStorage.getItem(ACCESS_KEY)||'';}catch(e){}
      if(access&&exp>Date.now()+45000){
        try{sessionStorage.setItem('afdSPToken',access);}catch(e){}
        return true;
      }
    }
    const r=await nativeFetch('https://accounts.spotify.com/api/token',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({
        client_id:clientId(),
        grant_type:'refresh_token',
        refresh_token:refresh
      })
    });
    const j=await r.clone().json().catch(()=>({}));
    if(!r.ok){
      console.warn('[AFD WIN 169] refresh failed',j);
      return false;
    }
    storeTokenPayload(j);
    status('Spotify • החיבור חודש אוטומטית');
    return true;
  })().finally(()=>{refreshing=null;});
  return refreshing;
}
function withBearer(init,token){
  const headers=new Headers(init?.headers||{});
  headers.set('Authorization','Bearer '+token);
  return {...(init||{}),headers};
}
function requestUrl(input){
  try{return typeof input==='string'?input:input?.url||String(input||'');}catch(e){return '';}
}
window.fetch=async function(input,init){
  const url=requestUrl(input);

  if(url.startsWith('https://accounts.spotify.com/api/token')){
    const r=await nativeFetch(input,init);
    try{
      const j=await r.clone().json();
      if(r.ok)storeTokenPayload(j);
    }catch(e){}
    return r;
  }

  if(!url.startsWith('https://api.spotify.com/'))return nativeFetch(input,init);

  migrateExisting();
  let response=await nativeFetch(input,init);
  if(response.status!==401)return response;

  const ok=await refreshSpotifyToken(true).catch(()=>false);
  if(!ok)return response;

  let access='';
  try{access=localStorage.getItem(ACCESS_KEY)||sessionStorage.getItem('afdSPToken')||'';}catch(e){}
  if(!access)return response;

  if(input instanceof Request){
    const req=new Request(input,withBearer(init,access));
    return nativeFetch(req);
  }
  return nativeFetch(input,withBearer(init,access));
};

function refresh(){
  migrateExisting();
  restoreClientEditor();
  refreshSpotifyToken(false).catch(()=>{});
}

window.__afdWin169={refresh,refreshSpotifyToken,clientId};
refresh();
setTimeout(refresh,300);
setTimeout(refresh,1200);
})();
