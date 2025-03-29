
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Enregistrement du service worker pour les fonctionnalités PWA 
// seulement après que l'application soit complètement chargée
window.addEventListener('load', () => {
  // Différer l'enregistrement du service worker pour donner la priorité au chargement de l'app
  setTimeout(() => {
    registerServiceWorker();
  }, 1000);
});

// Vérifier les mises à jour toutes les 60 minutes
setInterval(() => {
  checkForSWUpdates();
}, 60 * 60 * 1000);

// Rendu de l'application React
createRoot(document.getElementById("root")!).render(<App />);
