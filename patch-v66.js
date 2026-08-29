// Hebrew Karaoke Studio Web v1.66 — stabilize Play/Sync by preventing title hidden-state feedback loops
(function(){
  const audioEl=document.getElementById('audio');
  const slide=document.getElementById('hksSongTitleSlide');
  if(!audioEl||!slide)return;

  const proto=HTMLElement.prototype;
  const nativeHidden=Object.getOwnPropertyDescriptor(proto,'hidden');
  let internalHidden=nativeHidden?.get?.call(slide)??slide.hasAttribute('hidden');

  // Override only this title element. Once lyrics have begun, older patches may request hidden=true
  // on every timeupdate. We keep the title visually suppressed with CSS instead of mutating the
  // hidden attribute, so v1.43's MutationObserver cannot start an endless hide/show animation loop.
  try{
    Object.defineProperty(slide,'hidden',{
      configurable:true,
      enumerable:true,
      get(){return internalHidden},
      set(v){
        const wanted=!!v;
        if(document.body.classList.contains('hksTitleFinished')){
          internalHidden=true;
          return;
        }
        internalHidden=wanted;
        if(nativeHidden?.set)nativeHidden.set.call(slide,wanted);
        else wanted?slide.setAttribute('hidden',''):slide.removeAttribute('hidden');
      }
    });
  }catch(_){ }

  // Remove the aggressive inline-state patch from v1.64; CSS lock is sufficient.
  function cleanLockedTitle(){
    if(!document.body.classList.contains('hksTitleFinished'))return;
    slide.classList.remove('hksTitleEnter','hksTitleExit');
    slide.style.removeProperty('display');
    slide.style.removeProperty('visibility');
    slide.style.removeProperty('opacity');
    const frame=document.getElementById('hksSongTitleFrame');
    const text=document.getElementById('hksSongTitleText');
    [frame,text].forEach(el=>{if(!el)return;el.style.removeProperty('display');el.style.removeProperty('visibility');el.style.removeProperty('opacity')});
  }

  audioEl.addEventListener('play',cleanLockedTitle);
  audioEl.addEventListener('pause',cleanLockedTitle);
  audioEl.addEventListener('timeupdate',cleanLockedTitle);
  ['syncBtn','syncBtn2','playBtn','stopBtn','syncStopBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(cleanLockedTitle,0)));

  cleanLockedTitle();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.66';
})();
