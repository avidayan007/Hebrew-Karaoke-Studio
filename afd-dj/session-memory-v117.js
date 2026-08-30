(()=>{
 const DB='afd-dj-memory',STORE='handles',KEY='library-folder';
 const $=id=>document.getElementById(id),status=t=>{if($('status'))$('status').textContent=t};
 const openDB=()=>new Promise((ok,no)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
 async function put(v){const db=await openDB();return new Promise((ok,no)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).put(v,KEY);t.oncomplete=ok;t.onerror=()=>no(t.error)})}
 async function get(){const db=await openDB();return new Promise((ok,no)=>{const r=db.transaction(STORE).objectStore(STORE).get(KEY);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
 async function files(dir,path=''){let out=[];for await(const [name,h] of dir.entries()){if(h.kind==='file'){const f=await h.getFile();try{Object.defineProperty(f,'webkitRelativePath',{value:path+name})}catch(e){}out.push(f)}else if(h.kind==='directory')out.push(...await files(h,path+name+'/'))}return out}
 async function restore(){try{const h=await get();if(!h)return;let p=await h.queryPermission({mode:'read'});if(p!=='granted')return status('הספרייה האחרונה שמורה — לחץ פתח תיקייה כדי לאשר גישה');const fs=await files(h);if(typeof ingest==='function'){ingest(fs);status('הספרייה האחרונה שוחזרה אוטומטית')}}catch(e){console.warn(e)}}
 async function choose(){if(!window.showDirectoryPicker)return false;try{const h=await showDirectoryPicker({mode:'read'});await put(h);const fs=await files(h);if(typeof ingest==='function'){ingest(fs);status('הספרייה נשמרה ותיפתח גם בפעם הבאה')}return true}catch(e){if(e.name!=='AbortError')console.warn(e);return true}}
 function rememberView(){document.querySelectorAll('.tabBtn').forEach(b=>b.addEventListener('click',()=>localStorage.setItem('afdLastView',b.dataset.view)));const v=localStorage.getItem('afdLastView');if(v&&typeof viewsShow==='function')try{viewsShow(v)}catch(e){}}
 const old=$('folderBtn');if(old&&window.showDirectoryPicker)old.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();await choose()},true);
 rememberView();setTimeout(restore,700);
 window.addEventListener('beforeunload',()=>{try{const d=$('console')?.contentDocument,c=d?.getElementById('cross');if(c)localStorage.setItem('afdLastCross',c.value)}catch(e){}});
 $('console')?.addEventListener('load',()=>setTimeout(()=>{try{const d=$('console').contentDocument,c=d.getElementById('cross'),v=localStorage.getItem('afdLastCross');if(c&&v!=null){c.value=v;c.dispatchEvent(new Event('input',{bubbles:true}))}}catch(e){}},500));
})();