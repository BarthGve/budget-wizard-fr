
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Mettre à jour l'état initial
    setMatches(mediaQuery.matches);
    
    // Définir un gestionnaire pour les changements futurs
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Ajouter le gestionnaire d'événements pour les changements de mediaQuery
    mediaQuery.addEventListener('change', handler);
    
    // Nettoyer
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);
  
  return matches;
}
