
import { useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour détecter si c'est la première visite de l'utilisateur sur le site
 * et personnaliser le comportement en conséquence
 * 
 * @returns {boolean} true si c'est la première visite de l'utilisateur, false sinon
 */
export function useFirstVisit() {
  const isFirstVisit = useRef(sessionStorage.getItem('visited') !== 'true');
  
  useEffect(() => {
    // Marquer que l'utilisateur a visité le site
    if (isFirstVisit.current) {
      console.log("Première visite détectée");
      sessionStorage.setItem('visited', 'true');
      
      // Empêcher le rechargement complet lors de la navigation pour la première visite
      const originalPushState = history.pushState;
      history.pushState = function() {
        // Marquer explicitement comme navigation SPA
        const args = Array.from(arguments as any);
        if (typeof args[0] === 'object') {
          args[0] = {
            ...args[0],
            isSpaNavigation: true,
            timestamp: Date.now()
          };
        } else {
          args[0] = {
            isSpaNavigation: true,
            timestamp: Date.now()
          };
        }
        return originalPushState.apply(history, args);
      };
    }
  }, []);
  
  return isFirstVisit.current;
}

export default useFirstVisit;
