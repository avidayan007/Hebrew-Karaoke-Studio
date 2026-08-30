(()=>{
 const style=document.createElement('style');style.id='afdIpadEdge64';style.textContent=`
 html,body{margin:0!important;width:100%!important;min-height:100dvh!important;background:#020304!important;overscroll-behavior:none!important}
 body{padding:0!important}
 .wrap{width:100%!important;max-width:none!important;min-height:100dvh!important;padding-top:env(safe-area-inset-top)!important;padding-left:env(safe-area-inset-left)!important;padding-right:env(safe-area-inset-right)!important;padding-bottom:env(safe-area-inset-bottom)!important;background:#020304!important}
 .consoleFrame{display:block!important;max-width:100%!important}
 @supports(height:100svh){html,body{min-height:100svh!important}.wrap{min-height:calc(100svh - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}}
 @media(display-mode:standalone){html,body{background:#020304!important}.wrap{padding-top:max(env(safe-area-inset-top),20px)!important}}
 `;document.head.appendChild(style);
 let vp=document.querySelector('meta[name="viewport"]');if(!vp){vp=document.createElement('meta');vp.name='viewport';document.head.appendChild(vp)}vp.content='width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=yes,maximum-scale=5';
 let sb=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(!sb){sb=document.createElement('meta');sb.name='apple-mobile-web-app-status-bar-style';document.head.appendChild(sb)}sb.content='black';
 let cap=document.querySelector('meta[name="apple-mobile-web-app-capable"]');if(!cap){cap=document.createElement('meta');cap.name='apple-mobile-web-app-capable';document.head.appendChild(cap)}cap.content='yes';
})();