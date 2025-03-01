
import { useState, useEffect } from 'react';

/**
 * Hook qui détermine si c'est la première visite de l'utilisateur sur une page spécifique
 * pendant la session en cours. Utilise localStorage pour stocker l'information.
 * @param pageKey - Clé unique pour identifier la page
 * @returns boolean - true si c'est la première visite, false sinon
 */
export const useFirstVisit = (pageKey: string): boolean => {
  // Initialise à false pour éviter un flash des animations
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  
  useEffect(() => {
    // Vérifie immédiatement si la page a déjà été visitée
    const checkIfFirstVisit = () => {
      try {
        const visitedPages = localStorage.getItem('visitedPages');
        const visitedPagesArray = visitedPages ? JSON.parse(visitedPages) : [];
        
        // Si la page n'est pas dans le tableau, c'est la première visite
        if (!visitedPagesArray.includes(pageKey)) {
          setIsFirstVisit(true);
          
          // Ajoute cette page à la liste des pages visitées
          localStorage.setItem('visitedPages', JSON.stringify([...visitedPagesArray, pageKey]));
        } else {
          // La page a déjà été visitée
          setIsFirstVisit(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du localStorage:', error);
        setIsFirstVisit(false);
      }
    };

    // Exécute la vérification immédiatement
    checkIfFirstVisit();
    
    // Pas besoin de nettoyage car nous voulons que la valeur persiste
  }, [pageKey]);
  
  return isFirstVisit;
};
