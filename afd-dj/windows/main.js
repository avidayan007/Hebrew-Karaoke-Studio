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
      const id='afdWindowsResponsiveV161';
      let s=document.getElementById(id);
      if(!s){s=document.createElement('style');s.id=id;document.head.appendChild(s);}
      s.textContent=\`
        html,body{width:100%!important;height:100%!important;min-width:0!important;margin:0!important;overflow:hidden!important}
        .wrap{width:100%!important;height:100dvh!important;min-width:0!important;display:grid!important;grid-template-rows:minmax(0,1fr) auto!important;overflow:hidden!important}
        .consoleFrame{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;display:block!important}
        .dock{width:100%!important;min-width:0!important;max-height:44dvh!important;overflow:auto!important}
        .view{height:clamp(150px,23dvh,250px)!important;min-height:0!important}
        .toolbar,.tabs,.tools{max-width:100%!important}
        @media(max-height:800px){.dock{max-height:46dvh!important}.view{height:clamp(135px,21dvh,190px)!important}.toolbar button,.tabBtn,.tools button,.search{height:30px!important}}
        @media(max-height:680px){.dock{max-height:48dvh!important}.view{height:135px!important}.toolbar,.tabs,.tools{gap:4px!important}.dock{padding:5px!important}}
      \`;
      const f=document.getElementById('console');
      const patchFrame=()=>{
        try{
          const d=f&&f.contentDocument;if(!d||!d.head)return;
          let x=d.getElementById('afdWindowsFrameFitV161');
          if(!x){x=d.createElement('style');x.id='afdWindowsFrameFitV161';d.head.appendChild(x);}
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
  w.loadURL('https://afd-dj.vercel.app/workstation.html?v=161');

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
