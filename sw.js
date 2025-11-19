// ---------------------- Service Worker ----------------------

// Unique cache to force auto-update
const CACHE_NAME = "lokonex-v-" + Date.now();

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

// INSTALL — cache files immediately
self.addEventListener("install", (event) => {
  self.skipWaiting(); // activate SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// ACTIVATE — delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control immediately
});

// FETCH — network-first for HTML, network-first with cache fallback for other requests
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Always fetch latest index.html
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => response)
        .catch(() => caches.match("./index.html"))
    );
  } else {
    // Other requests: network-first, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return caches.match(event.request);
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

// Listen for skipWaiting message from page
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
