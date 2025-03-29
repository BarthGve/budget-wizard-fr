
// Fichier pour enregistrer le service worker

// Variable pour éviter les rechargements multiples
let refreshing = false;

/**
 * Enregistre le service worker avec un délai important pour ne pas interférer
 * avec le chargement initial et la navigation SPA
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Attendre BEAUCOUP plus longtemps pour l'enregistrement
    const registrationDelay = 30000; // 30 secondes de délai
    
    console.log(`[SW] Enregistrement du Service Worker programmé dans ${registrationDelay/1000}s...`);
    
    // Vérifier si un service worker est déjà actif
    if (navigator.serviceWorker.controller) {
      console.log('[SW] Service Worker déjà actif, mise à jour si nécessaire');
      
      // Si déjà installé, on se contente de planifier une mise à jour
      navigator.serviceWorker.ready.then(registration => {
        registration.update().catch(error => {
          console.error('[SW] Erreur lors de la mise à jour du Service Worker:', error);
        });
      });
      
      return;
    }
    
    // Délai très important pour laisser l'application SPA se stabiliser
    setTimeout(() => {
      navigator.serviceWorker.register('/serviceWorker.js', {
        // Limiter la portée du service worker
        scope: '/',
        // Utiliser le mode "none" pour la mise à jour du cache
        updateViaCache: 'none'
      })
        .then(registration => {
          console.log('[SW] Service Worker enregistré avec succès:', registration.scope);
          
          // Vérifier s'il y a une mise à jour disponible
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[SW] Nouvelle version du Service Worker trouvée...');
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouveau Service Worker disponible, notifier l'utilisateur
                  notifyUserOfUpdate();
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('[SW] Erreur lors de l\'enregistrement du Service Worker:', error);
        });
        
      // Écouter les messages des autres onglets concernant les mises à jour
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        console.log('[SW] Service Worker Controller changé, rechargement...');
        
        // Ne pas recharger immédiatement - planifier pour après les navigations en cours
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3 secondes pour être sûr que toute navigation en cours est terminée
      });
    }, registrationDelay);
  }
}

// Fonction pour vérifier les mises à jour du service worker
export function checkForSWUpdates() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    console.log('[SW] Vérification des mises à jour du Service Worker...');
    navigator.serviceWorker.ready.then(registration => {
      registration.update().catch(error => {
        console.error('[SW] Erreur lors de la vérification des mises à jour:', error);
      });
    });
  }
}

// Fonction pour notifier l'utilisateur d'une mise à jour
function notifyUserOfUpdate() {
  // Créer un événement personnalisé pour notifier l'application qu'une mise à jour est disponible
  const updateEvent = new CustomEvent('serviceWorkerUpdateAvailable');
  window.dispatchEvent(updateEvent);
  console.log('[SW] Événement de mise à jour déclenché');
}

// Pour forcer un service worker à prendre le contrôle immédiatement
export function updateServiceWorker() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    console.log('[SW] Activation de la mise à jour du Service Worker...');
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        // Envoyer un message au service worker en attente pour qu'il prenne le contrôle
        registration.waiting.postMessage({ action: 'skipWaiting' });
        console.log('[SW] Message skipWaiting envoyé au Service Worker en attente');
      } else {
        console.log('[SW] Aucune mise à jour du Service Worker en attente.');
      }
    });
  }
}

// Enregistrer le gestionnaire d'événements pour le nettoyage périodique du cache
export function registerPeriodicCacheCleanup() {
  // Vérifier si la fonctionnalité periodicSync est disponible
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(async (registration) => {
      // Vérifier si l'API periodicSync existe dans le navigateur
      if ('periodicSync' in registration && 'PeriodicSyncManager' in window) {
        try {
          await (registration as any).periodicSync.register('cache-cleanup', {
            minInterval: 24 * 60 * 60 * 1000, // Une fois par jour
          });
          console.log('[SW] Nettoyage périodique du cache enregistré');
        } catch (error) {
          console.log('[SW] Le nettoyage périodique du cache n\'est pas pris en charge', error);
        }
      } else {
        console.log('[SW] L\'API Periodic Sync n\'est pas disponible dans ce navigateur');
      }
    });
  }
}

// Désinstaller complètement le service worker (utile pour le débogage)
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister().then(success => {
        if (success) {
          console.log('[SW] Service Worker désinstallé avec succès');
          if (window.caches) {
            // Effacer tous les caches
            window.caches.keys().then(cacheNames => {
              return Promise.all(
                cacheNames.map(cacheName => {
                  return window.caches.delete(cacheName);
                })
              );
            }).then(() => {
              console.log('[SW] Tous les caches ont été supprimés');
            });
          }
        } else {
          console.log('[SW] Échec de la désinstallation du Service Worker');
        }
      });
    });
  }
}
