
// Gestion du cache pour le Service Worker
import { CACHE_NAME } from './cache-strategies.js';

/**
 * Nettoie les caches obsolètes
 * @returns {Promise} - Promise résolue lorsque le nettoyage est terminé
 */
const cleanupOldCaches = async () => {
  const cacheWhitelist = [CACHE_NAME];
  
  return caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          console.log('[ServiceWorker] Suppression de l\'ancien cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });
};

/**
 * Nettoie les caches trop volumineux
 * @returns {Promise} - Promise résolue lorsque le nettoyage est terminé
 */
const cleanupLargeCaches = async () => {
  return caches.open(CACHE_NAME).then(cache => {
    // Limiter le cache à 50 Mo
    const MAX_CACHE_SIZE = 50 * 1024 * 1024;
    let currentSize = 0;
    const itemsToDelete = [];
    
    return cache.keys().then(keys => {
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
  });
};

export { cleanupOldCaches, cleanupLargeCaches };
