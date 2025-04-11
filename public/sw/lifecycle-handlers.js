
// Gestion de l'installation du Service Worker
export function handleInstall(event) {
  console.log('[Service Worker] Installation');
  // Cacher les ressources essentielles
  event.waitUntil(
    caches.open('static-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.ico'
      ]);
    })
  );
}

// Gestion de l'activation du Service Worker
export function handleActivate(event) {
  console.log('[Service Worker] Activation');
  // Nettoyer les anciens caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('static-') && cacheName !== 'static-v1';
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
}

// Gestion des messages envoyés au Service Worker
export function handleMessage(event) {
  console.log('[Service Worker] Message reçu:', event.data);
  
  // Gérer le message SKIP_WAITING pour activer immédiatement le nouveau SW
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skip waiting et activation immédiate');
    self.skipWaiting();
    
    // Notifier les clients que le SW a été mis à jour
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
    });
  }
}
