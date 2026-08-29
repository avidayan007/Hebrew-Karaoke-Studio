// Hebrew Karaoke Studio Web v1.90 — cleaner header + full-width burgundy/purple/gold Studio toolbar
(function(){
  // Remove the old side branding from the top bar.
  document.querySelectorAll('header > .brand').forEach(el=>el.style.setProperty('display','none','important'));

  // Rename the software in the top bar while keeping the AFD symbol/brand.
  const header=document.querySelector('header');
  if(header){
    [...header.querySelectorAll('b')].forEach(b=>{
      if((b.textContent||'').trim()==='Hebrew Karaoke Studio') b.textContent='Avi Karaoke Studio';
    });
  }

  // Clear, full project-action labels.
  const newBtn=document.getElementById('hksNewProjectBtn');
  const openBtn=document.getElementById('hksOpenProjectBtn');
  const saveBtn=document.getElementById('saveProject');
  if(newBtn)newBtn.innerHTML='＋&nbsp; פרויקט חדש';
  if(openBtn)openBtn.innerHTML='▱&nbsp; פתח פרויקט';
  if(saveBtn)saveBtn.innerHTML='▣&nbsp; שמור פרויקט';

  const style=document.createElement('style');
  style.id='hksAfdPolish90';
  style.textContent=`
    /* Cleaner top bar: AFD brand + software name only */
    header{justify-content:flex-start!important;gap:24px!important;padding-inline:16px!important}
    header > span:not(.brand){
      margin-inline-start:auto!important;margin-inline-end:auto!important;
      text-align:center!important;line-height:1.15!important;
    }
    header > span:not(.brand) > b{font-size:18px!important;color:#f6e7bf!important;letter-spacing:.01em!important}

    /* Use the full width for the Studio toolbar, RTL, to save vertical space. */
    #hksCompactToolbar80{padding:7px!important}
    #hksToolbarRow80{
      width:100%!important;display:flex!important;flex-wrap:nowrap!important;
      direction:rtl!important;gap:6px!important;align-items:stretch!important;
      justify-content:stretch!important;
    }
    #hksToolbarRow80 > .hksTinyTool80,
    #hksToolbarRow80 > #hksProjectHomeActions,
    #hksToolbarRow80 > #hksPrimaryActions81{min-width:0!important}

    /* File buttons take equal compact slots. */
    #hksToolbarRow80 .hksTinyTool80{
      flex:1 1 0!important;min-width:0!important;width:auto!important;
      min-height:42px!important;height:42px!important;padding:5px 7px!important;
      font-size:12px!important;font-weight:900!important;border-radius:9px!important;
      color:#fff7e8!important;
      background:linear-gradient(135deg,#8e304d 0%,#7b3ca8 54%,#b98a38 100%)!important;
      border:1px solid #d9ad63!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 12px rgba(0,0,0,.28)!important;
    }

    /* New / Open / Save stay on one horizontal row and fill their space evenly. */
    #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80{
      flex:3.1 1 0!important;min-width:0!important;width:auto!important;
      display:flex!important;flex-wrap:nowrap!important;gap:6px!important;
      direction:rtl!important;margin:0!important;padding:0!important;
    }
    #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80 .gbtn{
      flex:1 1 0!important;min-width:0!important;width:auto!important;
      min-height:42px!important;height:42px!important;padding:5px 8px!important;
      font-size:12px!important;font-weight:900!important;border-radius:9px!important;
      color:#fff8ec!important;
      background:linear-gradient(135deg,#a33e58 0%,#843f9f 48%,#c69642 100%)!important;
      border:1px solid #e0b765!important;
      text-shadow:0 1px 1px rgba(0,0,0,.45)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 12px rgba(0,0,0,.28)!important;
      white-space:nowrap!important;
    }

    /* Primary actions: same row, clear contrast, not black. */
    #hksPrimaryActions81{
      flex:2.25 1 0!important;min-width:0!important;width:auto!important;
      display:flex!important;gap:6px!important;margin:0!important;padding:0!important;
      border:0!important;direction:rtl!important;
    }
    #hksPrimaryActions81 #syncBtn2,
    #hksPrimaryActions81 [data-go="export"]{
      flex:1 1 0!important;min-width:0!important;width:auto!important;
      min-height:46px!important;height:46px!important;padding:6px 9px!important;
      font-size:13px!important;font-weight:950!important;border-radius:10px!important;
      white-space:nowrap!important;
    }
    #hksPrimaryActions81 #syncBtn2{
      background:linear-gradient(135deg,#8f3ff1 0%,#963f83 58%,#bc8737 100%)!important;
      border-color:#d7a85b!important;color:#fff!important;
    }
    #hksPrimaryActions81 [data-go="export"]{
      background:linear-gradient(135deg,#b24660 0%,#873c98 42%,#d1a34b 100%)!important;
      border-color:#edc874!important;color:#fff9e9!important;
    }

    /* Slightly brighter toolbar surface so the controls do not sink into black. */
    #hksCompactToolbar80{
      background:linear-gradient(110deg,#27151d 0%,#21162e 53%,#302318 100%)!important;
      border-color:#6c4f3f!important;
      box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,228,174,.07)!important;
    }

    @media(max-width:900px){
      #hksToolbarRow80{gap:4px!important}
      #hksToolbarRow80 .hksTinyTool80{font-size:10.5px!important;padding:4px!important}
      #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80 .gbtn{font-size:10.5px!important;padding:4px 5px!important}
      #hksPrimaryActions81 #syncBtn2,#hksPrimaryActions81 [data-go="export"]{font-size:11.5px!important;padding:5px!important}
      header{gap:12px!important;padding-inline:9px!important}
      header > span:not(.brand) > b{font-size:16px!important}
    }
    @media(max-width:699px){
      #hksToolbarRow80{flex-wrap:wrap!important}
      #hksToolbarRow80 .hksTinyTool80{flex:1 1 28%!important}
      #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80{flex:1 1 100%!important}
      #hksPrimaryActions81{flex:1 1 100%!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.90';
  console.log('[v90] Cleaner header and full-width project toolbar enabled');
})();