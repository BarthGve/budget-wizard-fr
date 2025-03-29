
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

// Désactiver COMPLÈTEMENT l'interception des requêtes de navigation
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Vérifier si l'URL contient l'un des patterns à ne pas intercepter
  const shouldNotIntercept = noInterceptPatterns.some(pattern => url.toString().includes(pattern));
  
  // Ne JAMAIS intercepter les navigations, requêtes HTML, routes d'API ou patterns spécifiques
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' ||
      shouldNotIntercept) {
    // Laisser le navigateur et React Router gérer normalement
    return;
  }
  
  // Pour les ressources statiques uniquement, utiliser le gestionnaire normal
  handleFetch(event);
});

// Ignorer explicitement toutes les navigations
self.addEventListener('navigate', (event) => {
  // Ne rien faire, laisser le navigateur et React Router gérer la navigation
  return;
});

// Gestion des événements périodiques
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupLargeCaches());
  }
});
