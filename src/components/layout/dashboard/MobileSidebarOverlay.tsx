
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
    console.log("MobileSidebarOverlay state:", showMobileSidebar);
  }, [showMobileSidebar]);

  if (!showMobileSidebar) return null;
  
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-40",
        showMobileSidebar ? "opacity-100" : "opacity-0 pointer-events-none",
        "transition-opacity duration-300"
      )}
      onClick={onOverlayClick}
    />
  );
};
