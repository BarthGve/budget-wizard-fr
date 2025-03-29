
// Nom du cache pour stocker les ressources
const CACHE_NAME = 'budget-wizard-cache-v2';

// Liste des ressources à mettre en cache lors de l'installation
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable_icon.png',
  '/icons/apple-touch-icon.png',
];

// Liste des ressources statiques à mettre en cache avec stale-while-revalidate
const staleWhileRevalidateResources = [
  /\.css$/,
  /\.js$/,
  /\.woff2?$/,
  /\.svg$/,
  /\.jpg$/,
  /\.png$/,
  /\.webp$/
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Mise en cache des ressources essentielles');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force le service worker à devenir le service worker actif
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activation');
  const cacheWhitelist = [CACHE_NAME];
  
  // Nettoyage des anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[ServiceWorker] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[ServiceWorker] Service Worker activé et prêt à contrôler les clients');
      // Demande au SW de prendre le contrôle immédiatement
      return self.clients.claim();
    })
  );
});

// Fonction pour vérifier si une URL correspond à un pattern dans une liste
const matchesPatterns = (url, patterns) => {
  const urlString = url.toString();
  return patterns.some(pattern => {
    return typeof pattern === 'string' ? urlString.includes(pattern) : pattern.test(urlString);
  });
};

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ne pas intercepter les requêtes vers Supabase ou d'autres API
  if (url.hostname.includes('supabase.co') || url.pathname.includes('/api/')) {
    return;
  }
  
  // Stratégie stale-while-revalidate pour les ressources statiques
  if (matchesPatterns(url, staleWhileRevalidateResources)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              console.log('[ServiceWorker] Échec de récupération depuis le réseau');
              // Retourner null pour que le code continue à utiliser la réponse mise en cache
              return null;
            });
          
          // Retourner la réponse mise en cache ou sinon la réponse du réseau
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // Stratégie Network First pour les autres requêtes
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la réponse est valide, nous la mettons en cache
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              // Mise en cache uniquement pour les GET
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec réseau, essayer de récupérer depuis le cache
        console.log('[ServiceWorker] Récupération depuis le cache après échec réseau pour:', event.request.url);
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Si la page n'est pas dans le cache, essayer de servir la page d'accueil
            // uniquement pour les navigations HTML (pas pour les assets)
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // Si rien ne correspond, retourner une erreur simple
            return new Response('Hors ligne et aucune version mise en cache disponible.', {
              status: 503,
              statusText: 'Service indisponible',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Gestion des messages pour les mises à jour
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Fonction pour nettoyer les caches trop volumineux
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        // Limiter le cache à 50 Mo
        const MAX_CACHE_SIZE = 50 * 1024 * 1024;
        let currentSize = 0;
        const itemsToDelete = [];
        
        cache.keys().then(keys => {
          const promises = keys.map(key => {
            return cache.match(key).then(response => {
              const size = response.headers.get('content-length') || 0;
              currentSize += parseInt(size, 10);
              return { key, size, lastAccessed: Date.now() };
            });
          });
          
          return Promise.all(promises).then(items => {
            // Si le cache est trop grand, supprimer les éléments les moins récemment utilisés
            if (currentSize > MAX_CACHE_SIZE) {
              items.sort((a, b) => a.lastAccessed - b.lastAccessed);
              
              let sizeToFree = currentSize - MAX_CACHE_SIZE;
              for (const item of items) {
                if (sizeToFree <= 0) break;
                itemsToDelete.push(item.key);
                sizeToFree -= item.size;
              }
              
              return Promise.all(itemsToDelete.map(key => cache.delete(key)));
            }
          });
        });
      })
    );
  }
});

