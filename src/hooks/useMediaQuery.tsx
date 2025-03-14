
import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour détecter si une requête média correspond à l'état actuel de la fenêtre
 * @param query La requête média à vérifier (ex: "(min-width: 768px)")
 * @returns Boolean indiquant si la requête média correspond
 */
export function useMediaQuery(query: string): boolean {
  // État initial undefined pour éviter un rendu inconsistant entre serveur et client
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si window est disponible (côté client uniquement)
    if (typeof window !== "undefined") {
      // Créer l'objet MediaQueryList
      const mediaQuery = window.matchMedia(query);
      
      // Fonction pour mettre à jour l'état en fonction de la correspondance
      const updateMatches = () => {
        setMatches(mediaQuery.matches);
      };
      
      // Vérifier immédiatement lors de l'initialisation
      updateMatches();
      
      // Ajouter un écouteur d'événements pour les changements
      mediaQuery.addEventListener("change", updateMatches);
      
      // Nettoyer l'écouteur lors du démontage du composant
      return () => {
        mediaQuery.removeEventListener("change", updateMatches);
      };
    }
    
    // Par défaut, retourner false si exécuté côté serveur
    return () => {};
  }, [query]);

  return matches;
}
