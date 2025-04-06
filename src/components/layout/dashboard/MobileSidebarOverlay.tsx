
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface MobileSidebarOverlayProps {
  showMobileSidebar: boolean;
  onOverlayClick: (e: React.MouseEvent) => void;
}

// Composant pour l'overlay qui s'affiche derrière la sidebar sur mobile
export const MobileSidebarOverlay = ({ 
  showMobileSidebar, 
  onOverlayClick 
}: MobileSidebarOverlayProps) => {
  // Effet pour enregistrer l'état de la sidebar
  useEffect(() => {
    console.log("MobileSidebarOverlay - État actuel:", showMobileSidebar);
  }, [showMobileSidebar]);

  // Ne rien rendre si la sidebar n'est pas visible
  if (!showMobileSidebar) return null;
  
  // Fonction qui gère le clic sur l'overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    console.log("MobileSidebarOverlay - Overlay cliqué");
    onOverlayClick(e);
  };
  
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-40",
        "transition-opacity duration-300"
      )}
      onClick={handleOverlayClick}
      aria-hidden="true"
    />
  );
};
