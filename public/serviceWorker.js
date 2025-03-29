
// Service Worker principal - Importation des modules
import { handleInstall, handleActivate, handleMessage } from './sw/lifecycle-handlers.js';
import { handleFetch } from './sw/request-handler.js';
import { cleanupLargeCaches } from './sw/cache-management.js';

// Événements du cycle de vie
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('message', handleMessage);

// Liste des URL qui ne doivent JAMAIS être interceptées
const noInterceptPatterns = [
  '/api/',
  '/auth/',
  '/supabase',
  'supabase',
  'supabase.co',
  'auth/v1',
  'rest/v1',
  'supabse.auth',
  '.html',
  'socket',
  'ws:',
  'wss:'
];

// DÉSACTIVATION COMPLÈTE de toute interception liée à la navigation
self.addEventListener('fetch', (event) => {
  // 1. Vérifier si c'est une navigation, un document ou une requête HTML
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' || 
      event.request.url.includes('.html') ||
      event.request.headers.get('Accept')?.includes('text/html')) {
    // NE JAMAIS intercepter les navigations - essentiel pour le bon fonctionnement SPA
    return;
  }
  
  const url = new URL(event.request.url);
  
  // 2. Vérifier si l'URL correspond à des patterns à ne jamais intercepter
  const shouldNotIntercept = noInterceptPatterns.some(pattern => url.toString().includes(pattern));
  
  // 3. Ne pas intercepter les requêtes API ou système
  if (shouldNotIntercept) {
    return;
  }
  
  // 4. Ne gérer que les ressources statiques et seulement si ce sont des GET
  if (event.request.method === 'GET') {
    // Uniquement pour les ressources statiques (CSS, JS, images, etc.)
    const isStaticResource = ['style', 'script', 'image', 'font', 'audio', 'video'].includes(event.request.destination);
    
    if (isStaticResource) {
      handleFetch(event);
    }
  }
});

// Ignorer explicitement toutes les navigations
self.addEventListener('navigate', () => {
  // Ne rien faire, laisser le navigateur et React Router gérer la navigation
  return;
});

// Gestion des événements périodiques
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupLargeCaches());
  }
});
