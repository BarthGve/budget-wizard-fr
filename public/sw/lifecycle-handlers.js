
// Gestionnaires du cycle de vie du Service Worker
import { CACHE_NAME, urlsToCache } from './cache-strategies.js';
import { cleanupOldCaches } from './cache-management.js';

/**
 * Gestionnaire pour l'événement d'installation
 * @param {Event} event - L'événement d'installation
 */
const handleInstall = (event) => {
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
};

/**
 * Gestionnaire pour l'événement d'activation
 * @param {Event} event - L'événement d'activation
 */
const handleActivate = (event) => {
  console.log('[ServiceWorker] Activation');
  
  event.waitUntil(
    cleanupOldCaches()
      .then(() => {
        console.log('[ServiceWorker] Service Worker activé et prêt à contrôler les clients');
        // Demande au SW de prendre le contrôle immédiatement
        return self.clients.claim();
      })
  );
};

/**
 * Gestionnaire pour l'événement message
 * @param {MessageEvent} event - L'événement message
 */
const handleMessage = (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
};

export { handleInstall, handleActivate, handleMessage };
