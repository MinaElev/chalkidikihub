// ChalkidikiHub service worker: makes the site installable and lets pages the
// visitor has already opened load without signal (common on Sithonia's
// beaches). Pages are always fetched fresh first; the cache is only the
// fallback, so nobody ever sees a stale page while online.
//
// It also removes the caches of v3's old worker, which served stale API data.

const VERSION = 'v4-1';
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const MAX_PAGES = 40;
const MAX_ASSETS = 200; // old build files pile up across deploys otherwise

// Back-office and per-person pages are never stored.
const PRIVATE = /^\/(?:[a-z]{2}\/)?(?:admin|dashboard|auth|requests|r|guest|host)(?:\/|$)/;

const OFFLINE_HTML = `<!doctype html><html lang="el"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>ChalkidikiHub · offline</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#f0f9ff;color:#0f172a;text-align:center;padding:24px}
h1{font-size:22px;margin:0 0 8px}p{margin:4px 0;color:#475569}button{margin-top:20px;padding:12px 22px;border:0;border-radius:12px;background:#0e7596;color:#fff;font-size:16px;font-weight:600}</style></head>
<body><main><h1>Δεν υπάρχει σύνδεση</h1><p>Οι σελίδες που έχετε ήδη ανοίξει λειτουργούν και χωρίς σήμα.</p>
<p lang="en">You are offline. Pages you have already opened still work.</p>
<button onclick="location.reload()">↻</button></main></body></html>`;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([PAGES, ASSETS]);
    for (const key of await caches.keys()) if (!keep.has(key)) await caches.delete(key);
    await self.clients.claim();
  })());
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first, the stored copy only when offline.
  if (req.mode === 'navigate') {
    if (PRIVATE.test(url.pathname)) return;
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          event.waitUntil(caches.open(PAGES).then((c) => c.put(req, copy)).then(() => trim(PAGES, MAX_PAGES)));
        }
        return res;
      } catch {
        const cached = await caches.match(req, { ignoreSearch: false });
        return cached || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  // Build files carry a content hash in their name: safe to serve from cache forever.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      if (res.ok) {
        const copy = res.clone();
        event.waitUntil(caches.open(ASSETS).then((c) => c.put(req, copy)).then(() => trim(ASSETS, MAX_ASSETS)));
      }
      return res;
    })());
    return;
  }

  // Site images and icons keep their names when replaced: serve the stored copy, refresh it in the background.
  if (url.pathname.startsWith('/icons/') || url.pathname.startsWith('/images/')) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      const refresh = fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(ASSETS).then((c) => c.put(req, copy));
        }
        return res;
      });
      if (cached) {
        event.waitUntil(refresh.catch(() => {}));
        return cached;
      }
      return refresh;
    })());
    return;
  }

  // Everything else (API, data, third parties) goes straight to the network.
});
