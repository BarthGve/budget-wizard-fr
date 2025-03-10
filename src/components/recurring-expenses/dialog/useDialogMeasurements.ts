
import { useState, useEffect, RefObject } from "react";

interface UseDialogMeasurementsProps {
  open: boolean;
  contentRef: RefObject<HTMLDivElement>;
}

export const useDialogMeasurements = ({ open, contentRef }: UseDialogMeasurementsProps) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Mesurer la hauteur de la fenêtre et du contenu pour déterminer s'il faut activer le défilement
  useEffect(() => {
    if (open) {
      const updateHeights = () => {
        setWindowHeight(window.innerHeight);
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      };

      // Mettre à jour immédiatement et après un court délai pour s'assurer que le contenu est chargé
      updateHeights();
      const timer = setTimeout(updateHeights, 100);

      window.addEventListener('resize', updateHeights);
      
      return () => {
        window.removeEventListener('resize', updateHeights);
        clearTimeout(timer);
      };
    }
  }, [open, contentRef]);

  // Déterminer si le contenu nécessite un défilement (ajouter une marge pour l'UI)
  const needsScrolling = contentHeight > 0 && contentHeight + 80 > windowHeight;

  return { needsScrolling };
};
