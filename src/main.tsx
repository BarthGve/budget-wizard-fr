
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Variable pour détecter le premier chargement
const isFirstVisit = !sessionStorage.getItem('visited');

// Rendu de l'application React en premier pour assurer une navigation rapide
createRoot(document.getElementById("root")!).render(<App />);

// IMPORTANT: Attendre que le document soit complètement chargé avant toute autre opération
window.addEventListener('load', () => {
  console.log("Document chargé, initialisation différée des fonctionnalités secondaires...");
  
  // Marquer que l'application a été visitée
  sessionStorage.setItem('visited', 'true');
  
  // Délai encore plus important pour la première visite
  const initialDelay = isFirstVisit ? 120000 : 60000; // 2 minutes pour la première visite, 1 minute sinon
  
  // Planifier l'enregistrement du service worker avec un délai très important
  setTimeout(() => {
    // Ne pas enregistrer si une navigation est en cours
    if (sessionStorage.getItem('navigation_in_progress') === 'true') {
      console.log("Navigation en cours, report de l'enregistrement du service worker");
      return;
    }
    
    console.log("Enregistrement différé du service worker...");
    registerServiceWorker();
    
    // Vérifier les mises à jour beaucoup moins fréquemment (une fois par jour)
    setInterval(() => {
      // Ne vérifier que si aucune navigation n'est en cours
      if (sessionStorage.getItem('navigation_in_progress') !== 'true') {
        checkForSWUpdates();
      }
    }, 24 * 60 * 60 * 1000);
  }, initialDelay);
});
