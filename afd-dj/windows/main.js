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
      const STYLE_ID='afdWindowsResponsiveV163';
      let style=document.getElementById(STYLE_ID);
      if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style);}
      style.textContent=\`
        html,body{width:100%!important;height:100%!important;min-width:0!important;margin:0!important;overflow:hidden!important}
        .wrap{--afd-dock-px:330px;width:100%!important;height:100dvh!important;min-width:0!important;display:grid!important;grid-template-rows:minmax(150px,1fr) 30px var(--afd-dock-px)!important;overflow:hidden!important}
        .consoleFrame{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;display:block!important}
        #afdDockResizeHandle{height:30px!important;min-height:30px!important;cursor:ns-resize!important;background:linear-gradient(#303943,#141a21 55%,#0a0e13)!important;border-top:1px solid #6c7784!important;border-bottom:1px solid #05070a!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;direction:ltr!important;user-select:none!important;z-index:50!important;outline:none!important;box-shadow:inset 0 1px #ffffff22!important}
        #afdDockResizeHandle:hover{background:linear-gradient(#3a4652,#19212a 55%,#0b1016)!important}
        #afdDockResizeHandle:focus{box-shadow:inset 0 0 0 2px #9b72df!important}
        #afdDockResizeHandle .afdGrip{width:92px;height:5px;border-radius:999px;background:#9aa5b1;box-shadow:0 1px 0 #000;pointer-events:none}
        #afdDockResizeHandle .afdResizeText{font:800 11px/1 Arial,sans-serif;color:#e6ebf0;white-space:nowrap;pointer-events:none}
        #afdDockResizeHandle .afdResizeValue{font:800 10px/1 Arial,sans-serif;color:#b9c3ce;min-width:34px;text-align:center;pointer-events:none}
        #afdDockResizeHandle button{width:34px;height:23px;border:1px solid #68727e;border-radius:4px;background:linear-gradient(#3c4651,#171c23);color:#fff;font:bold 16px/1 Arial,sans-serif;cursor:pointer;padding:0}
        #afdDockResizeHandle button:active{transform:translateY(1px)}
        .dock{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;max-height:none!important;overflow:auto!important;display:flex!important;flex-direction:column!important}
        .view{height:auto!important;min-height:90px!important;max-height:none!important;flex:1 1 auto!important}
        .toolbar,.tabs,.tools{max-width:100%!important;flex:0 0 auto!important}
        @media(max-height:800px){.toolbar button,.tabBtn,.tools button,.search{height:30px!important}}
        @media(max-height:680px){.toolbar,.tabs,.tools{gap:4px!important}.dock{padding:5px!important}#afdDockResizeHandle{height:28px!important;min-height:28px!important}.wrap{grid-template-rows:minmax(130px,1fr) 28px var(--afd-dock-px)!important}}
      \`;

      const setup=()=>{
        const wrap=document.querySelector('.wrap');
        const dock=document.querySelector('.dock');
        if(!wrap||!dock||!dock.parentNode)return false;

        let handle=document.getElementById('afdDockResizeHandle');
        if(!handle){
          handle=document.createElement('div');
          handle.id='afdDockResizeHandle';
          handle.tabIndex=0;
          handle.setAttribute('role','separator');
          handle.setAttribute('aria-orientation','horizontal');
          handle.setAttribute('aria-label','שינוי גובה ספריית השירים והתיקיות');
          handle.innerHTML='<button type="button" id="afdDockSmaller" title="הקטן ספרייה">−</button><span class="afdGrip"></span><span class="afdResizeText">↕ גרור לשינוי גובה הספרייה</span><span class="afdResizeValue" id="afdDockResizeValue">36%</span><span class="afdGrip"></span><button type="button" id="afdDockLarger" title="הגדל ספרייה">＋</button>';
          dock.parentNode.insertBefore(handle,dock);
        }

        const KEY='afdDjDockRatioV163';
        const MIN=0.18;
        const MAX=0.74;
        const DEFAULT=0.36;
        const clampRatio=v=>Math.max(MIN,Math.min(MAX,v));
        const readSaved=()=>{
          try{
            const n=Number(localStorage.getItem(KEY));
            return Number.isFinite(n)&&n>=MIN&&n<=MAX?n:DEFAULT;
          }catch(e){return DEFAULT;}
        };
        const save=v=>{try{localStorage.setItem(KEY,String(v));}catch(e){}};
        const valueEl=document.getElementById('afdDockResizeValue');
        let ratio=readSaved();

        const apply=v=>{
          ratio=clampRatio(Number(v)||DEFAULT);
          const h=Math.max(1,window.innerHeight);
          const px=Math.max(110,Math.round(h*ratio));
          wrap.style.setProperty('--afd-dock-px',px+'px');
          if(valueEl)valueEl.textContent=Math.round(ratio*100)+'%';
          handle.setAttribute('aria-valuemin',String(Math.round(MIN*100)));
          handle.setAttribute('aria-valuemax',String(Math.round(MAX*100)));
          handle.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
          return ratio;
        };

        apply(ratio);

        if(!handle.dataset.afdBoundV163){
          handle.dataset.afdBoundV163='1';
          let dragging=false;

          const start=e=>{
            if(e.target&&e.target.closest&&e.target.closest('button'))return;
            dragging=true;
            document.body.style.cursor='ns-resize';
            document.body.style.userSelect='none';
            e.preventDefault();
          };
          const move=e=>{
            if(!dragging)return;
            const h=Math.max(1,window.innerHeight);
            apply((h-e.clientY)/h);
            e.preventDefault();
          };
          const end=()=>{
            if(!dragging)return;
            dragging=false;
            document.body.style.cursor='';
            document.body.style.userSelect='';
            save(ratio);
          };

          handle.addEventListener('mousedown',start);
          document.addEventListener('mousemove',move,true);
          document.addEventListener('mouseup',end,true);
          window.addEventListener('blur',end);

          handle.addEventListener('dblclick',e=>{
            if(e.target&&e.target.closest&&e.target.closest('button'))return;
            apply(DEFAULT);save(ratio);
          });
          handle.addEventListener('keydown',e=>{
            if(e.key==='ArrowUp'){e.preventDefault();apply(ratio+0.04);save(ratio);}
            else if(e.key==='ArrowDown'){e.preventDefault();apply(ratio-0.04);save(ratio);}
            else if(e.key==='Home'){e.preventDefault();apply(DEFAULT);save(ratio);}
          });

          const larger=document.getElementById('afdDockLarger');
          const smaller=document.getElementById('afdDockSmaller');
          if(larger)larger.addEventListener('click',e=>{e.stopPropagation();apply(ratio+0.05);save(ratio);});
          if(smaller)smaller.addEventListener('click',e=>{e.stopPropagation();apply(ratio-0.05);save(ratio);});
        }

        if(!window.__afdDockResizeListenerV163){
          window.__afdDockResizeListenerV163=true;
          window.addEventListener('resize',()=>apply(ratio));
        }
        return true;
      };

      setup();
      setTimeout(setup,250);
      setTimeout(setup,900);

      const f=document.getElementById('console');
      const patchFrame=()=>{
        try{
          const d=f&&f.contentDocument;if(!d||!d.head)return;
          let x=d.getElementById('afdWindowsFrameFitV163');
          if(!x){x=d.createElement('style');x.id='afdWindowsFrameFitV163';d.head.appendChild(x);}
          x.textContent='html,body{width:100%!important;min-width:0!important;overflow-x:hidden!important}.app{width:100%!important;min-width:0!important;max-width:none!important;margin:0!important;transform:none!important;transform-origin:top left!important}';
        }catch(e){}
      };
      if(f){f.addEventListener('load',patchFrame);patchFrame();}
      window.dispatchEvent(new Event('resize'));
      return {ok:!!document.getElementById('afdDockResizeHandle'),wrap:!!document.querySelector('.wrap'),dock:!!document.querySelector('.dock')};
    })();`;
    return w.webContents.executeJavaScript(js,true).catch(()=>({ok:false}));
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

  w.webContents.on('dom-ready',()=>{
    injectResponsiveFix();
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
  w.loadURL('https://afd-dj.vercel.app/workstation.html?v=163');

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
