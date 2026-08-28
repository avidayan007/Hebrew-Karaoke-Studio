// Hebrew Karaoke Studio Web v1.46 — direct numeric font-size entry for all size controls
(function(){
  const configs=[
    {valueId:'hksFontValue',minusId:'hksFontMinus',plusId:'hksFontPlus',inputId:'hksFontNumber',min:18,max:110,label:'גודל מילות הקריוקי'},
    {valueId:'hksCornerBrandSizeValue',minusId:'hksCornerBrandMinus',plusId:'hksCornerBrandPlus',inputId:'hksCornerBrandNumber',min:8,max:48,label:'גודל הכיתוב בצדדים'},
    {valueId:'hksSongTitleSize',minusId:'hksSongTitleMinus',plusId:'hksSongTitlePlus',inputId:'hksSongTitleNumber',min:28,max:140,label:'גודל שם השיר'}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .hksDirectSizeInput{
      width:58px!important;height:32px!important;min-height:32px!important;box-sizing:border-box;
      padding:0 4px!important;margin:0!important;border:1px solid #7890a5!important;border-radius:7px!important;
      background:#20364a!important;color:#fff!important;font-size:13px!important;font-weight:900!important;
      text-align:center!important;direction:ltr!important;
    }
    .hksDirectSizeInput:focus{outline:2px solid #45a5e8;outline-offset:1px}
    .hksSizeUnit{font-size:10px;font-weight:800;opacity:.82;margin-inline-start:-2px}
    #hksFontValue,#hksCornerBrandSizeValue,#hksSongTitleSize{display:none!important}
    @media(max-width:520px){.hksDirectSizeInput{width:54px!important}}
  `;
  document.head.appendChild(style);

  function numericText(el){
    const m=String(el?.textContent||'').match(/-?\d+/);
    return m?Number(m[0]):NaN;
  }

  for(const cfg of configs){
    const value=document.getElementById(cfg.valueId);
    const minus=document.getElementById(cfg.minusId);
    const plus=document.getElementById(cfg.plusId);
    if(!value||!minus||!plus)continue;

    let input=document.getElementById(cfg.inputId);
    if(!input){
      input=document.createElement('input');
      input.type='number';
      input.id=cfg.inputId;
      input.className='hksDirectSizeInput';
      input.min=String(cfg.min);
      input.max=String(cfg.max);
      input.step='1';
      input.inputMode='numeric';
      input.setAttribute('aria-label',cfg.label);
      input.title='אפשר להקליד את הגודל ישירות';
      value.insertAdjacentElement('afterend',input);
      const unit=document.createElement('span');
      unit.className='hksSizeUnit';unit.textContent='px';
      input.insertAdjacentElement('afterend',unit);
    }

    const syncField=()=>{
      const n=numericText(value);
      if(Number.isFinite(n)&&document.activeElement!==input)input.value=String(n);
    };
    syncField();

    // Keep the editable number synchronized when A-/A+ are used.
    minus.addEventListener('click',()=>setTimeout(syncField,0));
    plus.addEventListener('click',()=>setTimeout(syncField,0));

    // The original controls already own the real size state. Reuse them so direct typing
    // updates the same state, localStorage and title export without duplicating logic.
    const commit=()=>{
      let target=Math.round(Number(input.value));
      if(!Number.isFinite(target)){syncField();return}
      target=Math.max(cfg.min,Math.min(cfg.max,target));
      let current=numericText(value);
      if(!Number.isFinite(current)){current=target}
      const button=target>current?plus:minus;
      const count=Math.abs(target-current);
      for(let i=0;i<count;i++)button.click();
      input.value=String(target);
      try{setStatus(cfg.label+': '+target+'px')}catch(_){}
    };

    input.addEventListener('change',commit);
    input.addEventListener('blur',commit);
    input.addEventListener('keydown',e=>{
      // Do not let global karaoke keyboard shortcuts interfere while editing a size.
      e.stopPropagation();
      if(e.key==='Enter'){e.preventDefault();commit();input.blur()}
    });
    input.addEventListener('keyup',e=>e.stopPropagation());
  }

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.46';
})();
