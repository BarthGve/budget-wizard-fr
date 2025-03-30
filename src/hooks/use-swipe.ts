
import { useState, useEffect, TouchEvent } from "react";

interface SwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe(options: SwipeOptions = {}) {
  const { threshold = 50, onSwipeLeft, onSwipeRight } = options;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Reset on component unmount
  useEffect(() => {
    return () => {
      setTouchStart(null);
      setTouchEnd(null);
    };
  }, []);

  // Calcul de la distance parcourue et déclenchement des actions de swipe
  useEffect(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;
    
    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
    
    // Réinitialiser l'état après le déclenchement
    setTouchEnd(null);
    setTouchStart(null);
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight]);
  
  // Gestionnaires d'événements
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  // Gestionnaire pour la fin du toucher (facultatif)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Retourner les gestionnaires d'événements pour les attacher aux éléments
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}
