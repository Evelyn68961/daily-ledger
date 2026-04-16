// Daily Ledger service worker
// Strategy: cache-first for the app shell so it works offline.
// Bump CACHE_VERSION whenever you change any cached file, so clients fetch fresh.
const CACHE_VERSION = 'daily-ledger-v1';

// The app shell — everything the app needs to render offline.
// Chart.js is pulled from CDN; it's cached opportunistically on first load.
const SHELL = [
  './',
  './index.html',
  './about.html',
  './analyze.html',
  './styles.css',
  './manifest.webmanifest',
  './favicon.svg',
  './favicon.ico',
  './favicon-16.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

// On install: pre-cache the shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

// On activate: wipe old caches from previous versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// On fetch: cache-first, then network, and opportunistically cache new GETs.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle GET; let POST/PUT/etc. pass through.
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Cache successful responses (including the Chart.js CDN hit).
        // Don't cache opaque errors or non-basic cross-origin things we can't inspect.
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => {
        // Offline and not in cache. For navigation requests, fall back to index.html
        // so deep links still work when offline.
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'offline' });
      });
    })
  );
});
