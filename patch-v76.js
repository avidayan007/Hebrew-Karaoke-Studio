// Hebrew Karaoke Studio Web v1.76 — smaller compact synchronization words
(function(){
  const card=document.getElementById('hksStudioSyncCard');
  if(!card)return;
  const style=document.createElement('style');
  style.id='hksCompactSyncWords76';
  style.textContent=`
    #hksStudioSyncCard #wordList{font-size:11px!important;line-height:1.15!important}
    #hksStudioSyncCard #wordList .wordrow{
      padding:3px 5px!important;
      min-height:24px!important;
      font-size:11px!important;
      line-height:1.15!important;
      grid-template-columns:30px 1fr 72px!important;
      gap:4px!important;
    }
    #hksStudioSyncCard #wordList .wordrow span{font-size:11px!important;line-height:1.15!important}
  `;
  document.head.appendChild(style);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.76';
})();