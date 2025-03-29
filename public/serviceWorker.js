
// Service Worker principal - Importation des modules
import { handleInstall, handleActivate, handleMessage } from './sw/lifecycle-handlers.js';
import { handleFetch } from './sw/request-handler.js';
import { cleanupLargeCaches } from './sw/cache-management.js';

// Événements du cycle de vie
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
self.addEventListener('message', handleMessage);

// Ajout d'un gestionnaire spécifique pour les navigations
self.addEventListener('navigate', (event) => {
  // Laisser le navigateur gérer les navigations normalement
  // Ne pas interférer avec React Router
  return;
});

// Gestion des événements périodiques
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupLargeCaches());
  }
});
