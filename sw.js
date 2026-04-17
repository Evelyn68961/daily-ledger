// Daily Ledger service worker
// Strategy: network-first so updates appear immediately;
// falls back to cache when offline.
const CACHE_NAME = 'daily-ledger-v2';

// The app shell — everything the app needs to render offline.
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

// On install: pre-cache the shell so offline works from the start.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

// On activate: wipe old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// On fetch: network-first, fall back to cache when offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req).then((res) => {
      // Update the cache with the fresh response.
      if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
      }
      return res;
    }).catch(() => {
      // Network failed — serve from cache.
      return caches.match(req).then((cached) => {
        if (cached) return cached;
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'offline' });
      });
    })
  );
});
