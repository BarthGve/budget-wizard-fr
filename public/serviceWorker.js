
// Nom du cache pour stocker les ressources
const CACHE_NAME = 'budget-wizard-cache-v1';

// Liste des ressources à mettre en cache lors de l'installation
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Vous pouvez ajouter d'autres ressources essentielles ici
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Supprimer les caches qui ne sont plus nécessaires
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Stratégie "Network First, fallback to Cache"
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si nous avons une réponse valide, mettez-la en cache
        if (event.request.method === 'GET' && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Si la connexion échoue, essayez de récupérer depuis le cache
        return caches.match(event.request);
      })
  );
});

// Gestion des messages (pour mettre à jour le cache)
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
