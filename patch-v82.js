// Hebrew Karaoke Studio Web v1.82 — add a little vertical gap above Sync / Export row
(function(){
  const primary=document.getElementById('hksPrimaryActions81');
  if(!primary)return;

  const style=document.createElement('style');
  style.id='hksPrimaryActionsSpacing82';
  style.textContent=`
    #hksPrimaryActions81{
      margin-top:10px!important;
    }
    @media(max-width:699px){
      #hksPrimaryActions81{margin-top:8px!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');
  if(v)v.textContent='Web v1.82';
})();