
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const useSidebar = () => {
  const isMobile = useIsMobile();
  
  // État initial basé sur localStorage ou mobile
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : (isMobile ? true : false);
  });

  // Référence pour les événements de clic
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Sauvegarde de l'état dans localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Ferme automatiquement la sidebar sur mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Gestion du clic sur les liens dans la sidebar
  const handleLinkClick = (onClose?: () => void) => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Attache l'événement de clic à tout le contenu de la sidebar pour mobile
  useEffect(() => {
    if (isMobile && sidebarRef.current) {
      const links = sidebarRef.current.querySelectorAll('a');
      
      links.forEach(link => {
        link.addEventListener('click', () => handleLinkClick());
      });
      
      return () => {
        links.forEach(link => {
          link.removeEventListener('click', () => handleLinkClick());
        });
      };
    }
  }, [isMobile, sidebarRef.current]);

  return {
    collapsed,
    setCollapsed,
    sidebarRef,
    isMobile,
    handleLinkClick
  };
};
