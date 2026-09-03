const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app}=electron;
const {patchText}=require('./patch-v227.js');

app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

const rawRead=fs.readFileSync.bind(fs);
fs.readFileSync=function(p,...args){
  const out=rawRead(p,...args),file=path.basename(String(p));
  return patchText(file,out);
};

require('./main-v226.js');
