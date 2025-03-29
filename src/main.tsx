
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Rendu de l'application React en premier pour assurer une navigation rapide
createRoot(document.getElementById("root")!).render(<App />);

// Variable pour suivre si l'application a déjà été initialisée complètement
let appFullyInitialized = false;

// DÉLAI IMPORTANT: Enregistrement du service worker seulement après que l'application soit complètement chargée
window.addEventListener('load', () => {
  // Différer significativement l'enregistrement du service worker pour donner la priorité à l'expérience SPA
  console.log("Planification de l'enregistrement du service worker...");
  
  // Première initialisation après un délai court pour les fonctionnalités essentielles
  setTimeout(() => {
    // Marquer l'application comme initialisée
    appFullyInitialized = true;
    
    // Délai encore plus long pour l'enregistrement du service worker
    // pour éviter toute interférence avec la navigation SPA initiale
    setTimeout(() => {
      // Stocker une indication que la SPA est en cours d'utilisation pour éviter les rechargements complets
      sessionStorage.setItem('spa_active', 'true');
      registerServiceWorker();
    }, 300000); // Délai augmenté à 5 minutes (300000ms) pour éviter les interférences
  }, 30000); // 30 secondes pour l'initialisation initiale
});

// Vérifier les mises à jour beaucoup moins fréquemment pour réduire les interférences
setInterval(() => {
  // Ne vérifier que si l'application est pleinement initialisée
  if (appFullyInitialized) {
    checkForSWUpdates();
  }
}, 24 * 60 * 60 * 1000); // Une fois par jour
