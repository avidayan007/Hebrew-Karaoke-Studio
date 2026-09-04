const {app,BrowserWindow,dialog,ipcMain,shell,powerSaveBlocker}=require('electron');
const path=require('path');
const fs=require('fs');
const os=require('os');
const {spawn}=require('child_process');

let mainWindow=null;
let rendererInfoCache=null;

function bundledFfmpeg(){
  const packaged=path.join(process.resourcesPath,'ffmpeg','ffmpeg.exe');
  const dev=path.join(__dirname,'ffmpeg','ffmpeg.exe');
  if(app.isPackaged&&fs.existsSync(packaged))return packaged;
  if(fs.existsSync(dev))return dev;
  return 'ffmpeg';
}

function runProcess(exe,args,opts={}){
  return new Promise((resolve,reject)=>{
    const child=spawn(exe,args,{windowsHide:true,...opts});
    let stdout='',stderr='';
    child.stdout?.on('data',d=>stdout+=d.toString());
    child.stderr?.on('data',d=>stderr+=d.toString());
    child.on('error',reject);
    child.on('close',code=>code===0?resolve({stdout,stderr}):reject(new Error(stderr||`Process exited with code ${code}`)));
  });
}

async function getRendererInfo(){
  if(rendererInfoCache)return rendererInfoCache;
  const ffmpeg=bundledFfmpeg();
  try{
    const r=await runProcess(ffmpeg,['-hide_banner','-encoders']);
    const text=(r.stdout||'')+'\n'+(r.stderr||'');
    rendererInfoCache={
      ffmpegPath:ffmpeg,
      available:true,
      nvencSupported:/\bh264_nvenc\b/i.test(text),
      qsvSupported:/\bh264_qsv\b/i.test(text),
      amfSupported:/\bh264_amf\b/i.test(text)
    };
  }catch(e){
    rendererInfoCache={ffmpegPath:ffmpeg,available:false,nvencSupported:false,qsvSupported:false,amfSupported:false,error:e.message};
  }
  return rendererInfoCache;
}

