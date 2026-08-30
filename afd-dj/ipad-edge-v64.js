(()=>{
 const style=document.createElement('style');style.id='afdIpadEdge64';style.textContent=`
 html,body{margin:0!important;width:100%!important;min-height:100dvh!important;background:#020304!important;overscroll-behavior:none!important}
 body{padding:0!important}
 .wrap{width:100%!important;max-width:none!important;min-height:100dvh!important;padding-top:0!important;padding-left:env(safe-area-inset-left)!important;padding-right:env(safe-area-inset-right)!important;padding-bottom:env(safe-area-inset-bottom)!important;background:#020304!important}
 @supports(height:100svh){html,body,.wrap{min-height:100svh!important}}
 @media(display-mode:standalone){html,body{background:#020304!important}.wrap{min-height:100dvh!important}}
 `;document.head.appendChild(style);
 let vp=document.querySelector('meta[name="viewport"]');if(!vp){vp=document.createElement('meta');vp.name='viewport';document.head.appendChild(vp)}vp.content='width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=yes,maximum-scale=5';
 let sb=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(!sb){sb=document.createElement('meta');sb.name='apple-mobile-web-app-status-bar-style';document.head.appendChild(sb)}sb.content='black-translucent';
 let cap=document.querySelector('meta[name="apple-mobile-web-app-capable"]');if(!cap){cap=document.createElement('meta');cap.name='apple-mobile-web-app-capable';document.head.appendChild(cap)}cap.content='yes';
})();