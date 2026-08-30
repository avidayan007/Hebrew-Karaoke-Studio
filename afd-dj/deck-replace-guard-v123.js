(()=>{
 const frame=()=>document.getElementById('console'),doc=()=>{try{return frame()?.contentDocument}catch(e){return null}};
 function playing(deck){const d=doc(),m=d?.getElementById('vid'+deck);if(m&&!m.paused&&!m.ended&&m.readyState>1)return true;const y=d?.getElementById('ytDeck'+deck);if(y&&y.style.display!=='none')return true;return false}
 function ask(deck){return !playing(deck)||confirm(`Deck ${deck} מתנגן כרגע.\nהאם אתה בטוח שאתה רוצה להחליף את השיר?\n\nהשיר ימשיך להתנגן עד שתאשר.`)}
 document.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const deck=b.dataset.d;if(deck!=='A'&&deck!=='B')return;if(!playing(deck))return;if(b.dataset.afdConfirmed123==='1'){delete b.dataset.afdConfirmed123;return}e.preventDefault();e.stopImmediatePropagation();if(ask(deck)){b.dataset.afdConfirmed123='1';queueMicrotask(()=>b.click())}},true);
 window.addEventListener('afd-online-drag-load',e=>{const deck=e.detail?.deck;if((deck==='A'||deck==='B')&&!ask(deck)){e.preventDefault();e.stopImmediatePropagation()}},true);
})();