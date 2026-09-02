(()=>{
if(window.__afdWin170){window.__afdWin170.refresh();return;}
const $=id=>document.getElementById(id);
const frame=()=>document.getElementById('console');
const clean=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const KEY_FAV='afdLocalFav170';
let items=[],active='all',search='',queue=[],history=[],auto={running:false,index:-1,deck:'A'};
let fav=new Set();
try{fav=new Set(JSON.parse(localStorage.getItem(KEY_FAV)||'[]'))}catch(e){}
const keyOf=f=>(f.webkitRelativePath||f.name)+'|'+f.size+'|'+f.lastModified;
const folderOf=f=>{const p=f.webkitRelativePath||'';return p.includes('/')?p.split('/').slice(0,-1).join('/'):'Files'};
const kindOf=f=>{const s=((f.webkitRelativePath||'')+' '+f.name).toLowerCase();if(s.includes('karaoke')||s.includes('קריוקי'))return'karaoke';if((f.type||'').startsWith('video/'))return'video';return'music'};
function status(t){const e=$('status');if(e)e.textContent=t;console.log('[AFD LIB 170]',t)}

function mountOnline(){
  const dock=document.querySelector('.dock'),view=dock?.querySelector('.view'),online=$('online');
  if(!dock||!view||!online)return false;
  dock.querySelector('.toolbar')?.style.setProperty('display','none','important');
  dock.querySelector('.tabs')?.style.setProperty('display','none','important');
  dock.querySelector('.tools')?.style.setProperty('display','none','important');
  ['local','automix','settings'].forEach(id=>{const e=$(id);if(e)e.style.setProperty('display','none','important')});
  const apple=$('amSearch')?.closest('.card');if(apple)apple.remove();
  let head=$('afdOnlineHead170');
  if(!head){head=document.createElement('div');head.id='afdOnlineHead170';head.textContent='ONLINE MUSIC  •  SPOTIFY  •  YOUTUBE';view.insertAdjacentElement('beforebegin',head)}
  let st=$('afdOuter170Style');if(!st){st=document.createElement('style');st.id='afdOuter170Style';document.head.appendChild(st)}
  st.textContent=`#afdOnlineHead170{height:30px;flex:0 0 30px;display:flex;align-items:center;padding:0 12px;border-bottom:1px solid #3b424c;background:linear-gradient(#252b33,#0b0e13);font-size:10px;font-weight:1000;color:#d9c0ff;letter-spacing:.6px}.dock>.view{margin:0!important;border:0!important;border-radius:0!important;flex:1 1 0!important;height:0!important;min-height:0!important}.dock #online{display:grid!important;grid-template-columns:1fr 1fr!important;height:100%!important;min-height:0!important;padding:8px!important;gap:8px!important}.dock #online>.card{min-width:0!important}.dock #amSearch{display:none!important}`;
  online.style.setProperty('display','grid','important');
  return true;
}

function d(){try{return frame()?.contentDocument}catch(e){return null}}
function w(){try{return frame()?.contentWindow}catch(e){return null}}
function saveFav(){try{localStorage.setItem(KEY_FAV,JSON.stringify([...fav]))}catch(e){}}
function addFiles(list){
  let n=0;
  [...(list||[])].forEach(f=>{
    if(!(f.type||'').startsWith('audio/')&&!(f.type||'').startsWith('video/'))return;
    const k=keyOf(f);if(items.some(x=>x.key===k))return;
    items.push({key:k,file:f,name:f.name,folder:folderOf(f),kind:kindOf(f)});n++;
  });
  if(n){status('LOCAL LIBRARY • נוספו '+n+' קבצים');renderAll()}
}
function bindInputs(){
  const folder=$('folderInput'),files=$('filesInput');
  if(folder&&!folder.dataset.lib170){folder.dataset.lib170='1';folder.addEventListener('change',e=>{addFiles(e.target.files);setTimeout(()=>{try{e.target.value=''}catch(x){}},0)})}
  if(files&&!files.dataset.lib170){files.dataset.lib170='1';files.addEventListener('change',e=>{addFiles(e.target.files);setTimeout(()=>{try{e.target.value=''}catch(x){}},0)})}
}
function pickFolder(){const x=$('folderInput');if(x){x.value='';x.click()}}
function pickFiles(){const x=$('filesInput');if(x){x.value='';x.click()}}
function categoryItems(){
  let a=items;
  if(active==='music'||active==='video'||active==='karaoke')a=a.filter(x=>x.kind===active);
  else if(active==='favorites')a=a.filter(x=>fav.has(x.key));
  else if(active==='playlist')a=queue.slice();
  else if(active==='history')a=history.map(k=>items.find(x=>x.key===k)).filter(Boolean);
  else if(active.startsWith('folder:')){const f=active.slice(7);a=a.filter(x=>x.folder===f)}
  if(search){const q=search.toLowerCase();a=a.filter(x=>(x.name+' '+x.folder).toLowerCase().includes(q))}
  return a;
}
function addHistory(it){history=[it.key,...history.filter(k=>k!==it.key)].slice(0,100)}
function loadDeck(deck,it){
  const win=w();if(!win||typeof win.load!=='function'||!it?.file)return;
  win.load(deck,it.file);addHistory(it);
  try{window.dispatchEvent(new CustomEvent('afd-local-load',{detail:{deck,item:it}}))}catch(e){}
  status('LOCAL • '+it.name+' → DECK '+deck);renderFolders();
}
function addQueue(it){if(!it||queue.some(x=>x.key===it.key))return;queue.push(it);renderQueue()}
function removeQueue(i){queue.splice(i,1);if(auto.index>=queue.length)auto.index=queue.length-1;renderQueue()}
function playDeck(deck){const doc=d();doc?.querySelector('.transport .play[data-d="'+deck+'"]')?.click()}
function setCross(deck){const doc=d(),x=doc?.getElementById('cross');if(!x)return;x.value=deck==='A'?0:100;x.dispatchEvent(new Event('input',{bubbles:true}))}
function startIndex(i){
  if(!queue.length)return;
  if(i<0||i>=queue.length){auto.running=false;renderQueue();status('AUTOMIX • הסתיים');return}
  auto.index=i;auto.deck=i%2?'B':'A';const it=queue[i];
  loadDeck(auto.deck,it);setCross(auto.deck);
  setTimeout(()=>{if(auto.running)playDeck(auto.deck)},120);
  renderQueue();status('AUTOMIX • '+(i+1)+'/'+queue.length+' • '+it.name);
}
function startAuto(){if(!queue.length){status('AUTOMIX • גרור שירים ל-SIDEVIEW');return}auto.running=true;startIndex(auto.index>=0&&auto.index<queue.length?auto.index:0)}
function stopAuto(){auto.running=false;renderQueue();status('AUTOMIX • כבוי • השיר הנוכחי ממשיך')}
function nextAuto(deck){if(!auto.running||deck!==auto.deck)return;startIndex(auto.index+1)}
function installEnded(){const doc=d();if(!doc)return;['A','B'].forEach(deck=>{const v=doc.getElementById('vid'+deck);if(v&&!v.dataset.auto170){v.dataset.auto170='1';v.addEventListener('ended',()=>nextAuto(deck))}})}

function renderFolders(){
  const doc=d(),host=doc?.getElementById('afdFolders170');if(!host)return;
  const folders=[...new Set(items.map(x=>x.folder))].sort((a,b)=>a.localeCompare(b));
  const defs=[['all','LOCAL / ALL'],['music','MUSIC'],['video','MUSIC VIDEO'],['karaoke','KARAOKE'],['favorites','★ FAVORITES'],['playlist','PLAYLIST'],['history','HISTORY']];
  host.innerHTML=defs.map(([k,n])=>'<div class="afdFolder170 '+(active===k?'active':'')+'" data-cat="'+k+'">'+n+'</div>').join('')+(folders.length?'<div class="afdFolderTitle170">COMPUTER FOLDERS</div>'+folders.map(f=>'<div class="afdFolder170 '+(active==='folder:'+f?'active':'')+'" data-folder="'+clean(f)+'">📁 '+clean(f)+'</div>').join(''):'');
  host.querySelectorAll('[data-cat]').forEach(e=>e.onclick=()=>{active=e.dataset.cat;renderAll()});
  host.querySelectorAll('[data-folder]').forEach(e=>e.onclick=()=>{active='folder:'+e.dataset.folder;renderAll()});
}
function renderTracks(){
  const doc=d(),host=doc?.getElementById('afdTracks170');if(!host)return;
  const list=categoryItems();
  host.innerHTML=list.length?list.map((it,i)=>'<div class="afdLocalRow170" draggable="true" data-key="'+clean(it.key)+'"><span>'+String(i+1).padStart(2,'0')+'</span><b title="'+clean(it.name)+'">'+clean(it.name)+'</b><span title="'+clean(it.folder)+'">'+clean(it.folder)+'</span><button data-a="A">A</button><button data-a="B">B</button><button data-side="1">＋SIDE</button><button data-fav="1" class="'+(fav.has(it.key)?'on':'')+'">★</button></div>').join(''):'<div class="afdEmpty170">אין שירים בקטגוריה הזאת.<br>לחץ OPEN FOLDER ובחר תיקייה מהמחשב.</div>';
  host.querySelectorAll('.afdLocalRow170').forEach(row=>{
    const it=items.find(x=>x.key===row.dataset.key)||queue.find(x=>x.key===row.dataset.key);if(!it)return;
    row.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();loadDeck(b.dataset.a,it)});
    row.querySelector('[data-side]')?.addEventListener('click',e=>{e.stopPropagation();addQueue(it)});
    row.querySelector('[data-fav]')?.addEventListener('click',e=>{e.stopPropagation();fav.has(it.key)?fav.delete(it.key):fav.add(it.key);saveFav();renderAll()});
    row.ondblclick=()=>loadDeck('A',it);
    row.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-afd-local-key',it.key);e.dataTransfer.setData('text/plain',it.key)});
  });
}
function renderQueue(){
  const doc=d(),host=doc?.getElementById('afdQueue170'),state=doc?.getElementById('afdAutoState170');if(!host)return;
  if(state){state.textContent=auto.running?'AUTOMIX ON':'AUTOMIX OFF';state.classList.toggle('on',auto.running)}
  host.innerHTML=queue.length?queue.map((it,i)=>'<div class="afdQ170 '+(auto.running&&i===auto.index?'playing':'')+'" draggable="true" data-i="'+i+'"><span>'+(i+1)+'</span><b>'+clean(it.name)+'</b><button data-qdeck="A">A</button><button data-qdeck="B">B</button><button data-rm="1">×</button></div>').join(''):'<div class="afdDropText170">גרור לכאן שירים מהספרייה<br>הסדר כאן הוא סדר ה-AUTOMIX</div>';
  host.querySelectorAll('.afdQ170').forEach(r=>{
    const i=+r.dataset.i,it=queue[i];
    r.querySelectorAll('[data-qdeck]').forEach(b=>b.onclick=()=>loadDeck(b.dataset.qdeck,it));
    r.querySelector('[data-rm]')?.addEventListener('click',()=>removeQueue(i));
    r.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('application/x-afd-q-index',String(i))});
    r.addEventListener('dragover',e=>e.preventDefault());
    r.addEventListener('drop',e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('application/x-afd-q-index'));if(Number.isInteger(from)&&from!==i&&queue[from]){const [x]=queue.splice(from,1);queue.splice(i,0,x);renderQueue()}});
  });
}
function renderAll(){renderFolders();renderTracks();renderQueue();installEnded()}

