const CACHE_NAME = "avana-cache-v1";

// List of local files to cache (Using strict GitHub Pages paths)
const FILES_TO_CACHE = [
  "/AVANA/",
  "/AVANA/index.html",
  "/AVANA/garden.html",
  "/AVANA/community.html",
  "/AVANA/wiki.html",
  "/AVANA/diseases.html",
  "/AVANA/icon-192.png",
  "/AVANA/icon-512.png"
];

// Install service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Caching app shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate service worker and clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", event => {
  // We don't want to cache Firebase database calls, so we skip them
  if (event.request.url.includes("firebasedatabase.app") || event.request.url.includes("firebaseio.com")) {
      return; 
  }

  // Cache-first for local app files
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Offline fallback
        if (event.request.mode === "navigate") {
          return caches.match("/AVANA/index.html");
        }
      });
    })
  );
});
