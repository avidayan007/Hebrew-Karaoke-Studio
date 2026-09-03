function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v227 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
  if(typeof s!=='string')return s;
  if(file==='runtime-v225.js'){
    s=rep(s,
      "function loaded(k){try{return!!native.isLoaded?.(k)||!!D()?.getElementById('ytDeck'+k)||!!D()?.querySelector?.('#ytMaster'+k+' iframe')}catch(e){return false}}",
      "function loaded(k){try{return!!native.isLoaded?.(k)||!!D()?.getElementById('ytDeck'+k)}catch(e){return false}}",
      'ignore persistent hidden YouTube iframe for ownership');
  }
  if(file==='runtime-v215.js'){
    s=rep(s,
      "function actualOwner(k){if(window.AFDSpotifyState?.has?.(k))return'spotify';if(window.AFDYouTubeState?.isLoaded?.(k)||D()?.getElementById('ytDeck'+k))return'youtube';const v=deckVideo(k);if(window.AFDLocalDeckMeta?.[k]||(v&&(v.currentSrc||v.src)))return'local';return''}",
      "function actualOwner(k){const v=deckVideo(k),local=!!(window.AFDLocalDeckMeta?.[k]&&v&&(v.currentSrc||v.src));if(local)return'local';if(window.AFDSpotifyState?.has?.(k))return'spotify';if(window.AFDYouTubeState?.isLoaded?.(k)||D()?.getElementById('ytDeck'+k))return'youtube';if(v&&(v.currentSrc||v.src))return'local';return''}",
      'explicit Local media owns deck before stale online state');
    s=rep(s,
      "const v=deckVideo(k),m=deckMaster(k);if(!v||(!v.currentSrc&&!v.src)){status('LOCAL PLAY ERROR • אין מקור ב-DECK '+k);return false}try{if(v.ended)v.currentTime=0;await v.play();if(m&&(m.currentSrc||m.src)&&m.style.display!=='none'){try{m.currentTime=v.currentTime;await m.play()}catch(e){}}return true}catch(e){status('LOCAL PLAY ERROR • '+(e?.message||e));return false}",
      "const v=deckVideo(k),m=deckMaster(k);if(!v||(!v.currentSrc&&!v.src)){status('LOCAL PLAY ERROR • אין מקור ב-DECK '+k);return false}await waitFor(()=>!!(v.currentSrc||v.src),2500);let lastErr='';for(let attempt=0;attempt<3;attempt++){try{if(v.ended)v.currentTime=0;await v.play();if(m&&(m.currentSrc||m.src)&&m.style.display!=='none'){try{m.currentTime=v.currentTime;await m.play()}catch(e){}}if(await waitFor(()=>!v.paused&&!v.ended,1800)){status('LOCAL PLAY • DECK '+k+' • התחיל');return true}}catch(e){lastErr=String(e?.message||e||'')}await sleep(160+attempt*120)}status('LOCAL PLAY ERROR • '+(lastErr||'הנגן לא התחיל'));return false",
      'verified Local media PLAY with retry');
  }
  return s;
}
module.exports={patchText};
