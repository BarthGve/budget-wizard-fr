
/**
 * Fonctions pour la gestion du Service Worker
 */

// Enregistre le Service Worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js');
      console.log('Service Worker enregistré avec succès:', registration);
      return registration;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      return null;
    }
  }
  return null;
};

// Vérifie les mises à jour du Service Worker
export const checkForSWUpdates = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Vérification des mises à jour du Service Worker effectuée');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour du Service Worker:', error);
    }
  }
};

// Applique une mise à jour du Service Worker
export const updateServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        // Envoyer un message pour que le nouveau SW prenne le contrôle
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Déclencher la mise à jour de la page
        window.location.reload();
        console.log('Service Worker mis à jour et page rechargée');
        return true;
      } else {
        console.log('Aucun Service Worker en attente trouvé');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du Service Worker:', error);
      return false;
    }
  }
  return false;
};

// Fonction pour corriger l'erreur d'importation
export const register = registerServiceWorker;
