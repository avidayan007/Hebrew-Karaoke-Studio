function rep(s,a,b,label){if(!s.includes(a))throw new Error('AFD v226 patch marker missing: '+label);return s.replace(a,b)}
function patchText(file,s){
  if(typeof s!=='string')return s;
  if(file==='runtime-v206.js'){
    s=rep(s,
      "async function loadAny(k,it){if(!it||!['A','B'].includes(k))return false;",
      "async function loadAny(k,it){const unified=window.__afd215?.loadDeck||window.__afdUnified215?.loadDeck;if(unified)return unified(k,it);if(!it||!['A','B'].includes(k))return false;",
      'runtime206 unified Side View loader');
  }
  if(file==='runtime-v225.js'){
    s=rep(s,'setInterval(refresh,140);','setInterval(refresh,300);','runtime225 polling');
  }
  if(file==='runtime-v220.js'){
    s=rep(s,'setInterval(refresh,220);','setInterval(refresh,450);','runtime220 polling');
  }
  if(file==='runtime-v212.js'){
    s=rep(s,"setInterval(()=>{paintClock('A');paintClock('B')},200);","setInterval(()=>{paintClock('A');paintClock('B')},250);",'runtime212 clock polling');
  }
  return s;
}
module.exports={patchText};
