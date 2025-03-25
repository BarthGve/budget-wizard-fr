
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Définir la valeur initiale
    setMatches(mediaQuery.matches);

    // Créer un gestionnaire d'événements pour les changements
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Ajouter l'écouteur d'événements
    mediaQuery.addEventListener("change", handler);
    
    // Nettoyage lors du démontage du composant
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]); // Réexécuter uniquement si la requête change

  return matches;
}
