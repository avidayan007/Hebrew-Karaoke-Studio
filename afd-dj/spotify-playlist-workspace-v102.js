(()=>{
 const $=id=>document.getElementById(id);
 function css(){if($('afdPLWS103Style'))return;const s=document.createElement('style');s.id='afdPLWS103Style';s.textContent=`
 body.afdSpotifyPlaylists #online{display:flex!important;flex-direction:column!important;width:100%!important;height:100%!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}
 body.afdSpotifyPlaylists #online>.card{display:none!important}
 body.afdSpotifyPlaylists #online>.card:has(#spSearch){display:flex!important;flex-direction:column!important;flex:1 1 0!important;width:100%!important;height:100%!important;min-height:0!important;max-width:none!important;margin:0!important;padding:5px!important;box-sizing:border-box!important;overflow:hidden!important}
 body.afdSpotifyPlaylists #online>.card:has(#spSearch)>h3,body.afdSpotifyPlaylists #online>.card:has(#spSearch)>small,body.afdSpotifyPlaylists #spSearch,body.afdSpotifyPlaylists #spBtn,body.afdSpotifyPlaylists #afdSP85Tools,body.afdSpotifyPlaylists #afdSPResults{display:none!important}
 body.afdSpotifyPlaylists #afdPL101Wrap{display:flex!important;flex-direction:column!important;flex:1 1 0!important;min-height:0!important;width:100%!important;margin:0!important;gap:5px!important}
 body.afdSpotifyPlaylists #afdPL101Tile{width:116px!important;height:30px!important;min-height:30px!important;align-self:flex-start!important;flex-direction:row!important;gap:5px!important;padding:0 8px!important;border-radius:7px!important;font-size:9px!important;box-shadow:none!important}
 body.afdSpotifyPlaylists #afdPL101Tile .ico{font-size:14px!important}body.afdSpotifyPlaylists #afdPL101Tile small{display:none!important}
 body.afdSpotifyPlaylists #afdPL101Panel{display:block!important;flex:1 1 0!important;min-height:0!important;height:0!important;max-height:none!important;margin:0!important;width:100%!important;overflow:auto!important;overscroll-behavior:contain!important;box-sizing:border-box!important}
 body.afdSpotifyPlaylists .afdPLGrid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))!important;align-content:start!important;gap:8px!important;padding:8px!important}
 body.afdSpotifyPlaylists .afdPLHead{min-height:38px!important;padding:5px 8px!important}body.afdSpotifyPlaylists .afdPLTrack{grid-template-columns:44px minmax(0,1fr) 64px 64px!important;padding:6px 8px!important}
 `;document.head.appendChild(s)}
 function openMode(){document.body.classList.add('afdSpotifyPlaylists','afdSpotifyResults')}
 function closeMode(){document.body.classList.remove('afdSpotifyPlaylists');if(!document.querySelector('#afdSPResults .afdSPRow'))document.body.classList.remove('afdSpotifyResults')}
 function bind(){css();const tile=$('afdPL101Tile'),panel=$('afdPL101Panel');if(tile&&!tile.dataset.afdWS103){tile.dataset.afdWS103='1';tile.addEventListener('pointerdown',openMode,true);tile.addEventListener('touchstart',openMode,{capture:true,passive:true});tile.addEventListener('click',openMode,true)}if(panel&&!panel.dataset.afdWS103){panel.dataset.afdWS103='1';new MutationObserver(()=>{if(panel.style.display==='none')closeMode();else if(panel.childElementCount)openMode()}).observe(panel,{attributes:true,attributeFilter:['style'],childList:true})}if(panel&&panel.style.display!=='none'&&panel.childElementCount)openMode()}
 setTimeout(bind,50);setTimeout(bind,350);setInterval(bind,800);
})();