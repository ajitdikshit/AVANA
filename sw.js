const CACHE_NAME = 'avana-core-v4';

// 1. Pass the Chrome Offline Test by caching ONLY the absolute essentials
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/AVANA/',
        '/AVANA/index.html',
        '/AVANA/icon-192.png',
        '/AVANA/icon-512.png'
      ]);
    }).catch(err => console.log('Offline test cache failed, but continuing.', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// 2. "Lazy Load" everything else so we never get missing file errors
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If we already saved it, return it immediately!
      if (cachedResponse) return cachedResponse;
      
      // Otherwise, fetch it from the internet and save it for next time
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // Only cache our own files, not external API calls (like Hugging Face)
          if (event.request.url.startsWith(self.location.origin)) {
             cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
