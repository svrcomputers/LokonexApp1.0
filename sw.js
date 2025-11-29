// FIXED SERVICE WORKER - With Auto Updates
const CACHE_NAME = 'lokonex-v10'; // ✅ FIXED: Constant name

// ONLY cache essential files
const urlsToCache = [
  '/',
  '/index.html'
];

// Install - cache basic files
self.addEventListener('install', event => {
  self.skipWaiting(); // ✅ Take control immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate - delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // ✅ Clear old versions
          }
        })
      );
    })
  );
  self.clients.claim(); // ✅ Take control of all tabs
});

// Fetch - NETWORK FIRST (always fresh content)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request) // ✅ Always try network first
      .catch(() => caches.match(event.request))
  );
});




