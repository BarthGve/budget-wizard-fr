
// Service Worker principal - Importation des modules
import { handleInstall, handleActivate, handleMessage } from './sw/lifecycle-handlers.js';
import { handleFetch } from './sw/request-handler.js';
import { cleanupLargeCaches } from './sw/cache-management.js';

// Événements du cycle de vie
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('message', handleMessage);

// Désactiver complètement l'interception des requêtes de navigation
// mais conserver l'interception pour les ressources statiques
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ne jamais intercepter les navigations ou requêtes HTML
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' ||
      url.pathname.endsWith('.html')) {
    console.log('[ServiceWorker] Navigation détectée, ignorée:', event.request.url);
    return;
  }
  
  // Pour toutes les autres requêtes, utiliser le gestionnaire normal
  handleFetch(event);
});

// Désactiver explicitement l'interception des navigations
self.addEventListener('navigate', (event) => {
  // Ne rien faire, laisser le navigateur et React Router gérer la navigation
  console.log('[ServiceWorker] Navigation événement détecté, laissant passer:', event.url);
  return;
});

// Gestion des événements périodiques
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupLargeCaches());
  }
});