function mountLocal(){
  const doc=d();if(!doc)return false;
  const browser=doc.querySelector('.browser');if(!browser)return false;
  let st=doc.getElementById('afdLocal170Style');if(!st){st=doc.createElement('style');st.id='afdLocal170Style';doc.head.appendChild(st)}
  st.textContent=`.browser{display:block!important}.browserTop{height:42px!important}.browserTop button{white-space:nowrap}.library{height:270px!important;grid-template-columns:190px minmax(0,1fr) 300px!important}.folders{overflow:auto!important}.tracks{overflow:auto!important}.sideview{overflow:hidden!important;display:flex!important;flex-direction:column!important}.afdFolder170{padding:6px 7px;border-radius:4px;cursor:pointer}.afdFolder170:hover{background:#202732}.afdFolder170.active{background:#43286b!important;color:#fff!important}.afdFolderTitle170{font-size:7px;color:#7f8996;margin:10px 6px 4px}.afdTrackHead170,.afdLocalRow170{display:grid!important;grid-template-columns:34px minmax(160px,1.8fr) minmax(90px,1fr) 34px 34px 50px 30px!important;gap:5px!important;align-items:center!important;direction:ltr!important}.afdTrackHead170{position:sticky;top:0;z-index:2;padding:5px 7px;background:#181e26;color:#8995a4;font-size:7px}.afdLocalRow170{padding:5px 7px;border-bottom:1px solid #20262e;font-size:8px;cursor:grab}.afdLocalRow170:nth-child(even){background:#ffffff03}.afdLocalRow170 b,.afdLocalRow170 span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.afdLocalRow170 button,.afdQ170 button{height:22px!important;padding:0 5px!important;font-size:7px!important;border:1px solid #525c68;border-radius:3px;background:#171c22;color:#fff}.afdLocalRow170 [data-fav].on{color:#ffd75a}.afdSideTabs170{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px}.afdSideTabs170 button{height:26px;font-size:8px}.afdAutoCtl170{display:grid;grid-template-columns:1fr 1fr auto;gap:4px;margin-bottom:6px}.afdAutoCtl170 button{height:28px;font-size:8px}.afdAutoState170{font-size:7px;display:grid;place-items:center;padding:0 5px;border:1px solid #404955;border-radius:3px;color:#919dab}.afdAutoState170.on{color:#76ff9b;border-color:#2b8f4b}.afdQueue170{flex:1;min-height:0;overflow:auto;border:1px dashed #434d59;border-radius:4px;padding:4px}.afdQ170{display:grid;grid-template-columns:22px minmax(0,1fr) 26px 26px 24px;gap:4px;align-items:center;padding:5px;border-bottom:1px solid #20262d;font-size:8px;cursor:grab}.afdQ170 b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.afdQ170.playing{background:#3d275d;color:#fff}.afdDropText170,.afdEmpty170{padding:18px;text-align:center;color:#7f8a98;font-size:9px;line-height:1.6}.afdLocalSearch170{flex:1;min-width:140px;height:28px;background:#06080c;border:1px solid #3e4650;border-radius:4px;color:#fff;padding:0 9px}`;
  const top=browser.querySelector('.browserTop');
  if(top&&!top.dataset.lib170){top.dataset.lib170='1';top.innerHTML='<button id="afdOpenFolder170">📁 OPEN FOLDER</button><button id="afdAddFiles170">＋ FILES</button><button data-cat="all">LOCAL</button><button data-cat="favorites">★ FAVORITES</button><button data-cat="playlist">PLAYLIST</button><button data-cat="history">HISTORY</button><input id="afdLocalSearch170" class="afdLocalSearch170" placeholder="Search local library..."><button id="afdAutoFocus170">AUTOMIX</button>'}
  const lib=browser.querySelector('.library');
  if(lib&&!lib.dataset.lib170){lib.dataset.lib170='1';lib.innerHTML='<div id="afdFolders170" class="folders"></div><div class="tracks"><div class="afdTrackHead170"><span>#</span><span>TRACK</span><span>FOLDER</span><span>A</span><span>B</span><span>SIDE</span><span>★</span></div><div id="afdTracks170"></div></div><div class="sideview"><h4>SIDEVIEW • PLAYLIST / AUTOMIX</h4><div class="afdSideTabs170"><button class="active">AUTO / PLAYLIST</button><button id="afdClearQueue170">CLEAR</button></div><div class="afdAutoCtl170"><button id="afdAutoStart170">▶ START</button><button id="afdAutoStop170">■ STOP AUTO</button><span id="afdAutoState170" class="afdAutoState170">AUTOMIX OFF</span></div><div id="afdQueue170" class="afdQueue170"></div></div>'}
  doc.getElementById('afdOpenFolder170')?.addEventListener('click',pickFolder);
  doc.getElementById('afdAddFiles170')?.addEventListener('click',pickFiles);
  top?.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{active=b.dataset.cat;renderAll()});
  const q=doc.getElementById('afdLocalSearch170');if(q&&!q.dataset.bound){q.dataset.bound='1';q.addEventListener('input',()=>{search=q.value.trim();renderTracks()})}
  doc.getElementById('afdAutoFocus170')?.addEventListener('click',()=>doc.querySelector('.sideview')?.scrollIntoView({block:'nearest'}));
  doc.getElementById('afdAutoStart170')?.addEventListener('click',startAuto);
  doc.getElementById('afdAutoStop170')?.addEventListener('click',stopAuto);
  doc.getElementById('afdClearQueue170')?.addEventListener('click',()=>{queue=[];auto.index=-1;renderQueue()});
  const qhost=doc.getElementById('afdQueue170');if(qhost&&!qhost.dataset.drop170){qhost.dataset.drop170='1';qhost.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'});qhost.addEventListener('drop',e=>{e.preventDefault();const k=e.dataTransfer.getData('application/x-afd-local-key')||e.dataTransfer.getData('text/plain');const it=items.find(x=>x.key===k);if(it)addQueue(it)})}
  ['A','B'].forEach(deck=>{const root=doc.querySelector('.deck'+deck);if(root&&!root.dataset.drop170){root.dataset.drop170='1';root.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'});root.addEventListener('drop',e=>{e.preventDefault();const k=e.dataTransfer.getData('application/x-afd-local-key')||e.dataTransfer.getData('text/plain');const it=items.find(x=>x.key===k);if(it)loadDeck(deck,it)})}});
  const load=doc.getElementById('loadBtn');if(load&&!load.dataset.lib170){load.dataset.lib170='1';load.textContent='ADD FILES';load.onclick=e=>{e.preventDefault();pickFiles()}}
  renderAll();return true;
}
function refresh(){mountOnline();bindInputs();mountLocal();installEnded()}
window.__afdWin170={refresh,addFiles,startAuto,stopAuto,get items(){return items},get queue(){return queue}};
frame()?.addEventListener('load',()=>setTimeout(refresh,150));
refresh();setTimeout(refresh,500);setInterval(()=>{mountOnline();bindInputs();if(!d()?.getElementById('afdTracks170'))mountLocal();installEnded()},1200);
})();