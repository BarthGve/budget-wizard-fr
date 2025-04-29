
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, checkForSWUpdates } from './registerSW'

// Vérifier si c'est la première visite de la session
const isFirstVisit = !sessionStorage.getItem('app_visited');
if (isFirstVisit) {
  sessionStorage.setItem('app_visited', 'true');
}

// Créer l'élément root pour l'application React
const root = createRoot(document.getElementById("root")!);

// Rendre l'application
root.render(<App />);

// Enregistrer le service worker après le chargement complet de l'application
// pour éviter d'interférer avec le chargement initial et la navigation SPA
window.addEventListener('load', () => {
  // Attendre plus longtemps lors de la première visite pour éviter les conflits
  const delay = isFirstVisit ? 2000 : 1000;
  
  setTimeout(() => {
    // Enregistrement du service worker pour les fonctionnalités PWA
    registerServiceWorker();
    
    // Vérifier les mises à jour toutes les 15 minutes
    setInterval(() => {
      checkForSWUpdates();
    }, 15 * 60 * 1000);
  }, delay);
});

// Intercepter les clics sur les liens pour assurer un comportement SPA
document.addEventListener('click', (e) => {
  // S'assurer que c'est un lien qui a été cliqué
  const target = e.target as HTMLElement;
  const anchor = target.closest('a');
  
  if (anchor && 
      anchor.getAttribute('href') && 
      !anchor.getAttribute('href').startsWith('http') &&
      !anchor.getAttribute('target') &&
      !anchor.hasAttribute('download') &&
      !e.ctrlKey && 
      !e.metaKey) {
    
    // Stocker l'information de navigation pour détecter les rechargements complets
    sessionStorage.setItem('last_click_time', Date.now().toString());
  }
});
