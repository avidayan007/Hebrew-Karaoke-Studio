(()=>{
 const F=()=>document.getElementById('console'),D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
 const state={A:{remote:false,paused:false},B:{remote:false,paused:false}};
 let approved=null,approvedAt=0;
 function localPlaying(deck){const m=D()?.getElementById('vid'+deck);return !!(m&&m.src&&!m.paused&&!m.ended&&m.readyState>0)}
 function ytLoaded(deck){return !!D()?.getElementById('ytDeck'+deck)}
 function title(deck){return (D()?.getElementById('title'+deck)?.textContent||'').trim()}
 function playing(deck){if(localPlaying(deck))return true;if(ytLoaded(deck))return !state[deck].paused;if(state[deck].remote)return !state[deck].paused;return false}
 function ask(deck){if(!playing(deck))return true;const name=title(deck);return window.confirm('⚠️ Deck '+deck+' מנגן עכשיו'+(name?'\n"'+name+'"':'')+'\n\nהאם אתה בטוח שאתה רוצה להחליף את השיר בדק הזה?\nהשיר שמתנגן ייעצר.')}
 window.AFDDeckGuard=deck=>{deck=String(deck||'').toUpperCase();if(deck!=='A'&&deck!=='B')return true;const now=Date.now();if(approved===deck&&now-approvedAt<1200){approved=null;return true}return ask(deck)};
 function deckFromTarget(t){const b=t?.closest?.('[data-d]');const d=(b?.dataset?.d||'').toUpperCase();return d==='A'||d==='B'?d:null}
 document.addEventListener('pointerdown',e=>{const deck=deckFromTarget(e.target);if(!deck||!playing(deck))return;if(ask(deck)){approved=deck;approvedAt=Date.now();return}e.preventDefault();e.stopImmediatePropagation()},{capture:true});
 document.addEventListener('click',e=>{const deck=deckFromTarget(e.target);if(!deck)return;const now=Date.now();if(approved===deck&&now-approvedAt<1200){approved=null;return}if(!playing(deck))return;if(!ask(deck)){e.preventDefault();e.stopImmediatePropagation()}},{capture:true});
 window.addEventListener('afd-deck-transport',e=>{const d=(e.detail?.deck||'').toUpperCase(),a=e.detail?.action;if(!state[d])return;if(a==='pause'||a==='stop')state[d].paused=true;if(a==='play'){state[d].remote=true;state[d].paused=false}});
 window.addEventListener('afd-local-load',e=>{const d=(e.detail?.deck||'').toUpperCase();if(state[d]){state[d].remote=false;state[d].paused=false}});
 window.addEventListener('afd-apple-transport',e=>{const d=(e.detail?.deck||'').toUpperCase(),a=e.detail?.action;if(!state[d])return;state[d].remote=true;state[d].paused=a==='pause'||a==='stop'});
 function scan(){const d=D();if(!d)return;['A','B'].forEach(k=>{const m=d.getElementById('vid'+k);if(m&&!m.dataset.afdProtect123){m.dataset.afdProtect123='1';m.addEventListener('play',()=>{state[k].remote=false;state[k].paused=false});m.addEventListener('pause',()=>{if(!ytLoaded(k))state[k].paused=true});m.addEventListener('ended',()=>state[k].paused=true)}})}
 F()?.addEventListener('load',()=>setTimeout(scan,150));setInterval(scan,1200);scan();
})();