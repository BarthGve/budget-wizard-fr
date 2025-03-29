
// Gestionnaire des requêtes pour le Service Worker
import { staleWhileRevalidateResources, matchesPatterns, handleStaleWhileRevalidate, handleNetworkFirst } from './cache-strategies.js';

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
    console.log('[ServiceWorker] Navigation détectée dans handleFetch, ignorée:', url.pathname);
    return;
  }
  
  // Ne pas intercepter les requêtes vers Supabase ou d'autres API
  if (url.hostname.includes('supabase') || 
      url.pathname.includes('/api/') || 
      url.pathname.includes('/auth/') ||
      url.pathname.includes('/storage/')) {
    console.log('[ServiceWorker] Requête API détectée, ignorée:', url.pathname);
    return;
  }
  
  // Stratégie stale-while-revalidate pour les ressources statiques
  if (matchesPatterns(url, staleWhileRevalidateResources)) {
    event.respondWith(handleStaleWhileRevalidate(event));
    return;
  }
  
  // Stratégie Network First pour les autres requêtes
  event.respondWith(handleNetworkFirst(event));
};

export { handleFetch };
