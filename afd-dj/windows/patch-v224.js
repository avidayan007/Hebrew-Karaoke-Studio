function patchText(file,s){
  if(typeof s!=='string')return s;
  if(file==='runtime-v215.js'){
    const old="try{if(typeof window.AFDYouTubeState?.play==='function')window.AFDYouTubeState.play(k);else window.dispatchEvent(new CustomEvent('afd-deck-transport',{detail:{deck:k,action:'play'}}))}catch(e){status('YOUTUBE PLAY ERROR • '+(e?.message||e));return false}";
    const next="try{if(typeof window.AFDYouTubeState?.playNow==='function')window.AFDYouTubeState.playNow(k);else{status('YOUTUBE PLAY ERROR • playNow לא נטען');return false}}catch(e){status('YOUTUBE PLAY ERROR • '+(e?.message||e));return false}";
    if(!s.includes(old))throw new Error('AFD v224 patch marker missing: runtime-v215 YouTube start');
    s=s.replace(old,next);
  }
  return s;
}
module.exports={patchText};