function sanitizeName(s){
  return String(s||'karaoke').replace(/[<>:"/\\|?*\x00-\x1F]/g,' ').replace(/\s+/g,' ').trim().slice(0,90)||'karaoke';
}
function ensureExt(p,ext){return p.toLowerCase().endsWith(ext)?p:p+ext}
function filterPath(p){return String(p).replace(/\\/g,'/').replace(/:/g,'\\:').replace(/'/g,"\\'")}
function parseBitrate(v,def){
  const m=String(v||'').trim().match(/^([0-9.]+)\s*([kKmM])?$/);if(!m)return def;
  const n=Number(m[1]);if(!Number.isFinite(n)||n<=0)return def;
  const u=(m[2]||'').toLowerCase();return u==='m'?`${n}M`:u==='k'?`${n}k`:`${n}`;
}

function runFfmpegProgress({ffmpeg,args,cwd,duration,startPct,spanPct,sender,label}){
  return new Promise((resolve,reject)=>{
    const full=['-y','-hide_banner','-loglevel','error','-progress','pipe:1','-nostats',...args];
    const child=spawn(ffmpeg,full,{cwd,windowsHide:true});
    let stderr='',buf='';
    child.stderr.on('data',d=>stderr+=d.toString());
    child.stdout.on('data',d=>{
      buf+=d.toString();
      let idx;
      while((idx=buf.indexOf('\n'))>=0){
        const line=buf.slice(0,idx).trim();buf=buf.slice(idx+1);
        const m=line.match(/^out_time_(?:us|ms)=(\d+)/);
        if(m&&duration>0){
          const sec=Number(m[1])/1e6;
          const pct=Math.max(0,Math.min(1,sec/duration));
          sender.send('desktop:render-progress',{percent:startPct+pct*spanPct,state:label});
        }
        if(line==='progress=end')sender.send('desktop:render-progress',{percent:startPct+spanPct,state:label});
      }
    });
    child.on('error',reject);
    child.on('close',code=>code===0?resolve():reject(new Error(stderr||`FFmpeg exited with code ${code}`)));
  });
}

async function renderNative(event,payload){
  const sender=event.sender;
  const info=await getRendererInfo();
  if(!info.available)throw new Error('FFmpeg המקומי לא נמצא במערכת.');
  const audioPath=String(payload?.audioPath||'');
  if(!audioPath||!fs.existsSync(audioPath))throw new Error('קובץ המוזיקה לא נמצא.');
  const duration=Math.max(0,Number(payload?.duration)||0);
  if(!(duration>0))throw new Error('לא ניתן לקרוא את אורך השיר.');
  const preset=payload?.preset||{};
  const width=Math.max(640,Number(preset.width)||1920);
  const height=Math.max(360,Number(preset.height)||1080);
  const fps=Math.max(24,Math.min(60,Number(preset.fps)||30));
  const videoK=parseBitrate(preset.videoK,'8M');
  const audioK=parseBitrate(preset.audioK,'192k');
  const title=sanitizeName(payload?.title||'karaoke');
  const win=BrowserWindow.fromWebContents(sender)||mainWindow;
  const save=await dialog.showSaveDialog(win,{
    title:'שמור MP4 ו-WMV',
    defaultPath:path.join(app.getPath('videos'),title+'.mp4'),
    filters:[{name:'MP4 Video',extensions:['mp4']}],
    properties:['createDirectory','showOverwriteConfirmation']
  });
  if(save.canceled||!save.filePath)return {canceled:true};
  const mp4Path=ensureExt(save.filePath,'.mp4');
  const wmvPath=mp4Path.replace(/\.mp4$/i,'.wmv');
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'avi-karaoke-'));
  const assPath=path.join(temp,'karaoke.ass');
  fs.writeFileSync(assPath,String(payload?.ass||''),'utf8');
  const bgPath=String(payload?.backgroundPath||'');
  const bgType=payload?.backgroundType;
  const ffmpeg=info.ffmpegPath;
  const windowsFonts=path.join(process.env.WINDIR||'C:\\Windows','Fonts');
  const subtitleFilter=`subtitles=karaoke.ass:fontsdir='${filterPath(windowsFonts)}'`;
  const vf=`scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},${subtitleFilter}`;
  let bgArgs;
  if(bgType==='video'&&bgPath&&fs.existsSync(bgPath))bgArgs=['-stream_loop','-1','-i',bgPath];
  else if(bgType==='image'&&bgPath&&fs.existsSync(bgPath))bgArgs=['-loop','1','-framerate',String(fps),'-i',bgPath];
  else bgArgs=['-f','lavfi','-i',`color=c=black:s=${width}x${height}:r=${fps}`];
  const common=[...bgArgs,'-i',audioPath,'-filter_complex',`[0:v]${vf}[v]`,'-map','[v]','-map','1:a:0','-t',String(duration),'-r',String(fps),'-pix_fmt','yuv420p','-c:a','aac','-b:a',audioK,'-movflags','+faststart','-shortest'];
  const powerId=powerSaveBlocker.start('prevent-app-suspension');
  let encoder='CPU';
  try{
    sender.send('desktop:render-progress',{percent:2,state:'מכין רינדור Windows מקומי...'});
    if(info.nvencSupported){
      try{
        encoder='NVIDIA NVENC';
        await runFfmpegProgress({ffmpeg,cwd:temp,duration,startPct:4,spanPct:72,sender,label:'מרנדר MP4 עם NVIDIA NVENC...',args:[...common,'-c:v','h264_nvenc','-preset','p5','-b:v',videoK,mp4Path]});
      }catch(nvErr){
        try{fs.rmSync(mp4Path,{force:true})}catch(_){}
        encoder='CPU (NVENC fallback)';
        sender.send('desktop:render-progress',{percent:4,state:'NVENC לא זמין בפועל — עובר אוטומטית לרינדור CPU מקומי...'});
        await runFfmpegProgress({ffmpeg,cwd:temp,duration,startPct:4,spanPct:72,sender,label:'מרנדר MP4 ב-FFmpeg מקומי...',args:[...common,'-c:v','libx264','-preset','veryfast','-b:v',videoK,mp4Path]});
      }
    }else{
      await runFfmpegProgress({ffmpeg,cwd:temp,duration,startPct:4,spanPct:72,sender,label:'מרנדר MP4 ב-FFmpeg מקומי...',args:[...common,'-c:v','libx264','-preset','veryfast','-b:v',videoK,mp4Path]});
    }
    await runFfmpegProgress({ffmpeg,cwd:temp,duration,startPct:78,spanPct:21,sender,label:'יוצר WMV...',args:['-i',mp4Path,'-c:v','wmv2','-b:v',videoK,'-c:a','wmav2','-b:a',audioK,'-strict','-2',wmvPath]});
    sender.send('desktop:render-progress',{percent:100,state:'הרינדור הסתיים'});
    return {canceled:false,mp4Path,wmvPath,encoder,mp4Size:fs.statSync(mp4Path).size,wmvSize:fs.statSync(wmvPath).size};
  }finally{
    if(powerSaveBlocker.isStarted(powerId))powerSaveBlocker.stop(powerId);
    try{fs.rmSync(temp,{recursive:true,force:true})}catch(_){}
  }
}

function createWindow(){
  mainWindow=new BrowserWindow({
    width:1600,height:980,minWidth:1100,minHeight:700,
    backgroundColor:'#07070a',show:false,
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:false,backgroundThrottling:false}
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname,'app','index.html'));
  mainWindow.once('ready-to-show',()=>mainWindow.show());
  mainWindow.on('closed',()=>{mainWindow=null});
}

ipcMain.handle('desktop:renderer-info',()=>getRendererInfo());
ipcMain.handle('desktop:render-karaoke',(event,payload)=>renderNative(event,payload));
ipcMain.handle('desktop:open-path',async(_event,filePath)=>{
  if(!filePath||!fs.existsSync(filePath))return 'הקובץ לא נמצא';
  return shell.openPath(filePath);
});

app.whenReady().then(()=>{createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()})});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
