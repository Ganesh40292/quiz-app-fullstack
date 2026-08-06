const CACHE_NAME = "quizora-cache-v2";
const ASSETS_TO_CACHE = [
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/manifest.json"
];

// Install: Cache core static assets & immediate skip waiting
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate: Delete all legacy caches & claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing legacy cache:", cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for Navigation/HTML requests (prevents stale index.html rendering blank screen)
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // 1. Skip non-GET and API requests
  if (request.method !== "GET" || request.url.includes("/api/")) {
    return;
  }

  // 2. Navigation / HTML Requests -> Network First
  if (request.mode === "navigate" || (request.headers.get("accept") && request.headers.get("accept").includes("text/html"))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/index.html");
          });
        })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, Images) -> Stale While Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
