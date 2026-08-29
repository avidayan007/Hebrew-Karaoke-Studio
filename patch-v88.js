// Hebrew Karaoke Studio Web v1.88 — dark purple/gold AFD visual theme
(function(){
  const ICON='433A5E98-4A3F-40B9-A6D0-91B22FF5B848.png?v=88';

  // Visible AFD branding inside the app, using the uploaded PNG.
  const header=document.querySelector('header');
  if(header && !document.getElementById('hksAfdBrand88')){
    const brand=document.createElement('div');
    brand.id='hksAfdBrand88';
    brand.innerHTML=`<img src="${ICON}" alt="AFD"><span><b>AFD</b><small>Avi Karaoke</small></span>`;
    header.insertBefore(brand,header.firstChild);
  }

  // Add clear symbols similar to the reference UI without changing behavior.
  const setLabel=(sel,label)=>{const el=document.querySelector(sel);if(el)el.innerHTML=label};
  setLabel('.tab[data-page="studio"]','▣&nbsp; סטודיו');
  setLabel('.tab[data-page="lyrics"]','☷&nbsp; מילים');
  setLabel('.tab[data-page="export"]','⇧&nbsp; ייצוא');
  setLabel('#hksNewProjectBtn','＋&nbsp; חדש');
  setLabel('#hksOpenProjectBtn','▱&nbsp; פתח');
  setLabel('#saveProject','▣&nbsp; שמור');
  setLabel('#syncBtn2','◆&nbsp; סנכרן');

  const style=document.createElement('style');
  style.id='hksAfdTheme88';
  style.textContent=`
    :root{
      --bg:#0b0a0e!important;
      --card:#15131a!important;
      --line:#302b39!important;
      --txt:#f4f1f7!important;
      --muted:#aaa3b2!important;
      --afd-purple:#8f3ff1;
      --afd-purple2:#b45cff;
      --afd-gold:#d8ae55;
      --afd-gold2:#f2cf79;
      --afd-black:#0a090c;
    }
    html,body{background:linear-gradient(180deg,#0b0a0e 0%,#111016 46%,#09090c 100%)!important;color:var(--txt)!important}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important}

    header{
      background:rgba(15,13,19,.97)!important;
      border-bottom:1px solid #2c2636!important;
      box-shadow:0 8px 28px rgba(0,0,0,.32)!important;
      min-height:64px!important;
      gap:14px!important;
    }
    #hksAfdBrand88{display:flex;align-items:center;gap:9px;direction:ltr;min-width:max-content}
    #hksAfdBrand88 img{width:48px;height:48px;border-radius:11px;object-fit:cover;box-shadow:0 0 0 1px rgba(216,174,85,.62),0 5px 18px rgba(0,0,0,.45)}
    #hksAfdBrand88 span{display:flex;flex-direction:column;line-height:1.05;color:#fff}
    #hksAfdBrand88 b{font-size:18px;letter-spacing:.08em;color:var(--afd-gold2)}
    #hksAfdBrand88 small{font-size:11px;color:#c7c0cd;margin-top:4px}
    header>.brand{color:var(--afd-gold)!important;font-size:12px!important}
    header .version{color:#9d94a7!important}

    .tabs{background:#0d0c10!important;border-bottom:1px solid #27222e!important;gap:4px!important;padding:6px 8px!important}
    .tab{background:transparent!important;color:#aaa3b2!important;border:1px solid transparent!important;box-shadow:none!important;border-radius:8px!important;min-height:38px!important}
    .tab:hover{background:#17141d!important;color:#eee9f2!important}
    .tab.on{background:linear-gradient(180deg,rgba(143,63,241,.24),rgba(143,63,241,.10))!important;color:#c58cff!important;border-color:rgba(180,92,255,.32)!important;box-shadow:inset 0 -2px 0 var(--afd-purple)!important}

    .page{background:transparent!important}
    .card{background:linear-gradient(180deg,#17151c 0%,#121116 100%)!important;border:1px solid #302b39!important;box-shadow:0 8px 24px rgba(0,0,0,.22)!important}
    .card h3{color:#f4eff8!important;letter-spacing:.01em!important}
    .small{color:#aaa3b2!important}

    .gbtn{
      background:linear-gradient(180deg,#24202b,#17141d)!important;
      border:1px solid #40374b!important;
      color:#f5f1f7!important;
      box-shadow:0 4px 12px rgba(0,0,0,.28)!important;
      transition:.15s ease!important;
    }
    .gbtn:active{transform:translateY(1px)!important;filter:brightness(1.08)!important}
    .gbtn.blue,.gbtn.purple,#syncBtn2,[data-go="export"],#dualExportBtn{
      background:linear-gradient(180deg,#9b4cf4,#6d2ec5)!important;
      border-color:#b96dff!important;
      box-shadow:0 5px 17px rgba(133,55,225,.30)!important;
    }
    .gbtn.green{background:linear-gradient(180deg,#29242f,#1a1720)!important;border-color:#51465d!important}
    .gbtn.gold{background:linear-gradient(180deg,#c79a42,#8b6424)!important;border-color:#e1bd6a!important;color:#130f07!important}
    .gbtn.red{background:linear-gradient(180deg,#572a35,#351921)!important;border-color:#8a4455!important}

    #hksProjectHomeActions,#hksToolbarRow80,#hksPrimaryActions81{background:transparent!important}
    #hksPrimaryActions81{border-inline-start-color:#3a3045!important}
    #hksPrimaryActions81 #syncBtn2{color:#fff!important}

    textarea,.nativePicker,select,input[type="text"],input[type="number"]{
      background:#0d0c11!important;color:#f4f1f7!important;border-color:#3b3346!important;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.015)!important;
    }
    textarea:focus,.nativePicker:focus,select:focus,input:focus{outline:none!important;border-color:#8f3ff1!important;box-shadow:0 0 0 2px rgba(143,63,241,.16)!important}

    .preview{background:#08070a!important;border-color:#3a3343!important;box-shadow:0 10px 30px rgba(0,0,0,.35)!important}
    .brandL,.brandR{color:var(--afd-gold2)!important;text-shadow:1px 1px #000,-1px -1px #000!important}
    .wave{background:#0b0910!important;border:1px solid #2f2839!important}
    audio{accent-color:var(--afd-purple)!important}
    progress{accent-color:var(--afd-purple)!important}
    #exportProgress::-webkit-progress-value{background:linear-gradient(90deg,#7d35d7,#b45cff)!important;border-radius:99px!important}
    #exportProgress::-webkit-progress-bar{background:#1a1720!important;border-radius:99px!important}

    #hksStudioSyncCard{border-color:#352e40!important}
    #hksStudioSyncCard #wordList{background:#0d0c11!important;border:1px solid #2e2837!important;border-radius:9px!important}
    #wordList.hksSyncLyrics .hksSyncWord{color:#f0edf3!important}
    #wordList.hksSyncLyrics .hksSyncWord.done{color:#b765ff!important}
    #wordList.hksSyncLyrics .hksSyncWord.current{color:var(--afd-gold2)!important;background:rgba(216,174,85,.09)!important;text-shadow:0 0 10px rgba(216,174,85,.18)!important}
    #hksSyncFontControls85{background:#111015!important;border:1px solid #30293a!important;border-radius:8px!important;color:#aaa3b2!important}
    #hksSyncFontControls85 button{background:#1d1923!important;color:#d8cde2!important;border:1px solid #43384f!important;border-radius:7px!important}
    #hksSyncFontValue85{color:#c58cff!important}

    .status{background:rgba(12,10,15,.96)!important;color:#bdb6c5!important;border-top:1px solid #28222f!important}
    .exportNote{background:#0d0c11!important;border-color:#302a39!important}
    .exportResults a{background:linear-gradient(180deg,#9548ee,#6d2ec5)!important}

    @media(max-width:699px){
      header{min-height:56px!important;padding:5px 8px!important;gap:7px!important}
      #hksAfdBrand88 img{width:40px;height:40px!important}
      #hksAfdBrand88 b{font-size:15px!important}
      #hksAfdBrand88 small{font-size:9px!important}
      header>.brand{display:none!important}
    }
  `;
  document.head.appendChild(style);

  const v=document.querySelector('.version');if(v)v.textContent='Web v1.88';
  console.log('[v88] AFD dark purple/gold theme enabled');
})();