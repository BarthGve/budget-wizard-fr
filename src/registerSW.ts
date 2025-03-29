
// Fichier pour enregistrer le service worker

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then(registration => {
          console.log('Service Worker enregistré avec succès:', registration.scope);
          
          // Vérifier s'il y a une mise à jour disponible
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Nouvelle version du Service Worker trouvée...');
            
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
          console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
        
      // Écouter les messages des autres onglets concernant les mises à jour
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    });
  }
}

let refreshing = false;

// Fonction pour vérifier les mises à jour du service worker
export function checkForSWUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
}

// Fonction pour notifier l'utilisateur d'une mise à jour
function notifyUserOfUpdate() {
  // Créer un événement personnalisé pour notifier l'application qu'une mise à jour est disponible
  const updateEvent = new CustomEvent('serviceWorkerUpdateAvailable');
  window.dispatchEvent(updateEvent);
}

// Pour forcer un service worker à prendre le contrôle immédiatement
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        // Envoyer un message au service worker en attente pour qu'il prenne le contrôle
        registration.waiting.postMessage({ action: 'skipWaiting' });
      } else {
        console.log('Aucune mise à jour du Service Worker en attente.');
      }
    });
  }
}

// Enregistrer le gestionnaire d'événements pour le nettoyage périodique du cache
export function registerPeriodicCacheCleanup() {
  // Vérifier si la fonctionnalité periodicSync est disponible
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(async (registration) => {
      // Vérifier si l'API periodicSync existe dans le navigateur
      if ('periodicSync' in registration && 'PeriodicSyncManager' in window) {
        try {
          await (registration as any).periodicSync.register('cache-cleanup', {
            minInterval: 24 * 60 * 60 * 1000, // Une fois par jour
          });
          console.log('Nettoyage périodique du cache enregistré');
        } catch (error) {
          console.log('Le nettoyage périodique du cache n\'est pas pris en charge', error);
        }
      } else {
        console.log('L\'API Periodic Sync n\'est pas disponible dans ce navigateur');
      }
    });
  }
}
