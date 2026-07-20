// Lightweight first-party visitor analytics. Loaded by the Header on every
// public page. Sends two anonymous beacons to /api/track: a 'view' when the
// page loads, and a 'leave' with the seconds the page was actually visible
// (accumulated across tab switches, flushed on hide/unload via sendBeacon).
// Visitor uniqueness is a localStorage flag — no cookies, no IDs sent.

function send(data) {
  try {
    const body = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {});
    }
  } catch (e) {}
}

export function trackPage() {
  if (window.__nesuTracked) return;
  window.__nesuTracked = true;

  let path = location.pathname
    .replace(/\/index\.dc\.html$/, '/')
    .replace(/\.dc\.html$/, '');
  if (!path) path = '/';
  if (path.indexOf('admin') !== -1) return;
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  let newVisitor = false;
  let newToday = false;
  try {
    if (!localStorage.getItem('nesu-vseen')) {
      localStorage.setItem('nesu-vseen', '1');
      newVisitor = true;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('nesu-vday') !== today) {
      localStorage.setItem('nesu-vday', today);
      newToday = true;
    }
  } catch (e) {}

  send({ type: 'view', path, newVisitor, newToday });

  let visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
  let accum = 0;
  const flush = () => {
    if (visibleSince != null) {
      accum += performance.now() - visibleSince;
      visibleSince = null;
    }
    const seconds = Math.round(accum / 1000);
    if (seconds > 0) {
      send({ type: 'leave', path, seconds });
      accum = 0;
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
    else if (visibleSince == null) visibleSince = performance.now();
  });
  window.addEventListener('pagehide', flush);
}
