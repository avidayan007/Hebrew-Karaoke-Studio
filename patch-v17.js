// Hebrew Karaoke Studio Web v1.7 hotfix
// 1) Load ffmpeg.wasm with an explicit same-origin blob class worker for iPhone Safari.
// 2) Keep the synchronization controls visible at the top while scrolling words.

(function(){
  const $ = s => document.querySelector(s);

  // Move the existing synchronization control row above the word list instead of duplicating buttons.
  const wordList = $('#wordList');
  const syncButton = $('#syncBtn2');
  const syncControls = syncButton?.closest('.grid4');
  if (wordList && syncControls) {
    syncControls.classList.add('syncTopControls');
    wordList.parentNode.insertBefore(syncControls, wordList);
  }

  const style = document.createElement('style');
  style.textContent = `
    #sync .syncTopControls{
      position:sticky;
      top:112px;
      z-index:8;
      margin:8px -4px 10px !important;
      padding:8px 4px;
      background:linear-gradient(#0b1622f8,#0b1622f2);
      border-top:1px solid #263747;
      border-bottom:1px solid #263747;
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
    }
    #sync .syncTopControls #syncBtn2{min-height:58px;font-size:18px;box-shadow:0 0 0 2px #45d17355,2px 5px 3px #010509}
    @media(max-width:600px){#sync .syncTopControls{top:106px}.grid4.syncTopControls{grid-template-columns:repeat(2,1fr)}}
  `;
  document.head.appendChild(style);

  // Replace the loader used by renderDual(). The previous CDN ESM build could leave Safari
  // waiting on a cross-origin worker forever. classWorkerURL is converted to a blob URL.
  loadFFmpeg = async function(){
    if (ffmpegInstance) return ffmpegInstance;
    setExportState('טוען מנוע רינדור…', 3);

    const withTimeout = (promise, ms, message) => Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
    ]);

    const pkgBase = 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm';
    const utilUrl = 'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.2/dist/esm/index.js';
    const coreBase = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';

    setExportState('טוען את ספריית הרינדור…', 4);
    const modules = await withTimeout(Promise.all([
      import(pkgBase + '/index.js'),
      import(utilUrl)
    ]), 30000, 'מנוע הרינדור לא נטען מהרשת');

    const {FFmpeg} = modules[0];
    const {fetchFile, toBlobURL} = modules[1];
    const ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({message}) => console.log('[ffmpeg]', message));
    ffmpeg.on('progress', ({progress}) => {
      const p = Math.max(0, Math.min(1, progress || 0));
      if (renderStage === 'mp4') setExportState('מרנדר MP4…', 10 + p * 65);
      else if (renderStage === 'wmv') setExportState('יוצר WMV…', 78 + p * 20);
    });

    setExportState('מפעיל את מנוע הרינדור…', 5);
    const urls = await withTimeout(Promise.all([
      toBlobURL(coreBase + '/ffmpeg-core.js', 'text/javascript'),
      toBlobURL(coreBase + '/ffmpeg-core.wasm', 'application/wasm'),
      toBlobURL(pkgBase + '/worker.js', 'text/javascript')
    ]), 60000, 'קבצי מנוע הרינדור לא ירדו');

    await withTimeout(ffmpeg.load({
      coreURL: urls[0],
      wasmURL: urls[1],
      classWorkerURL: urls[2]
    }), 60000, 'מנוע הרינדור לא הצליח להיפתח במכשיר');

    ffmpegFetchFile = fetchFile;
    ffmpegInstance = ffmpeg;
    setExportState('מנוע הרינדור מוכן', 7);
    return ffmpeg;
  };

  // Make sure the export button always uses the current render function after the patch loads.
  const exportBtn = $('#dualExportBtn');
  if (exportBtn) exportBtn.onclick = renderDual;
})();
