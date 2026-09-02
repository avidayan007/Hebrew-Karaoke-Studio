const {contextBridge,ipcRenderer,webUtils}=require('electron');
const paths=new Map();
const keyOf=f=>(f?.webkitRelativePath||f?.name||'')+'|'+(f?.size||0)+'|'+(f?.lastModified||0);
function captureFiles(input){
  try{
    [...(input?.files||[])].forEach(f=>{
      const p=webUtils.getPathForFile(f);if(p)paths.set(keyOf(f),p);
    });
  }catch(e){}
}
document.addEventListener('change',e=>{if(e.target?.tagName==='INPUT'&&e.target?.type==='file')captureFiles(e.target)},true);
contextBridge.exposeInMainWorld('afdDesktopMedia',{
  getPath:key=>paths.get(String(key||''))||'',
  prepare:meta=>{
    const key=String(meta?.key||''),p=paths.get(key);if(!p)return Promise.reject(new Error('Local file path is not available. Re-select the folder/file.'));
    return ipcRenderer.invoke('afd-media-prepare',{path:p,name:String(meta?.name||''),kind:String(meta?.kind||''),force:!!meta?.force});
  },
  preparePath:meta=>ipcRenderer.invoke('afd-media-prepare',{path:String(meta?.path||''),name:String(meta?.name||''),kind:String(meta?.kind||''),force:!!meta?.force}),
  savePlaylist:payload=>ipcRenderer.invoke('afd-playlist-save',payload),
  readPlaylist:filePath=>ipcRenderer.invoke('afd-playlist-read',String(filePath||''))
});
