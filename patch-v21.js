// Hebrew Karaoke Studio Web v1.25 — renderer probe only
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
})();