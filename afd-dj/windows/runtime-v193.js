(()=>{
if(window.__afdWin193){window.__afdWin193.refresh();return;}
const frame=()=>document.getElementById('console');
const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let dragIndex=null,busy=false;
function status(t){const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD SIDEVIEW 193]',t)}
function q(){return window.__afdWin170?.queue||[]}
function isPlaying(k){const d=D(),v=d?.getElementById('vid'+k),native=!!(v&&(v.currentSrc||v.src)&&!v.paused&&!v.ended);return native||!!window.AFDYouTubeState?.isPlaying?.(k)||!!window.AFDSpotifyState?.isPlaying?.(k)}
function activeDeck(){const d=D(),c=Number(d?.getElementById('cross')?.value??50),a=isPlaying('A'),b=isPlaying('B');if(a&&!b)return'A';if(b&&!a)return'B';return c>=50?'A':'B'}
async function loadTo(deck,it){if(!it)return false;try{if(typeof window.AFDWindowsLoadItem==='function'){const r=await window.AFDWindowsLoadItem(deck,it);return r!==false}if(it.afdHistorySource&&window.__afdWin192?.loadEntry){return await window.__afdWin192.loadEntry(deck,{source:it.afdHistorySource,item:it.afdHistoryItem,name:it.name,path:it.path,kind:it.kind,key:it.key})}}catch(e){status('SIDEVIEW LOAD ERROR • '+(e?.message||e));return false}return false}
async function waitSource(deck,ms=9000){const end=performance.now()+ms;while(performance.now()<end){const d=D(),v=d?.getElementById('vid'+deck),has=!!((v&&(v.currentSrc||v.src))||d?.getElementById('ytDeck'+deck)||d?.getElementById('afdSP105Deck'+deck));if(has)return true;await sleep(80)}return false}
async function mixNow(i){if(busy)return;const arr=q(),it=arr[i];if(!it)return;const from=activeDeck(),to=from==='A'?'B':'A';busy=true;try{const automixOn=!!D()?.querySelector('.afdQ170.playing');if(automixOn){window.__afdWin170?.stopAuto?.();await sleep(50)}status('SIDEVIEW • מכין '+it.name+' ל-DECK '+to+'...');const ok=await loadTo(to,it);if(ok===false){status('SIDEVIEW • לא ניתן לטעון '+it.name);return}await waitSource(to,8000);await sleep(120);const mix=window.__afdWin188?.doMix;if(typeof mix!=='function'){status('SIDEVIEW • מנוע MIX עדיין נטען');return}status('SIDEVIEW • MIX NOW • '+it.name);await mix();}catch(e){status('SIDEVIEW MIX ERROR • '+(e?.message||e))}finally{busy=false}}
function move(from,to){const arr=q();if(!Number.isInteger(from)||!Number.isInteger(to)||from===to||!arr[from]||to<0||to>=arr.length)return;const [it]=arr.splice(from,1);arr.splice(to,0,it);window.__afdWin170?.refresh?.();status('SIDEVIEW • הסדר עודכן')}
function decorate(){const d=D();if(!d)return;let s=d.getElementById('afdSide193Style');if(!s){s=d.createElement('style');s.id='afdSide193Style';d.head.appendChild(s)}s.textContent=`.afdQ170{grid-template-columns:22px 18px minmax(0,1fr) 26px 26px 24px!important;cursor:default!important}.afdQ170 .afdDrag193{display:grid;place-items:center;color:#aab5c1;font-size:13px;cursor:grab;user-select:none}.afdQ170.afdDragging193{opacity:.6;outline:1px solid #b878ff;background:#2a2035!important}.afdQ170.afdDrop193{box-shadow:inset 0 2px #b878ff}.afdQ170 b{cursor:pointer}.afdQ170 b:hover{text-decoration:underline}.afdQ170:after{content:'דאבל־קליק = MIX';font-size:0}.afdSideHint193{font-size:7px;color:#8e9aa7;padding:3px 2px 6px;text-align:center}`;
 const host=d.getElementById('afdQueue170');if(!host)return;
 if(!d.getElementById('afdSideHint193')){const h=d.createElement('div');h.id='afdSideHint193';h.className='afdSideHint193';h.textContent='☰ גרור לשינוי סדר • דאבל־קליק על שם שיר = MIX מיידי';host.parentElement?.insertBefore(h,host)}
 host.querySelectorAll('.afdQ170').forEach(r=>{
  const i=Number(r.dataset.i);if(!Number.isInteger(i))return;
  if(!r.querySelector('.afdDrag193')){const h=d.createElement('span');h.className='afdDrag193';h.textContent='☰';h.title='גרור לשינוי סדר';const first=r.firstElementChild;first?.insertAdjacentElement('afterend',h)}
  r.draggable=true;
  if(r.dataset.afd193==='1')return;r.dataset.afd193='1';
  r.addEventListener('dragstart',e=>{if(e.target?.closest?.('button')){e.preventDefault();return}dragIndex=Number(r.dataset.i);r.classList.add('afdDragging193');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('application/x-afd-q-index',String(dragIndex))},true);
  r.addEventListener('dragend',()=>{dragIndex=null;d.querySelectorAll('.afdQ170').forEach(x=>x.classList.remove('afdDragging193','afdDrop193'))},true);
  r.addEventListener('dragover',e=>{const from=Number(e.dataTransfer?.getData('application/x-afd-q-index'));if(Number.isInteger(from)){e.preventDefault();e.dataTransfer.dropEffect='move';r.classList.add('afdDrop193')}},true);
  r.addEventListener('dragleave',()=>r.classList.remove('afdDrop193'),true);
  r.addEventListener('drop',e=>{const from=Number(e.dataTransfer?.getData('application/x-afd-q-index'));const to=Number(r.dataset.i);if(Number.isInteger(from)&&Number.isInteger(to)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();move(from,to)}},true);
  r.querySelector('b')?.addEventListener('dblclick',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();mixNow(Number(r.dataset.i))},true);
 });
}
function refresh(){decorate()}
window.__afdWin193={refresh,mixNow,move};
frame()?.addEventListener('load',()=>setTimeout(refresh,300));refresh();setTimeout(refresh,800);setInterval(refresh,300);
})();