
// Gestionnaire des requêtes pour le Service Worker
import { staleWhileRevalidateResources, matchesPatterns, handleStaleWhileRevalidate, handleNetworkFirst } from './cache-strategies.js';

/**
 * Gestionnaire pour l'événement fetch
 * @param {FetchEvent} event - L'événement fetch
 */
const handleFetch = (event) => {
  const url = new URL(event.request.url);
  
  // Ne pas intercepter les requêtes vers Supabase ou d'autres API
  if (url.hostname.includes('supabase.co') || url.pathname.includes('/api/')) {
    return;
  }
  
  // IMPORTANT: Ne jamais intercepter les navigations, laisser React Router les gérer
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    console.log('[ServiceWorker] Navigation détectée, laissant React Router gérer:', url.pathname);
    return;
  }
  
  // Ne pas intercepter les requêtes pour les fichiers HTML
  if (url.pathname.endsWith('.html')) {
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
