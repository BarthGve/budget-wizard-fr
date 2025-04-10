
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

// Fonction pour corriger l'erreur d'importation
export const register = registerServiceWorker;
