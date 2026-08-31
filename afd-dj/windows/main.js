const {app,BrowserWindow,shell,session}=require('electron');

app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');

const DESIGN_WIDTH=1600;
const DESIGN_HEIGHT=950;
const MIN_ZOOM=0.55;
const MAX_ZOOM=1.40;
const ZOOM_STEP=0.10;

function clamp(n,min,max){return Math.max(min,Math.min(max,n));}

function create(){
  const w=new BrowserWindow({
    width:1600,
    height:950,
    minWidth:900,
    minHeight:600,
    backgroundColor:'#05070b',
    title:'AFD DJ',
    autoHideMenuBar:true,
    webPreferences:{contextIsolation:true,nodeIntegration:false,webSecurity:true}
  });

  let manualZoom=1;
  let resizeTimer=null;

  function fitForScreen(){
    const b=w.getContentBounds();
    return clamp(Math.min(1,b.width/DESIGN_WIDTH,b.height/DESIGN_HEIGHT),MIN_ZOOM,1);
  }

  function applyZoom(){
    const factor=clamp(fitForScreen()*manualZoom,MIN_ZOOM,MAX_ZOOM);
    w.webContents.setZoomFactor(factor);
    w.webContents.executeJavaScript(`window.dispatchEvent(new Event('resize'));`,true).catch(()=>{});
  }

  function changeZoom(delta){
    manualZoom=clamp(Math.round((manualZoom+delta)*100)/100,0.65,1.55);
    applyZoom();
  }

  function resetZoom(){
    manualZoom=1;
    applyZoom();
  }

  function injectResponsiveFix(){
    const js=`(()=>{
      const id='afdWindowsResponsiveV162';
      let s=document.getElementById(id);
      if(!s){s=document.createElement('style');s.id=id;document.head.appendChild(s);}
      s.textContent=\`
        html,body{width:100%!important;height:100%!important;min-width:0!important;margin:0!important;overflow:hidden!important}
        .wrap{--afd-dock-height:34dvh;width:100%!important;height:100dvh!important;min-width:0!important;display:grid!important;grid-template-rows:minmax(0,1fr) 12px var(--afd-dock-height)!important;overflow:hidden!important}
        .consoleFrame{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;display:block!important}
        #afdDockResizeHandle{height:12px!important;min-height:12px!important;cursor:ns-resize!important;background:linear-gradient(#222a33,#0b0f14)!important;border-top:1px solid #505a66!important;border-bottom:1px solid #151a20!important;display:grid!important;place-items:center!important;user-select:none!important;touch-action:none!important;z-index:20!important;outline:none!important}
        #afdDockResizeHandle:before{content:'';display:block;width:78px;height:3px;border-radius:999px;background:#8c96a3;box-shadow:0 1px 0 #000}
        #afdDockResizeHandle:focus{box-shadow:inset 0 0 0 2px #9b72df!important}
        .dock{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;max-height:none!important;overflow:auto!important;display:flex!important;flex-direction:column!important}
        .view{height:auto!important;min-height:90px!important;max-height:none!important;flex:1 1 auto!important}
        .toolbar,.tabs,.tools{max-width:100%!important;flex:0 0 auto!important}
        @media(max-height:800px){.toolbar button,.tabBtn,.tools button,.search{height:30px!important}}
        @media(max-height:680px){.toolbar,.tabs,.tools{gap:4px!important}.dock{padding:5px!important}}
      \`;

      const wrap=document.querySelector('.wrap');
      const dock=document.querySelector('.dock');
      if(wrap&&dock){
        let handle=document.getElementById('afdDockResizeHandle');
        if(!handle){
          handle=document.createElement('div');
          handle.id='afdDockResizeHandle';
          handle.tabIndex=0;
          handle.setAttribute('role','separator');
          handle.setAttribute('aria-orientation','horizontal');
          handle.setAttribute('aria-label','שינוי גובה ספריית השירים והתיקיות');
          dock.parentNode.insertBefore(handle,dock);
        }

        const KEY='afdDjDockRatioV162';
        const minRatio=0.18;
        const maxRatio=0.78;
        const defaultRatio=0.34;
        const clampRatio=v=>Math.max(minRatio,Math.min(maxRatio,Number(v)||defaultRatio));
        const readRatio=()=>{
          try{return clampRatio(localStorage.getItem(KEY));}catch(e){return defaultRatio;}
        };
        const saveRatio=v=>{try{localStorage.setItem(KEY,String(v));}catch(e){}};
        const applyRatio=v=>{
          const r=clampRatio(v);
          wrap.style.setProperty('--afd-dock-height',(r*100).toFixed(2)+'dvh');
          handle.setAttribute('aria-valuemin',String(Math.round(minRatio*100)));
          handle.setAttribute('aria-valuemax',String(Math.round(maxRatio*100)));
          handle.setAttribute('aria-valuenow',String(Math.round(r*100)));
          return r;
        };

        let ratio=applyRatio(readRatio());

        if(!handle.dataset.afdBound){
          handle.dataset.afdBound='1';
          let dragging=false;
          const move=e=>{
            if(!dragging)return;
            const h=Math.max(1,window.innerHeight);
            ratio=applyRatio((h-e.clientY)/h);
            saveRatio(ratio);
          };
          const end=e=>{
            if(!dragging)return;
            dragging=false;
            document.body.style.cursor='';
            document.body.style.userSelect='';
            try{handle.releasePointerCapture(e.pointerId);}catch(err){}
          };
          handle.addEventListener('pointerdown',e=>{
            dragging=true;
            document.body.style.cursor='ns-resize';
            document.body.style.userSelect='none';
            try{handle.setPointerCapture(e.pointerId);}catch(err){}
            e.preventDefault();
          });
          handle.addEventListener('pointermove',move);
          handle.addEventListener('pointerup',end);
          handle.addEventListener('pointercancel',end);
          handle.addEventListener('dblclick',()=>{
            ratio=applyRatio(defaultRatio);
            saveRatio(ratio);
          });
          handle.addEventListener('keydown',e=>{
            if(e.key==='ArrowUp'){
              e.preventDefault();ratio=applyRatio(ratio+0.04);saveRatio(ratio);
            }else if(e.key==='ArrowDown'){
              e.preventDefault();ratio=applyRatio(ratio-0.04);saveRatio(ratio);
            }else if(e.key==='Home'||e.key==='0'){
              e.preventDefault();ratio=applyRatio(defaultRatio);saveRatio(ratio);
            }
          });
        }

        if(!window.__afdDockResizeListenerV162){
          window.__afdDockResizeListenerV162=true;
          window.addEventListener('resize',()=>applyRatio(readRatio()));
        }
      }

      const f=document.getElementById('console');
      const patchFrame=()=>{
        try{
          const d=f&&f.contentDocument;if(!d||!d.head)return;
          let x=d.getElementById('afdWindowsFrameFitV162');
          if(!x){x=d.createElement('style');x.id='afdWindowsFrameFitV162';d.head.appendChild(x);}
          x.textContent='html,body{width:100%!important;min-width:0!important;overflow-x:hidden!important}.app{width:100%!important;min-width:0!important;max-width:none!important;margin:0!important;transform:none!important;transform-origin:top left!important}';
        }catch(e){}
      };
      if(f){f.addEventListener('load',patchFrame);patchFrame();}
      window.dispatchEvent(new Event('resize'));
    })();`;
    w.webContents.executeJavaScript(js,true).catch(()=>{});
  }

  w.webContents.on('before-input-event',(event,input)=>{
    if(!(input.control||input.meta))return;
    const code=input.code||'';
    const key=input.key||'';
    const plus=code==='Equal'||code==='NumpadAdd'||key==='+'||key==='=';
    const minus=code==='Minus'||code==='NumpadSubtract'||key==='-';
    const reset=code==='Digit0'||code==='Numpad0'||key==='0';
    if(plus){event.preventDefault();changeZoom(ZOOM_STEP);}
    else if(minus){event.preventDefault();changeZoom(-ZOOM_STEP);}
    else if(reset){event.preventDefault();resetZoom();}
  });

  w.webContents.on('did-finish-load',()=>{
    injectResponsiveFix();
    applyZoom();
  });

  w.on('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      applyZoom();
      injectResponsiveFix();
    },90);
  });

  w.maximize();
  w.loadURL('https://afd-dj.vercel.app/workstation.html?v=162');

  w.webContents.setWindowOpenHandler(({url})=>{
    if(url.startsWith('about:blank'))return{action:'allow',overrideBrowserWindowOptions:{width:1280,height:720,autoHideMenuBar:true,backgroundColor:'#000'}};
    shell.openExternal(url);
    return{action:'deny'};
  });
}

app.whenReady().then(()=>{
  session.defaultSession.setPermissionRequestHandler((wc,p,cb)=>cb(['media','fullscreen','window-management','display-capture'].includes(p)));
  create();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create();});
});

app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
