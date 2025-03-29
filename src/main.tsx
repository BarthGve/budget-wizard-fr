
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Créer l'élément root pour l'application React
const root = createRoot(document.getElementById("root")!);

// Rendre l'application
root.render(<App />);

// Enregistrer le service worker après le chargement complet de l'application
// pour éviter d'interférer avec le chargement initial
window.addEventListener('load', () => {
  // Légère temporisation pour s'assurer que l'app est bien chargée
  setTimeout(() => {
    // Enregistrement du service worker pour les fonctionnalités PWA
    registerServiceWorker();
    
    // Vérifier les mises à jour toutes les 60 minutes
    setInterval(() => {
      checkForSWUpdates();
    }, 60 * 60 * 1000);
  }, 1000);
});
