(()=>{
 const F=()=>document.getElementById('console'),D=()=>{try{return F()?.contentDocument||null}catch(e){return null}};
 const state={A:null,B:null,active:null};
 function mk(){try{return window.MusicKit?.getInstance?.()||null}catch(e){return null}}
 function findPlay(d,deck){const panel=d.getElementById('vid'+deck)?.closest('.panel')||d.querySelector('.deck'+deck);if(!panel)return null;return panel.querySelector('[id="play'+deck+'"],.play,button[data-action="play"]')}
 function findSeek(d,deck){const panel=d.getElementById('vid'+deck)?.closest('.panel')||d.querySelector('.deck'+deck);return panel?.querySelector('input[type="range"][id*="seek"],input[type="range"].seek')||null}
 async function activate(deck){const m=mk(),s=state[deck];if(!m||!s)return false;if(state.active!==deck){await m.setQueue({song:s.id});state.active=deck}return true}
 async function toggle(deck){try{const m=mk();if(!m||!state[deck])return;await activate(deck);if(m.playerState===2||m.playerState==='playing')await m.pause();else await m.play()}catch(e){console.warn('Apple deck play',e)}}
 function bind(){const d=D();if(!d)return;['A','B'].forEach(deck=>{const p=findPlay(d,deck);if(p&&!p.dataset.afdAM78){p.dataset.afdAM78='1';p.addEventListener('click',e=>{if(!state[deck])return;e.preventDefault();e.stopImmediatePropagation();toggle(deck)},true)}const seek=findSeek(d,deck);if(seek&&!seek.dataset.afdAM78){seek.dataset.afdAM78='1';seek.addEventListener('change',async()=>{if(!state[deck])return;const m=mk();if(!m)return;await activate(deck);const dur=+m.currentPlaybackDuration||0;if(dur){const max=+seek.max||100;m.seekToTime(dur*(+seek.value/max))}},true)}})}
 window.addEventListener('afd-apple-load',e=>{const x=e.detail||{};if(!x.deck||!x.item)return;state[x.deck]=x.item;state.active=x.deck;setTimeout(bind,50)});
 F()?.addEventListener('load',()=>setTimeout(bind,900));setInterval(bind,1200);
})();