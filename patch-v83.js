// Hebrew Karaoke Studio Web v1.83 — compact Clear button in Lyrics
(function(){
  const clearBtn=document.getElementById('clearBtn');
  if(!clearBtn)return;
  clearBtn.textContent='נקה';
  clearBtn.classList.add('hksLyricsClear83');

  const style=document.createElement('style');
  style.id='hksLyricsClearStyle83';
  style.textContent=`
    #lyrics #clearBtn.hksLyricsClear83{
      width:auto!important;
      min-width:58px!important;
      max-width:78px!important;
      min-height:32px!important;
      height:32px!important;
      padding:3px 9px!important;
      font-size:11px!important;
      border-radius:8px!important;
      justify-self:start!important;
      flex:0 0 auto!important;
    }
  `;
  document.head.appendChild(style);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.83';
})();