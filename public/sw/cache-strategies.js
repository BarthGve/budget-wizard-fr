
// Stratégies de mise en cache pour le Service Worker

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

// Fonction pour vérifier si une URL correspond à un pattern dans une liste
const matchesPatterns = (url, patterns) => {
  const urlString = url.toString();
  return patterns.some(pattern => {
    return typeof pattern === 'string' ? urlString.includes(pattern) : pattern.test(urlString);
  });
};

/**
 * Applique la stratégie stale-while-revalidate pour les ressources statiques
 * @param {FetchEvent} event - L'événement fetch intercepté
 * @returns {Promise<Response>} - La réponse à retourner
 */
const handleStaleWhileRevalidate = async (event) => {
  return caches.open(CACHE_NAME).then(cache => {
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
  });
};

/**
 * Applique la stratégie network-first pour les requêtes dynamiques
 * @param {FetchEvent} event - L'événement fetch intercepté
 * @returns {Promise<Response>} - La réponse à retourner
 */
const handleNetworkFirst = async (event) => {
  return fetch(event.request)
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
    });
};

export { 
  CACHE_NAME, 
  urlsToCache, 
  staleWhileRevalidateResources, 
  matchesPatterns, 
  handleStaleWhileRevalidate, 
  handleNetworkFirst 
};
