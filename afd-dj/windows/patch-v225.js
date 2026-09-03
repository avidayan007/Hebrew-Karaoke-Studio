function patchText(file,s){
  if(typeof s!=='string')return s;
  if(file==='runtime-v215.js'){
    const old="try{if(typeof window.AFDYouTubeState?.play==='function')window.AFDYouTubeState.play(k);else window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'play'}}))}catch(e){status('YOUTUBE PLAY ERROR • '+(e?.message||e));return false}";
    const next="try{const fn=window.AFDYouTubeState?.playNow;if(typeof fn!=='function'){status('YOUTUBE PLAY ERROR • playNow bridge לא נטען');return false}const kicked=await Promise.resolve(fn(k));if(kicked===false){status('YOUTUBE PLAY ERROR • PLAY לא התחיל');return false}}catch(e){status('YOUTUBE PLAY ERROR • '+(e?.message||e));return false}";
    if(!s.includes(old))throw new Error('AFD v225 patch marker missing: runtime-v215 YouTube start');
    s=s.replace(old,next);
  }
  return s;
}
module.exports={patchText};
