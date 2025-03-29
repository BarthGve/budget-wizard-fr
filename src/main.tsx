
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Rendu de l'application React en premier pour assurer une navigation rapide
createRoot(document.getElementById("root")!).render(<App />);

// Enregistrement du service worker pour les fonctionnalités PWA 
// seulement après que l'application soit complètement chargée et stable
window.addEventListener('load', () => {
  // Différer significativement l'enregistrement du service worker pour donner la priorité au chargement de l'app
  console.log("Planification de l'enregistrement du service worker...");
  registerServiceWorker();
});

// Vérifier les mises à jour moins fréquemment pour réduire les interférences
setInterval(() => {
  checkForSWUpdates();
}, 180 * 60 * 1000); // Toutes les 3 heures au lieu de chaque heure pour réduire la charge
