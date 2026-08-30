(()=>{
 const DB='afd-dj-memory',STORE='handles',KEY='library-folder';
 const $=id=>document.getElementById(id),status=t=>{if($('status'))$('status').textContent=t};
 let restoring=false,lastRestore=0;
 const openDB=()=>new Promise((ok,no)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
 async function put(v){const db=await openDB();return new Promise((ok,no)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).put(v,KEY);t.oncomplete=()=>ok();t.onerror=()=>no(t.error)})}
 async function get(){const db=await openDB();return new Promise((ok,no)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).get(KEY);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
 async function files(dir,path=''){let out=[];for await(const [name,h] of dir.entries()){if(h.kind==='file'){const f=await h.getFile();try{Object.defineProperty(f,'webkitRelativePath',{value:path+name})}catch(e){}out.push(f)}else if(h.kind==='directory')out.push(...await files(h,path+name+'/'))}return out}
 function hasLibrary(){try{return Array.isArray(library)&&library.length>0}catch(e){return false}}
 async function restore(force=false){
  if(restoring||(!force&&Date.now()-lastRestore<1500)||hasLibrary())return;
  restoring=true;lastRestore=Date.now();
  try{
   if(window.AFDNative){status('משחזר את הספרייה האחרונה…');return}
   const h=await get();if(!h)return;
   const p=await h.queryPermission({mode:'read'});
   if(p!=='granted'){status('התיקייה האחרונה זכורה — לחץ פתח תיקייה פעם אחת כדי לאשר גישה');return}
   const fs=await files(h);if(typeof ingest==='function'&&fs.length){ingest(fs);status(`הספרייה האחרונה שוחזרה אוטומטית • ${fs.length} קבצים`)}
  }catch(e){console.warn('AFD library restore',e)}finally{restoring=false}
 }
 async function choose(){
  if(!window.showDirectoryPicker)return false;
  try{
   let h=await get();
   if(h){try{let p=await h.queryPermission({mode:'read'});if(p!=='granted'&&h.requestPermission)p=await h.requestPermission({mode:'read'});if(p==='granted'){const fs=await files(h);if(typeof ingest==='function'){ingest(fs);status(`הספרייה האחרונה חזרה • ${fs.length} קבצים`)}return true}}catch(e){}}
   h=await showDirectoryPicker({mode:'read'});await put(h);const fs=await files(h);if(typeof ingest==='function'){ingest(fs);status(`הספרייה נשמרה • ${fs.length} קבצים • תיפתח אוטומטית בפעם הבאה`)}return true
  }catch(e){if(e.name!=='AbortError')console.warn(e);return true}
 }
 function rememberView(){document.querySelectorAll('.tabBtn').forEach(b=>b.addEventListener('click',()=>localStorage.setItem('afdLastView',b.dataset.view)));const v=localStorage.getItem('afdLastView');if(v&&typeof viewsShow==='function')try{viewsShow(v)}catch(e){}}
 function bindFolder(){const old=$('folderBtn');if(!old||old.dataset.afdMemory128)return;old.dataset.afdMemory128='1';if(window.showDirectoryPicker)old.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();await choose()},true)}
 rememberView();bindFolder();
 setTimeout(()=>restore(true),900);setTimeout(()=>restore(),2600);
 window.addEventListener('pageshow',()=>setTimeout(()=>restore(),250));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(()=>restore(),350)});
 new MutationObserver(()=>bindFolder()).observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener('beforeunload',()=>{try{const d=$('console')?.contentDocument,c=d?.getElementById('cross');if(c)localStorage.setItem('afdLastCross',c.value)}catch(e){}});
 $('console')?.addEventListener('load',()=>setTimeout(()=>{try{const d=$('console').contentDocument,c=d.getElementById('cross'),v=localStorage.getItem('afdLastCross');if(c&&v!=null){c.value=v;c.dispatchEvent(new Event('input',{bubbles:true}))}}catch(e){}},500));
})();