
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Rendu de l'application React en premier pour assurer une navigation rapide
createRoot(document.getElementById("root")!).render(<App />);

// Variable pour suivre si l'application a déjà été initialisée complètement
let appFullyInitialized = false;

// Enregistrement du service worker pour les fonctionnalités PWA 
// seulement après que l'application soit complètement chargée et stable
window.addEventListener('load', () => {
  // Différer significativement l'enregistrement du service worker pour donner la priorité au chargement de l'app
  console.log("Planification de l'enregistrement du service worker...");
  
  // Première initialisation après un délai court pour les fonctionnalités essentielles
  setTimeout(() => {
    // Marquer l'application comme initialisée
    appFullyInitialized = true;
    
    // Délai plus long pour l'enregistrement du service worker
    setTimeout(() => {
      registerServiceWorker();
    }, 10000); // Délai augmenté à 10 secondes pour s'assurer que l'application est stable
  }, 1000);
});

// Vérifier les mises à jour moins fréquemment pour réduire les interférences
setInterval(() => {
  // Ne vérifier que si l'application est pleinement initialisée
  if (appFullyInitialized) {
    checkForSWUpdates();
  }
}, 180 * 60 * 1000); // Toutes les 3 heures
