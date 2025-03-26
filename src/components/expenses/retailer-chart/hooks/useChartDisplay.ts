
import { useState, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Hook personnalisé pour gérer l'affichage et les états du graphique
 */
export function useChartDisplay() {
  // État pour le mode d'affichage (mensuel ou annuel)
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  // Détecter si l'écran est mobile
  const isMobileScreen = useMediaQuery("(max-width: 768px)");
  
  // Fonction pour changer le mode d'affichage
  const handleViewModeChange = useCallback((mode: 'monthly' | 'yearly') => {
    setViewMode(mode);
  }, []);

  return {
    viewMode,
    isMobileScreen,
    handleViewModeChange
  };
}
