// Hebrew Karaoke Studio Web v1.21 — server renderer bridge
(function(){
 const $=s=>document.querySelector(s);
 const old=$('#renderLog');
 if(old) old.textContent='בודק מנוע רינדור בשרת…';
 async function probe(){
   try{
     const r=await fetch('/api/render',{cache:'no-store'});
     if(!r.ok) throw new Error('HTTP '+r.status);
     const j=await r.json();
     if(old) old.textContent='שרת הרינדור מחובר: '+(j.service||'OK')+' — '+(j.version||'');
     window.__serverRenderer=j;
   }catch(e){
     if(old) old.textContent='שרת הרינדור עדיין לא מחובר. הרינדור המקומי לא יופעל אוטומטית כדי לא לתקוע את Safari.';
     window.__serverRenderer=null;
   }
 }
 probe();
 const b=$('#dualExportBtn');
 if(b){
   b.onclick=async()=>{
     await probe();
     if(!window.__serverRenderer){ setExportState('שרת הרינדור עדיין לא זמין — לא מפעילה את מנוע Safari התקול.',0); return; }
     setExportState('שרת הרינדור מחובר. מנוע FFmpeg השרתִי נמצא בהשלמת התקנה.',5);
   };
 }
})();