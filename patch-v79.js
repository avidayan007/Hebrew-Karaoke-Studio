// Hebrew Karaoke Studio Web v1.79 — live 4-line screen preview inside Lyrics page
(function(){
  const page=document.getElementById('lyrics');
  const textarea=document.getElementById('lyricsText');
  if(!page||!textarea)return;

  const host=document.createElement('div');
  host.id='hksLyricsScreenPreview79';
  host.innerHTML=`
    <div class="hksPreviewHead79">
      <strong>תצוגת מסך — חלוקת 4 שורות</strong>
      <span id="hksLyricsPageCount79"></span>
    </div>
    <div id="hksLyricsMiniScreen79">
      <div id="hksLyricsMiniLines79"></div>
    </div>
    <div class="hksPreviewNav79">
      <button type="button" class="gbtn" id="hksLyricsPrev79">◀ הקודם</button>
      <button type="button" class="gbtn" id="hksLyricsNext79">הבא ▶</button>
    </div>`;

  const workspace=document.getElementById('hksLyricsWorkspace72') || textarea.closest('.card') || page;
  workspace.appendChild(host);

  let group=0;
  function groups(){
    const lines=textarea.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    const out=[];
    for(let i=0;i<lines.length;i+=4)out.push(lines.slice(i,i+4));
    return out.length?out:[[]];
  }
  function render(){
    const gs=groups();
    group=Math.max(0,Math.min(group,gs.length-1));
    const lines=gs[group];
    document.getElementById('hksLyricsMiniLines79').innerHTML=lines.length
      ? lines.map(x=>`<div>${escapeHtml(x)}</div>`).join('')
      : '<div class="hksEmpty79">הדבק מילים כדי לראות איך הן מתחלקות על המסך</div>';
    document.getElementById('hksLyricsPageCount79').textContent=`מסך ${group+1} מתוך ${gs.length}`;
    document.getElementById('hksLyricsPrev79').disabled=group<=0;
    document.getElementById('hksLyricsNext79').disabled=group>=gs.length-1;
  }
  function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  textarea.addEventListener('input',()=>{group=0;render()});
  document.getElementById('hksLyricsPrev79').onclick=()=>{group--;render()};
  document.getElementById('hksLyricsNext79').onclick=()=>{group++;render()};

  const style=document.createElement('style');
  style.id='hksLyricsPreviewStyle79';
  style.textContent=`
    #hksLyricsWorkspace72{display:grid!important;grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr)!important;grid-template-rows:auto 1fr auto!important;gap:8px!important}
    #hksLyricsWorkspace72>h3{grid-column:1/-1!important}
    #hksLyricsWorkspace72>#lyricsText{grid-column:1!important;grid-row:2!important;width:100%!important;min-height:calc(100dvh - 285px)!important;height:calc(100dvh - 285px)!important}
    #hksLyricsWorkspace72>.grid{grid-column:1!important}
    #hksLyricsScreenPreview79{grid-column:2!important;grid-row:2/4!important;align-self:start;background:#07111c;border:1px solid #263747;border-radius:12px;padding:8px;direction:rtl}
    .hksPreviewHead79{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:6px;font-size:11px}
    #hksLyricsPageCount79{opacity:.75;font-size:10px;white-space:nowrap}
    #hksLyricsMiniScreen79{aspect-ratio:16/9;background:#02060b;border:1px solid #33485b;border-radius:9px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:6%;box-shadow:inset 0 0 24px #000}
    #hksLyricsMiniLines79{width:100%;text-align:center;direction:rtl;font-weight:800;font-size:clamp(13px,2vw,25px);line-height:1.45;color:#fff;text-shadow:0 2px 3px #000}
    #hksLyricsMiniLines79>div{white-space:normal;overflow-wrap:anywhere}
    #hksLyricsMiniLines79 .hksEmpty79{font-size:11px;font-weight:500;opacity:.6}
    .hksPreviewNav79{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}
    .hksPreviewNav79 .gbtn{min-height:31px!important;font-size:10px!important;padding:3px 6px!important}
    .hksPreviewNav79 .gbtn:disabled{opacity:.35}
    @media(max-width:699px){
      #hksLyricsWorkspace72{display:block!important}
      #hksLyricsWorkspace72>#lyricsText{height:44dvh!important;min-height:300px!important;margin-bottom:8px!important}
      #hksLyricsScreenPreview79{margin-top:8px!important}
    }
  `;
  document.head.appendChild(style);
  render();
  const v=document.querySelector('.version');if(v)v.textContent='Web v1.79';
})();