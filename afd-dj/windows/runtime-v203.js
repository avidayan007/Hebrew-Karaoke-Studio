(()=>{
if(window.__afdFull203){window.__afdFull203.refresh();return;}
const $=id=>document.getElementById(id);
let mode='online';
function status(t){const e=$('status');if(e)e.textContent=t;console.log('[AFD FULL 203]',t)}
function restoreSettings(){
  const pairs=[['ytKey','afdYT'],['spId','afdSP'],['amToken','afdAM']];
  for(const [id,key] of pairs){
    const input=$(id);if(!input)continue;
    input.readOnly=false;input.removeAttribute('readonly');
    if(document.activeElement!==input)input.value=localStorage.getItem(key)||'';
  }
  for(const id of ['saveSettings','saveSettings2','saveSettings3']){const b=$(id);if(b){b.disabled=false;if(id==='saveSettings2')b.textContent='שמור'}}
}
function show(which){
  mode=which==='settings'?'settings':'online';
  const online=$('online'),settings=$('settings');
  if(online)online.style.setProperty('display',mode==='online'?'grid':'none','important');
  if(settings)settings.style.setProperty('display',mode==='settings'?'grid':'none','important');
  $('afdOnline203')?.classList.toggle('active',mode==='online');
  $('afdSettings203')?.classList.toggle('active',mode==='settings');
  if(mode==='settings')restoreSettings();
}
function installHeader(){
  let head=$('afdOnlineHead170');if(!head)return false;
  if(!head.querySelector('#afdFullNav203')){
    head.textContent='';
    const nav=document.createElement('div');nav.id='afdFullNav203';
    nav.innerHTML='<b>AFD DJ • ONLINE & SETTINGS</b><button id="afdOnline203">🌐 YOUTUBE / SPOTIFY</button><button id="afdSettings203">⚙ API & CLIENT ID</button>';
    head.appendChild(nav);
    nav.querySelector('#afdOnline203').addEventListener('click',()=>show('online'));
    nav.querySelector('#afdSettings203').addEventListener('click',()=>show('settings'));
  }
  return true;
}
function installStyle(){
  let s=$('afdFullStyle203');if(!s){s=document.createElement('style');s.id='afdFullStyle203';document.head.appendChild(s)}
  s.textContent=`#afdFullNav203{width:100%;display:flex;align-items:center;gap:8px;direction:ltr}#afdFullNav203 b{margin-right:auto;color:#e9d9ff}#afdFullNav203 button{height:24px;padding:0 10px;border:1px solid #77618f;border-radius:4px;background:#15101d;color:#fff;font:900 8px Arial}#afdFullNav203 button.active{border-color:#b892ff;background:linear-gradient(#7046a6,#2b193f)}#settings{overflow:auto!important}#settings input{width:100%!important}#afdRescueBadge202{display:none!important}`;
}
function badge(){
  $('afdRescueBadge202')?.remove();
  let b=$('afdCoreBadge201');if(!b){b=document.createElement('div');b.id='afdCoreBadge201';document.body.appendChild(b)}
  b.textContent='FULL 1.5.4';
  b.style.cssText='position:fixed;right:8px;top:7px;z-index:2147483647;background:#0d1117;border:1px solid #9a71d0;color:#f0e4ff;border-radius:5px;padding:3px 7px;font:800 9px Arial;pointer-events:none;opacity:.92';
}
function verify(){
  const d=(()=>{try{return $('console')?.contentDocument||null}catch(e){return null}})();
  const missing=[];
  if(!$('ytSearch')||!$('ytBtn'))missing.push('YouTube');
  if(!$('spSearch')||!$('spBtn'))missing.push('Spotify');
  if(!$('ytKey')||!$('spId'))missing.push('Settings');
  if(!d?.getElementById('afdLibTextCtl172'))missing.push('Library A−/A+');
  return missing;
}
function refresh(){
  $('afdRescueOuter202')?.remove();
  installStyle();installHeader();restoreSettings();badge();show(mode);
  try{window.__afdWin172?.refresh?.();window.__afdSpotify196?.refresh?.()}catch(e){}
}
window.__afdFull203={refresh,show,verify,get mode(){return mode}};
$('console')?.addEventListener('load',()=>setTimeout(refresh,220));
refresh();setTimeout(()=>{refresh();const missing=verify();status(missing.length?'AFD 1.5.4 • חסר: '+missing.join(', '):'AFD DJ 1.5.4 FULL READY')},800);
setInterval(refresh,1400);
})();
