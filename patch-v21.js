// Hebrew Karaoke Studio Web v1.24 — renderer probe + WMV PCM patch loader
(function(){
 const $=s=>document.querySelector(s);
 const log=$('#renderLog');
 async function probe(){
   try{
     const r=await fetch('/api/render',{cache:'no-store'});
     if(!r.ok) throw new Error('HTTP '+r.status);
     const j=await r.json();
     window.__serverRenderer=j;
     if(log) log.textContent+='\nבדיקת שרת: '+(j.service||'API')+' זמין. הרינדור עצמו מופעל מקומית במכשיר.';
   }catch(e){
     window.__serverRenderer=null;
     if(log) log.textContent+='\nבדיקת שרת לא זמינה — ממשיך עם מנוע FFmpeg המקומי.';
   }
 }
 probe();
 import('./patch-v24.js?v=24').catch(e=>{if(log)log.textContent+='\nשגיאה בטעינת הגדרות WMV PCM: '+(e?.message||e);});
})();