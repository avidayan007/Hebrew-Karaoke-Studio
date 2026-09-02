(()=>{
if(window.__afdWin183){return}
const frame=()=>document.getElementById('console');
const D=()=>{try{return frame()?.contentDocument||null}catch(e){return null}};
const W=()=>{try{return frame()?.contentWindow||null}catch(e){return null}};
const NATIVE=new Set('mp4 m4v webm ogv ogg mp3 wav wave m4a aac flac opus'.split(' '));
const VIDEO=new Set('mp4 m4v mov webm ogv avi wmv asf mkv mpg mpeg m2v ts mts m2ts vob flv f4v 3gp 3g2 rm rmvb divx dv'.split(' '));
let serial={A:0,B:0};
const extOf=it=>{const n=String(it?.name||it?.path||'').toLowerCase(),m=n.match(/\.([a-z0-9]+)$/);return m?m[1]:''};
const status=t=>{const e=document.getElementById('status');if(e)e.textContent=t;console.log('[AFD LOAD 183]',t)};
function clearOnline(deck,it){try{window.AFDYouTubeState?.clear?.(deck,it||null)}catch(e){}try{window.AFDSpotifyState?.clear?.(deck)}catch(e){}}
function paint(deck,it,res){
 const d=D(),v=d?.getElementById('vid'+deck),m=d?.getElementById('master'+deck);if(!d||!v)return false;
 const video=(res?.kind||it?.kind)==='video'||VIDEO.has(extOf(it));
 try{v.pause()}catch(e){}
 try{v.removeAttribute('src');v.load()}catch(e){}
 v.src=res.url;v.style.display=video?'block':'none';
 if(m){try{m.pause();m.removeAttribute('src');m.load()}catch(e){}m.style.setProperty('display','none','important');m.muted=true}
 const post=d.getElementById('post'+deck);if(post)post.style.display=video?'none':'grid';
 const logo=d.getElementById('masterLogo');if(logo&&video)logo.style.display='none';
 const title=d.getElementById('title'+deck);if(title)title.textContent=it?.name||res?.name||'Track';
 try{v.load();v.currentTime=0}catch(e){}
 try{window.__afdWin182?.setTone?.(deck,0,false)}catch(e){}
 return true
}
async function bridgeLoad(deck,it,force=false){
 const bridge=window.afdDesktopMedia;if(!bridge)throw Error('Windows media engine unavailable');
 const my=++serial[deck],meta={key:it?.key||'',path:it?.path||'',name:it?.name||'',kind:it?.kind||'',force:!!force};
 status('MEDIA • מכין ברקע '+(it?.name||'קובץ')+' • הדק הנוכחי ממשיך לעבוד...');
 const res=it?.path?await bridge.preparePath(meta):await bridge.prepare(meta);
 if(my!==serial[deck])return false;
 if(!res?.url)throw Error('Media preparation returned no file');
 clearOnline(deck,it);
 if(!paint(deck,it,res))throw Error('Deck not ready');
 const mode=res.remuxed?'REMUXED':res.converted?'CONVERTED':'LOADED';
 status(mode+' • '+(it?.name||'Track')+' → DECK '+deck+' • לחץ PLAY');return true
}
function nativeLoad(deck,it){
 const win=W();if(!win||typeof win.load!=='function'||!it?.file)throw Error('Local file is not available');
 const my=++serial[deck];clearOnline(deck,it);win.load(deck,it.file);
 try{window.dispatchEvent(new CustomEvent('afd-local-load',{detail:{deck,item:it,afd183:true}}))}catch(e){}
 const d=D(),v=d?.getElementById('vid'+deck);if(v){const onerr=()=>{v.removeEventListener('error',onerr);if(my!==serial[deck])return;bridgeLoad(deck,it,true).catch(x=>status('MEDIA ERROR • '+(x?.message||x)))};v.addEventListener('error',onerr,{once:true})}
 status('LOCAL • '+it.name+' → DECK '+deck+' • לחץ PLAY');return true
}
async function load(deck,it){
 if(!['A','B'].includes(deck)||!it)return false;
 const ext=extOf(it),mustBridge=!!it.path||!NATIVE.has(ext);
 try{return mustBridge?await bridgeLoad(deck,it,false):nativeLoad(deck,it)}catch(e){status('MEDIA ERROR • '+(e?.message||e)+' • הדק הקודם לא שונה');return false}
}
window.AFDWindowsLoadItem=load;
window.AFDWindowsLoadState={cancel:deck=>{if(['A','B'].includes(deck))serial[deck]++}};
window.__afdWin183={load};window.__afdWin179=window.__afdWin183;
})();