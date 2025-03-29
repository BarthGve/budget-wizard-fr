
// Service Worker principal - Importation des modules
import { handleInstall, handleActivate, handleMessage } from './sw/lifecycle-handlers.js';
import { handleFetch } from './sw/request-handler.js';
import { cleanupLargeCaches } from './sw/cache-management.js';

// Événements du cycle de vie
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
self.addEventListener('message', handleMessage);

// Gestion des événements périodiques
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupLargeCaches());
  }
});
