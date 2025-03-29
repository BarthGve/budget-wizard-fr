
// Gestionnaire des requêtes pour le Service Worker
import { staleWhileRevalidateResources, matchesPatterns, handleStaleWhileRevalidate, handleNetworkFirst } from './cache-strategies.js';

// Liste des patterns d'URL qui ne doivent jamais être interceptés
const neverCachePatterns = [
  '/api/',
  '/auth/',
  'supabase',
  'auth/v1',
  'rest/v1',
  '.html',
  'socket',
  'ws:',
  'wss:'
];

/**
 * Gestionnaire pour l'événement fetch - strictement limité aux ressources statiques
 * @param {FetchEvent} event - L'événement fetch
 */
const handleFetch = (event) => {
  // Si c'est une navigation, ne JAMAIS intercepter
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Ne pas intercepter les requêtes HTML
  if (url.pathname.endsWith('.html')) {
    return;
  }
  
  // Vérifier si l'URL contient l'un des patterns à ne jamais mettre en cache
  const shouldNeverCache = neverCachePatterns.some(pattern => url.toString().includes(pattern));
  
  // Ne pas intercepter les requêtes API
  if (shouldNeverCache) {
    return;
  }
  
  // Stratégie stale-while-revalidate uniquement pour les ressources statiques
  if (matchesPatterns(url, staleWhileRevalidateResources)) {
    event.respondWith(handleStaleWhileRevalidate(event));
    return;
  }
  
  // Stratégie Network First pour les autres ressources non-navigation
  if (event.request.method === 'GET') {
    event.respondWith(handleNetworkFirst(event));
  }
};

export { handleFetch };
