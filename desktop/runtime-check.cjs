const {app,BrowserWindow,ipcMain}=require('electron');
const fs=require('fs');
const path=require('path');
const http=require('http');

const root=path.join(__dirname,'app');
const out=process.env.AVI_PREVIEW_PATH||path.join(__dirname,'preview-windows-v1.130.png');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.png':'image/png','.css':'text/css; charset=utf-8'};
let server;
function startServer(){return new Promise((resolve,reject)=>{server=http.createServer((req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1');let p=decodeURIComponent(u.pathname||'/');if(p==='/')p='/index.html';const file=path.resolve(root,p.replace(/^\/+/,''));if(!file.startsWith(path.resolve(root)+path.sep)){res.writeHead(403);return res.end('Forbidden')}fs.readFile(file,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':MIME[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(d)})}catch(e){res.writeHead(500);res.end(String(e))}});server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve(`http://127.0.0.1:${server.address().port}`))})}
ipcMain.handle('desktop:renderer-info',()=>({available:true,nvencSupported:true,qsvSupported:false,amfSupported:false,ffmpegPath:'CI runtime check'}));
ipcMain.handle('desktop:render-karaoke',()=>({canceled:true}));
ipcMain.handle('desktop:open-path',()=>null);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

app.whenReady().then(async()=>{
  const base=await startServer();
  const win=new BrowserWindow({width:1600,height:980,show:false,paintWhenInitiallyHidden:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:false,backgroundThrottling:false}});
  win.setMenuBarVisibility(false);
  await win.loadURL(base+'/index.html');

  // The app intentionally applies a long ordered patch history. CI machines can be slower than a normal PC,
  // so wait until the final Windows parity patch really loaded instead of assuming a fixed delay.
  let ready=false;
  for(let i=0;i<90;i++){
    ready=await win.webContents.executeJavaScript(`!!(window.__hksDesktopAudit130&&window.__hksDesktopParity130)`).catch(()=>false);
    if(ready)break;
    await sleep(500);
  }
  if(!ready)throw new Error('Timed out waiting for the complete Windows v1.130 patch chain.');
  await win.webContents.executeJavaScript(`window.__hksDesktopAudit130?.()`);
  await sleep(300);
  const result=await win.webContents.executeJavaScript(`(()=>{const p=window.__hksDesktopParity130||null;return {parity:p,version:document.querySelector('.version')?.textContent||'',title:document.title,hasStudio:!!document.getElementById('studio'),hasSyncWave:!!document.getElementById('hksSyncWaveCanvas'),hasExternal:!!document.getElementById('hksExternalDisplay102'),hasEstimate:!!document.getElementById('hksExportSizeEstimate127')}})()`);
  console.log('WINDOWS_RUNTIME_AUDIT='+JSON.stringify(result));
  if(!result.parity?.ok)throw new Error('Runtime parity failed: '+JSON.stringify(result.parity));
  if(!/Windows v1\.130/.test(result.version))throw new Error('Unexpected Windows version: '+result.version);
  await sleep(200);
  const image=await win.webContents.capturePage();
  fs.writeFileSync(out,image.toPNG());
  console.log('WINDOWS_PREVIEW='+out);
  win.destroy();server.close(()=>app.quit());
}).catch(e=>{console.error(e);try{server?.close()}catch(_){}app.exit(1)});
