const {contextBridge,ipcRenderer,webUtils}=require('electron');

contextBridge.exposeInMainWorld('aviDesktop',{
  isDesktop:true,
  platform:process.platform,
  getPathForFile(file){try{return webUtils.getPathForFile(file)}catch(_){return ''}},
  rendererInfo(){return ipcRenderer.invoke('desktop:renderer-info')},
  renderKaraoke(payload){return ipcRenderer.invoke('desktop:render-karaoke',payload)},
  openPath(filePath){return ipcRenderer.invoke('desktop:open-path',filePath)},
  onRenderProgress(callback){
    const handler=(_event,data)=>{try{callback(data)}catch(_){}};
    ipcRenderer.on('desktop:render-progress',handler);
    return ()=>ipcRenderer.removeListener('desktop:render-progress',handler);
  }
});
