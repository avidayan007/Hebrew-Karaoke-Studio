const {app,BrowserWindow,shell,session}=require('electron');
const fs=require('fs');
const path=require('path');

app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');

const DESIGN_WIDTH=1600;
const DESIGN_HEIGHT=950;
const MIN_ZOOM=0.55;
const MAX_ZOOM=1.40;
const ZOOM_STEP=0.10;
const RUNTIME_JS=fs.readFileSync(path.join(__dirname,'runtime-v166.js'),'utf8');

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
    fullscreen:false,
    fullscreenable:true,
    show:true,
    webPreferences:{
      contextIsolation:true,
      nodeIntegration:false,
      webSecurity:true,
      autoplayPolicy:'no-user-gesture-required'
    }
  });

  let manualZoom=1;
  let resizeTimer=null;
  let leavingFullScreen=false;

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

  function injectWindowsRuntime(){
    return w.webContents.executeJavaScript(RUNTIME_JS,true).catch(err=>{
      console.error('AFD runtime inject failed',err);
      return {ok:false,error:String(err)};
    });
  }

  function exitToMaximized(){
    if(leavingFullScreen)return;
    leavingFullScreen=true;
    try{if(w.isFullScreen())w.setFullScreen(false);}catch(e){}
    setTimeout(()=>{
      try{w.maximize();}catch(e){}
      leavingFullScreen=false;
      applyZoom();
      injectWindowsRuntime();
    },180);
  }

  function enterFullScreen(){
    try{if(!w.isFullScreen())w.setFullScreen(true);}catch(e){}
  }

  w.webContents.on('before-input-event',(event,input)=>{
    const code=input.code||'';
    const key=input.key||'';

    if(key==='Escape'||code==='Escape'){
      if(w.isFullScreen()){
        event.preventDefault();
        exitToMaximized();
      }
      return;
    }

    if(code==='F11'||key==='F11'){
      event.preventDefault();
      if(w.isFullScreen())exitToMaximized();
      else enterFullScreen();
      return;
    }

    if(!(input.control||input.meta))return;
    const plus=code==='Equal'||code==='NumpadAdd'||key==='+'||key==='=';
    const minus=code==='Minus'||code==='NumpadSubtract'||key==='-';
    const reset=code==='Digit0'||code==='Numpad0'||key==='0';

    if(plus){event.preventDefault();changeZoom(ZOOM_STEP);}
    else if(minus){event.preventDefault();changeZoom(-ZOOM_STEP);}
    else if(reset){event.preventDefault();resetZoom();}
  });

  w.webContents.on('dom-ready',()=>injectWindowsRuntime());
  w.webContents.on('did-finish-load',()=>{
    injectWindowsRuntime();
    applyZoom();
  });

  w.on('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      applyZoom();
      injectWindowsRuntime();
    },90);
  });

  w.on('leave-full-screen',()=>{
    if(!leavingFullScreen)return;
    setTimeout(()=>{
      try{w.maximize();}catch(e){}
      applyZoom();
      injectWindowsRuntime();
    },80);
  });

  w.on('ready-to-show',()=>{
    try{w.maximize();}catch(e){}
    setTimeout(()=>enterFullScreen(),180);
  });

  w.loadURL('https://afd-dj.vercel.app/workstation.html?v=166');

  w.webContents.setWindowOpenHandler(({url})=>{
    if(url.startsWith('spotify:')){
      shell.openExternal(url).catch(()=>shell.openExternal('https://open.spotify.com/'));
      return{action:'deny'};
    }
    if(url.startsWith('about:blank')){
      return{
        action:'allow',
        overrideBrowserWindowOptions:{
          width:1280,
          height:720,
          autoHideMenuBar:true,
          backgroundColor:'#000',
          fullscreen:false,
          fullscreenable:true
        }
      };
    }
    shell.openExternal(url);
    return{action:'deny'};
  });
}

app.whenReady().then(async()=>{
  await session.defaultSession.clearCache().catch(()=>{});
  session.defaultSession.setPermissionRequestHandler((wc,p,cb)=>cb(['media','fullscreen','window-management','display-capture'].includes(p)));
  create();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create();});
});

app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
