const CACHE_NAME = 'avana-cache-v3'; // Changed to v3 to force an update!
const urlsToCache = [
  './',
  './index.html',
  './garden.html',
  './community.html',
  './wiki.html',
  './diseases.html',
  './icon-192.png',
  './icon-512.png'
];

// Install the Service Worker and Cache Files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve Cached Files when Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached version if found, otherwise fetch from the network
        return response || fetch(event.request);
      })
  );
});
