// Hebrew Karaoke Studio — v1.87
(() => {
  const icon = '433A5E98-4A3F-40B9-A6D0-91B22FF5B848.png?v=87';

  let touch = document.querySelector('link[rel="apple-touch-icon"]');
  if (!touch) {
    touch = document.createElement('link');
    touch.rel = 'apple-touch-icon';
    document.head.appendChild(touch);
  }
  touch.href = icon;

  const ensureMeta = (name, content) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  };

  ensureMeta('apple-mobile-web-app-capable', 'yes');
  ensureMeta('apple-mobile-web-app-title', 'Avi Karaoke');

  console.log('[v87] AFD app icon metadata enabled');
})();