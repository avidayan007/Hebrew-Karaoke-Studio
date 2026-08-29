// Hebrew Karaoke Studio Web v1.89 — larger AFD branding and larger gold Studio toolbar controls
(function(){
  const style=document.createElement('style');
  style.id='hksAfdPolish89';
  style.textContent=`
    /* Bigger AFD brand inside the app */
    #hksAfdBrand88{gap:12px!important}
    #hksAfdBrand88 img{
      width:66px!important;height:66px!important;border-radius:14px!important;
      box-shadow:0 0 0 2px rgba(242,207,121,.78),0 7px 24px rgba(0,0,0,.48)!important;
    }
    #hksAfdBrand88 b{font-size:22px!important;letter-spacing:.10em!important;color:#f2cf79!important}
    #hksAfdBrand88 small{font-size:12px!important;color:#e0c98f!important;margin-top:5px!important}
    header{min-height:78px!important}

    /* Slightly larger top-left Studio tools */
    #hksCompactToolbar80{padding:8px!important}
    #hksToolbarRow80{gap:7px!important}
    #hksToolbarRow80 .hksTinyTool80,
    #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80 .gbtn{
      min-width:78px!important;min-height:38px!important;height:38px!important;
      padding:5px 11px!important;font-size:12px!important;font-weight:850!important;
      border-radius:9px!important;
      background:linear-gradient(180deg,#e2bd67 0%,#b4822e 58%,#80591d 100%)!important;
      border:1px solid #f1cf79!important;
      color:#171006!important;
      text-shadow:0 1px 0 rgba(255,255,255,.18)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 4px 12px rgba(0,0,0,.3)!important;
    }
    #hksToolbarRow80 .hksTinyTool80:active,
    #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80 .gbtn:active{
      background:linear-gradient(180deg,#c99f48,#8b621f)!important;
    }

    /* Sync + Export are primary actions: larger and stronger gold/purple contrast */
    #hksPrimaryActions81 #syncBtn2,
    #hksPrimaryActions81 [data-go="export"],
    #hksToolbarRow80 .hksPrimaryTool80{
      min-height:48px!important;height:48px!important;
      min-width:120px!important;padding:7px 16px!important;
      font-size:15px!important;font-weight:900!important;border-radius:11px!important;
    }
    #hksPrimaryActions81 [data-go="export"],
    #hksToolbarRow80 .hksExportTool80{
      background:linear-gradient(180deg,#efcc78 0%,#c7953d 55%,#906625 100%)!important;
      border-color:#f5d98d!important;color:#171006!important;
      box-shadow:0 6px 18px rgba(216,174,85,.24),inset 0 1px 0 rgba(255,255,255,.25)!important;
    }
    #hksPrimaryActions81 #syncBtn2,
    #hksToolbarRow80 #syncBtn2.hksPrimaryTool80{
      background:linear-gradient(180deg,#a956ff,#7c35d8)!important;
      border-color:#c77cff!important;color:#fff!important;
      min-width:128px!important;
    }

    /* Keep the row readable rather than black */
    #hksCompactToolbar80{
      background:linear-gradient(180deg,#1b171e,#121014)!important;
      border-color:#4b3a24!important;
      box-shadow:0 7px 22px rgba(0,0,0,.26),inset 0 1px 0 rgba(242,207,121,.04)!important;
    }

    @media(max-width:699px){
      header{min-height:68px!important}
      #hksAfdBrand88 img{width:54px!important;height:54px!important}
      #hksAfdBrand88 b{font-size:18px!important}
      #hksAfdBrand88 small{font-size:10px!important}
      #hksToolbarRow80 .hksTinyTool80,
      #hksToolbarRow80 #hksProjectHomeActions.hksProjectTools80 .gbtn{
        min-width:68px!important;min-height:36px!important;height:36px!important;font-size:11px!important;padding:4px 8px!important;
      }
      #hksPrimaryActions81 #syncBtn2,
      #hksPrimaryActions81 [data-go="export"],
      #hksToolbarRow80 .hksPrimaryTool80{
        min-width:100px!important;min-height:44px!important;height:44px!important;font-size:14px!important;padding:6px 11px!important;
      }
    }
  `;
  document.head.appendChild(style);
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.89';
  console.log('[v89] Larger AFD brand and gold Studio toolbar enabled');
})();