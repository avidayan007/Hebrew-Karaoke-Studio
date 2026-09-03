const fs=require('fs');
const path=require('path');
const electron=require('electron');
const {app}=electron;
const {patchText}=require('./patch-v224.js');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
const rawRead=fs.readFileSync.bind(fs);
fs.readFileSync=function(p,...args){
  const out=rawRead(p,...args),file=path.basename(String(p));
  return patchText(file,out);
};
require('./main-v220.js');
