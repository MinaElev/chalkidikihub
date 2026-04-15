const CACHE_NAME = 'halkidikihub-v2';
const API_CACHE = 'halkidikihub-api-v1';
const STATIC_CACHE = 'halkidikihub-static-v1';
const OFFLINE_URL = '/offline.html';

// Static assets to pre-cache
const PRECACHE_URLS = [
  OFFLINE_URL,
  '/images/hero/halkidiki-hero.webp',
];

// API routes eligible for stale-while-revalidate caching
const CACHEABLE_API = [
  '/api/areas',
  '/api/beaches',
  '/api/restaurants',
  '/api/activities',
  '/api/listings',
  '/api/villages',
  '/api/blog',
];

// Install - cache offline page + critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  const keepCaches = [CACHE_NAME, API_CACHE, STATIC_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !keepCaches.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Check if a request URL matches cacheable API routes
function isCacheableApi(url) {
  return CACHEABLE_API.some((path) => url.pathname.startsWith(path));
}

// Check if request is for a static asset (images, fonts, CSS, JS)
function isStaticAsset(url) {
  return /\.(webp|png|jpg|jpeg|svg|gif|ico|woff2?|css|js)$/i.test(url.pathname);
}

// Stale-while-revalidate: serve from cache immediately, update in background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Always fetch fresh copy in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);

  // Return cached version immediately if available, otherwise wait for network
  if (cached) return cached;
  const networkResponse = await fetchPromise;
  return networkResponse || cached;
}

// Fetch handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // API requests: stale-while-revalidate (fast + fresh)
  if (isCacheableApi(url) && event.request.method === 'GET') {
    event.respondWith(staleWhileRevalidate(event.request, API_CACHE));
    return;
  }

  // Static assets: cache-first (immutable-ish)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }
});
