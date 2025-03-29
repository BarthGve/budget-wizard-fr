
// Service Worker principal - Importation des modules
import { handleInstall, handleActivate, handleMessage } from './sw/lifecycle-handlers.js';
import { handleFetch } from './sw/request-handler.js';
import { cleanupLargeCaches } from './sw/cache-management.js';

// Événements du cycle de vie
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('message', handleMessage);

// Désactiver COMPLÈTEMENT l'interception des requêtes de navigation
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ne JAMAIS intercepter les navigations, requêtes HTML ou routes d'API
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' ||
      url.pathname.endsWith('.html') ||
      url.pathname.includes('/api/') || 
      url.pathname.includes('/auth/') ||
      url.hostname.includes('supabase')) {
    // Laisser le navigateur et React Router gérer normalement
    console.log('[ServiceWorker] Navigation/HTML détectée, non interceptée:', url.pathname);
    return;
  }
  
  // Pour les ressources statiques uniquement, utiliser le gestionnaire normal
  handleFetch(event);
});

// Ignorer explicitement toutes les navigations
self.addEventListener('navigate', (event) => {
  // Ne rien faire, laisser le navigateur et React Router gérer la navigation
  console.log('[ServiceWorker] Navigation explicitement ignorée:', event.url);
  return;
});

// Gestion des événements périodiques
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupLargeCaches());
  }
});
