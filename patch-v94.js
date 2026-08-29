// Avi Karaoke Studio Web v1.94 — distinct gold and purple button palette
(function(){
  const style=document.createElement('style');
  style.id='hksGoldPurpleButtons94';
  style.textContent=`
    /* GOLD: Background, New Project, Save Project, Export */
    #hksToolbarRow80 .hksTinyTool80:nth-of-type(2),
    #hksNewProjectBtn,
    #saveProject,
    #hksPrimaryActions81 [data-go="export"],
    [data-go="export"].gbtn{
      background:linear-gradient(145deg,#6f3f09 0%,#b87516 35%,#e2b34f 62%,#8a500d 100%)!important;
      border:1px solid #f0cb70!important;color:#fff8df!important;
      box-shadow:inset 0 1px 0 rgba(255,244,194,.38),0 4px 12px rgba(110,66,8,.30)!important;
    }
    /* PURPLE: Song, Video, Open Project */
    #hksToolbarRow80 .hksTinyTool80:nth-of-type(1),
    #hksToolbarRow80 .hksTinyTool80:nth-of-type(3),
    #hksOpenProjectBtn{
      background:linear-gradient(145deg,#35123f 0%,#672273 38%,#9a3fb4 67%,#4a1757 100%)!important;
      border:1px solid #c568db!important;color:#fff5ff!important;
      box-shadow:inset 0 1px 0 rgba(255,220,255,.22),0 4px 12px rgba(78,24,92,.28)!important;
    }
    /* Sync remains a strong purple action inside the sync panel. */
    #hksSyncTopRow92 #syncBtn2{
      background:linear-gradient(145deg,#3a1249 0%,#752889 43%,#a945c4 72%,#571965 100%)!important;
      border:1px solid #d17be4!important;color:#fff!important;
    }
    /* Give the file/project symbols a warm metallic accent on gold buttons. */
    #hksNewProjectBtn,#saveProject,#hksPrimaryActions81 [data-go="export"]{text-shadow:0 1px 2px rgba(38,20,0,.75)!important}
  `;
  document.head.appendChild(style);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.94';
  console.log('[v94] Gold and purple Studio buttons enabled');
})();