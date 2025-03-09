
import { useState, useRef, useEffect } from "react";

/**
 * Hook personnalisé pour gérer le filtre de périodicité des charges récurrentes
 */
export const usePeriodicityFilter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "quarterly" | "yearly" | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gestionnaire de clic en dehors des cartes pour réinitialiser le filtre
    const handleClickOutside = (event: MouseEvent) => {
      if (cardsRef.current && !cardsRef.current.contains(event.target as Node)) {
        setSelectedPeriod(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    selectedPeriod,
    setSelectedPeriod,
    cardsRef
  };
};
