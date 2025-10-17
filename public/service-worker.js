// public/service-worker.js

const CACHE_NAME = 'jogos-be-cache-v2';
const OFFLINE_URL = '/index.html';

// Recursos essenciais para cache inicial
const urlsToCache = [
  '/',
  '/index.html',
];

// Instala o Service Worker e adiciona arquivos ao cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Ativa o novo SW e remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Intercepta requisições de rede
self.addEventListener('fetch', (event) => {
  // Ignora chamadas de extensões ou outros protocolos
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache se disponível
      if (response) {
        return response;
      }

      // Tenta buscar da rede e atualiza o cache
      return fetch(event.request)
        .then((networkResponse) => {
          // Evita cachear respostas inválidas
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Fallback para quando offline
          return caches.match(OFFLINE_URL);
        });
    })
  );
});
