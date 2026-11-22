const STATIC_CACHE_NAME = 'dailyvocab-static-v2';
const RUNTIME_CACHE_NAME = 'dailyvocab-runtime-v2';
const AUDIO_CACHE_NAME = 'dailyvocab-audio-v2';
const DICT_CACHE_NAME = 'dailyvocab-dict-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE_NAME, RUNTIME_CACHE_NAME, AUDIO_CACHE_NAME, DICT_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event handler with smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Dictionary & Translation APIs (Google Translate, DictionaryAPI, MyMemory)
  if (
    url.hostname.includes('translate.googleapis.com') ||
    url.hostname.includes('dictionaryapi.dev') ||
    url.hostname.includes('mymemory.translated.net')
  ) {
    event.respondWith(
      caches.open(DICT_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // If offline and not in cache, fallback gracefully
          return new Response(JSON.stringify({ error: 'offline', offline: true }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })
    );
    return;
  }

  // 2. Audio Files (.mp3, .wav, .ogg, .m4a)
  if (request.destination === 'audio' || url.pathname.match(/\.(mp3|wav|ogg|m4a)$/i)) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return new Response('', { status: 408, statusText: 'Audio Offline' });
        }
      })
    );
    return;
  }

  // 3. Static & Local App Assets (JS, CSS, HTML, Icons, Fonts)
  // Stale-While-Revalidate strategy for fast app launch
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === location.origin || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com'))
          ) {
            const cacheKey = PRECACHE_URLS.includes(url.pathname) ? STATIC_CACHE_NAME : RUNTIME_CACHE_NAME;
            caches.open(cacheKey).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          if (request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          return null;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
