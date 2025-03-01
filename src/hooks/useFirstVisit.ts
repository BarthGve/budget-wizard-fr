
import { useState, useEffect } from 'react';

/**
 * Hook qui détermine si c'est la première visite de l'utilisateur sur une page spécifique
 * pendant la session en cours. Utilise localStorage pour stocker l'information.
 * @param pageKey - Clé unique pour identifier la page
 * @returns boolean - true si c'est la première visite, false sinon
 */
export const useFirstVisit = (pageKey: string): boolean => {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  
  useEffect(() => {
    // Vérifier si cette page a déjà été visitée pendant cette session
    const visitedPages = localStorage.getItem('visitedPages');
    const visitedPagesArray = visitedPages ? JSON.parse(visitedPages) : [];
    
    if (visitedPagesArray.includes(pageKey)) {
      // La page a déjà été visitée
      setIsFirstVisit(false);
    } else {
      // Première visite de la page
      setIsFirstVisit(true);
      
      // Ajouter cette page à la liste des pages visitées
      localStorage.setItem('visitedPages', JSON.stringify([...visitedPagesArray, pageKey]));
    }
  }, [pageKey]);
  
  return isFirstVisit;
};
