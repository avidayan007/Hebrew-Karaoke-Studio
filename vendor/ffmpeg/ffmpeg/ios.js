export class FFmpeg {
  constructor(){this.worker=null;this.seq=0;this.pending=new Map();this.logHandlers=[];this.progressHandlers=[];this.loaded=false}
  on(type,cb){if(type==='log')this.logHandlers.push(cb);else if(type==='progress')this.progressHandlers.push(cb)}
  off(type,cb){const a=type==='log'?this.logHandlers:this.progressHandlers;const i=a.indexOf(cb);if(i>=0)a.splice(i,1)}
  _ensureWorker(){
    if(this.worker)return;
    this.worker=new Worker(new URL('./worker-classic.js',import.meta.url));
    this.worker.onmessage=({data})=>{
      const {id,type}=data||{};
      if(type==='LOG'){this.logHandlers.forEach(f=>f(data.data));return}
      if(type==='PROGRESS'){this.progressHandlers.forEach(f=>f(data.data));return}
      const p=this.pending.get(id);if(!p)return;
      this.pending.delete(id);
      if(type==='ERROR')p.reject(new Error(String(data.data||'FFmpeg worker error')));else p.resolve(data.data)
    };
    this.worker.onerror=e=>{
      const err=new Error(e?.message||'FFmpeg worker failed');
      for(const [,p] of this.pending)p.reject(err);this.pending.clear();
    };
  }
  _send(type,data,transfer=[]){this._ensureWorker();return new Promise((resolve,reject)=>{const id=this.seq++;this.pending.set(id,{resolve,reject});this.worker.postMessage({id,type,data},transfer)})}
  async load(config={}){const r=await this._send('LOAD',config);this.loaded=true;return r}
  exec(args,timeout=-1){return this._send('EXEC',{args,timeout})}
  ffprobe(args,timeout=-1){return this._send('FFPROBE',{args,timeout})}
  writeFile(path,data){const trans=[];if(data instanceof Uint8Array)trans.push(data.buffer);return this._send('WRITE_FILE',{path,data},trans)}
  readFile(path,encoding='binary'){return this._send('READ_FILE',{path,encoding})}
  deleteFile(path){return this._send('DELETE_FILE',{path})}
  rename(oldPath,newPath){return this._send('RENAME',{oldPath,newPath})}
  createDir(path){return this._send('CREATE_DIR',{path})}
  listDir(path){return this._send('LIST_DIR',{path})}
  deleteDir(path){return this._send('DELETE_DIR',{path})}
  terminate(){if(this.worker)this.worker.terminate();this.worker=null;this.loaded=false;for(const [,p] of this.pending)p.reject(new Error('FFmpeg terminated'));this.pending.clear()}
}
