(()=>{
if(window.__afdWin200Guard){window.__afdWin200Guard.refresh();return;}
const $=id=>document.getElementById(id);
const rawFetch=window.fetch.bind(window);
function sanitize(input){
  try{
    const raw=typeof input==='string'?input:input?.url;
    if(!raw)return null;
    const u=new URL(raw,location.href);
    if(u.hostname!=='api.spotify.com'||u.pathname!=='/v1/search')return null;
    if(u.searchParams.has('limit')){
      const n=Number(u.searchParams.get('limit'));
      if(!Number.isFinite(n)||n<1||n>10)u.searchParams.delete('limit');
      else u.searchParams.set('limit',String(Math.min(10,Math.max(1,Math.floor(n)))));
    }
    return u.toString();
  }catch(e){return null}
}
window.fetch=function(input,init){
  const safe=sanitize(input);
  if(!safe)return rawFetch(input,init);
  if(typeof input==='string')return rawFetch(safe,init);
  try{return rawFetch(new Request(safe,input),init)}catch(e){return rawFetch(safe,init)}
};
function status(t){const e=$('status');if(e)e.textContent=t;console.log('[AFD GUARD 200]',t)}
function claimSpotify(){
  const b=$('spBtn'),i=$('spSearch');
  if(b){b.dataset.win168='1';b.dataset.search168='1';b.dataset.sp196='1'}
  if(i){i.dataset.win168='1';i.dataset.search168='1';i.dataset.sp196='1'}
  try{window.__afdSpotify196?.refresh?.()}catch(e){}
}
function captureClick(e){
  const b=e.target?.closest?.('#spBtn');if(!b)return;
  const i=$('spSearch'),q=String(i?.value||'').trim();if(!q)return;
  if(!window.__afdSpotify196?.search)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  window.__afdSpotify196.search(q,0).catch?.(x=>status('Spotify ERROR • '+(x?.message||x)));
}
function captureKey(e){
  if(e.key!=='Enter'||e.target?.id!=='spSearch')return;
  const q=String(e.target.value||'').trim();if(!q||!window.__afdSpotify196?.search)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  window.__afdSpotify196.search(q,0).catch?.(x=>status('Spotify ERROR • '+(x?.message||x)));
}
document.addEventListener('click',captureClick,true);
document.addEventListener('keydown',captureKey,true);
function refresh(){claimSpotify()}
window.__afdWin200Guard={refresh,sanitize};
refresh();setTimeout(refresh,120);setTimeout(refresh,500);setInterval(refresh,250);
})();