const CACHE_NAME = 'ruachagent-v2';
const ASSETS_TO_CACHE = [
  '/',           // This automatically serves your root index.html in Vite
  '/manifest.json',
  '/favicon.ico'
];

// Install Event - Caching App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Cleaning old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First Strategy for Supabase Compatibility 
self.addEventListener('fetch', (event) => {
  // Skip caching for Supabase API requests and webhooks so your real-time data stays live
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  if (event.request.method !== 'GET') {
    return;
  }

  const isMediaRequest = ['audio', 'video'].includes(event.request.destination);

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Avoid caching large media files or rewritten HTML as media.
        if (
          !isMediaRequest &&
          response.status === 200 &&
          !response.headers.get('content-type')?.includes('text/html')
        ) {
          const responseClone = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone))
              .catch((error) => {
                console.warn('RuachAgent cache write failed:', error);
              })
          );
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        if (event.request.mode === 'navigate') {
          const cachedAppShell = await caches.match('/');
          if (cachedAppShell) return cachedAppShell;
        }

        return new Response(null, {
          status: 503,
          statusText: 'Offline',
          headers: {
            'Content-Type': isMediaRequest ? 'video/mp4' : 'text/plain',
          },
        });
      })
  );
});