
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
 * Gestionnaire pour l'événement fetch
 * @param {FetchEvent} event - L'événement fetch
 */
const handleFetch = (event) => {
  const url = new URL(event.request.url);
  
  // Vérifier si la requête est une navigation ou une requête HTML
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' ||
      url.pathname.endsWith('.html')) {
    return;
  }
  
  // Vérifier si l'URL contient l'un des patterns à ne jamais mettre en cache
  const shouldNeverCache = neverCachePatterns.some(pattern => url.toString().includes(pattern));
  
  // Ne pas intercepter les requêtes qui ne doivent jamais être mises en cache
  if (shouldNeverCache) {
    return;
  }
  
  // Stratégie stale-while-revalidate pour les ressources statiques uniquement
  if (matchesPatterns(url, staleWhileRevalidateResources)) {
    event.respondWith(handleStaleWhileRevalidate(event));
    return;
  }
  
  // Stratégie Network First pour les autres requêtes non-navigation
  event.respondWith(handleNetworkFirst(event));
};

export { handleFetch };
