
// Fichier pour enregistrer le service worker

// Variable pour éviter les rechargements multiples
let refreshing = false;

/**
 * Enregistre le service worker avec un délai important pour ne pas interférer
 * avec le chargement initial et la navigation SPA
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Vérifier si une navigation SPA est en cours
    if (sessionStorage.getItem('navigation_in_progress') === 'true') {
      console.log('[SW] Navigation en cours, report de l\'enregistrement');
      // Réessayer plus tard
      setTimeout(() => registerServiceWorker(), 30000);
      return;
    }
    
    // Vérifier si un service worker est déjà actif
    if (navigator.serviceWorker.controller) {
      console.log('[SW] Service Worker déjà actif, mise à jour programmée');
      
      // Planifier une mise à jour différée
      setTimeout(() => {
        navigator.serviceWorker.ready.then(registration => {
          registration.update().catch(error => {
            console.error('[SW] Erreur lors de la mise à jour du Service Worker:', error);
          });
        });
      }, 300000); // 5 minutes
      
      return;
    }

    console.log('[SW] Tentative d\'enregistrement du Service Worker...');
    
    try {
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
        
        // Attendre un moment avant de recharger pour éviter les problèmes pendant la navigation
        refreshing = true;
        console.log('[SW] Controller changé, rechargement planifié...');
        
        // Ne recharger que si aucune navigation n'est en cours
        setTimeout(() => {
          if (sessionStorage.getItem('navigation_in_progress') !== 'true') {
            console.log('[SW] Rechargement de la page suite au changement de controller');
            window.location.reload();
          } else {
            console.log('[SW] Navigation en cours, annulation du rechargement');
            refreshing = false;
          }
        }, 5000); // Attendre 5 secondes pour éviter les interférences
      });
    } catch (err) {
      console.error('[SW] Exception lors de l\'enregistrement du SW:', err);
    }
  }
}

// Fonction pour vérifier les mises à jour du service worker
export function checkForSWUpdates() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Ne pas vérifier pendant une navigation
    if (sessionStorage.getItem('navigation_in_progress') === 'true') {
      console.log('[SW] Navigation en cours, vérification reportée');
      return;
    }
    
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
    // Ne pas activer pendant une navigation
    if (sessionStorage.getItem('navigation_in_progress') === 'true') {
      console.log('[SW] Navigation en cours, activation reportée');
      setTimeout(updateServiceWorker, 5000);
      return;
    }
    
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

// Ajouter un gestionnaire pour suivre l'état de la navigation SPA
export function setupNavigationTracking() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  // Limiter le taux de pushState/replaceState
  let lastHistoryOperation = 0;
  const minInterval = 100; // ms entre chaque opération d'historique
  
  // Intercepter les appels à history.pushState
  history.pushState = function() {
    const now = Date.now();
    
    // Limiter le taux d'appels
    if (now - lastHistoryOperation < minInterval) {
      console.log("Trop d'opérations d'historique, ignorée");
      return originalPushState.apply(history, arguments as any);
    }
    
    lastHistoryOperation = now;
    sessionStorage.setItem('navigation_in_progress', 'true');
    
    // Utiliser un délai pour réinitialiser l'état
    setTimeout(() => {
      sessionStorage.removeItem('navigation_in_progress');
    }, 500);
    
    return originalPushState.apply(history, arguments as any);
  };
  
  // Intercepter les appels à history.replaceState
  history.replaceState = function() {
    const now = Date.now();
    
    // Limiter le taux d'appels
    if (now - lastHistoryOperation < minInterval) {
      console.log("Trop d'opérations d'historique, ignorée");
      return originalReplaceState.apply(history, arguments as any);
    }
    
    lastHistoryOperation = now;
    sessionStorage.setItem('navigation_in_progress', 'true');
    
    // Utiliser un délai pour réinitialiser l'état
    setTimeout(() => {
      sessionStorage.removeItem('navigation_in_progress');
    }, 500);
    
    return originalReplaceState.apply(history, arguments as any);
  };
  
  // Écouter les événements de navigation
  window.addEventListener('popstate', () => {
    sessionStorage.setItem('navigation_in_progress', 'true');
    
    setTimeout(() => {
      sessionStorage.removeItem('navigation_in_progress');
    }, 500);
  });
}

// Initialiser le suivi de navigation
setupNavigationTracking();
