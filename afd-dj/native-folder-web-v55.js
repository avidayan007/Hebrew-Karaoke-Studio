(()=>{
 const $=id=>document.getElementById(id);
 const nativeItems=[];
 function status(t){const s=$('status');if(s)s.textContent=t}
 function render(items){
   const rows=$('rows'); if(!rows)return;
   nativeItems.splice(0,nativeItems.length,...items);
   rows.innerHTML='';
   items.forEach((x,i)=>{
     const r=document.createElement('div');r.className='row';r.dataset.nativeIndex=i;
     const type=(x.name.split('.').pop()||'').toUpperCase();
     r.innerHTML=`<span>${i+1}</span><b title="${x.name.replaceAll('"','&quot;')}">${x.name}</b><span>iCloud / Files</span><span>${type}</span><span class="afdBpm">—</span><button data-native-load="A">LOAD A</button><button data-native-load="B">LOAD B</button><button class="afdAutoBtn">AUTO</button><button class="fav">☆</button>`;
     rows.appendChild(r);
   });
   status(`תיקייה מחוברת • ${items.length} קבצים`);
 }
 window.AFDNativeFolderFiles=items=>{if(Array.isArray(items))render(items)};
 document.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-native-load]');if(!b)return;
   const row=b.closest('.row'),item=nativeItems[+row?.dataset.nativeIndex];if(!item)return;
   status(`${item.name} מוכן • LOAD ${b.dataset.nativeLoad}`);
   window.webkit?.messageHandlers?.afdNative?.postMessage({action:'loadMedia',deck:b.dataset.nativeLoad,path:item.path,name:item.name});
 },true);
})();