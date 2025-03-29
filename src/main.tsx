
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Enregistrement du service worker pour les fonctionnalités PWA
registerServiceWorker();

// Vérifier les mises à jour toutes les 60 minutes
setInterval(() => {
  checkForSWUpdates();
}, 60 * 60 * 1000);

createRoot(document.getElementById("root")!).render(<App />);
