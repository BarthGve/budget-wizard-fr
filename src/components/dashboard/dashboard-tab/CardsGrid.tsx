
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Variants d'animation pour le conteneur
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

interface CardsGridProps {
  children: ReactNode;
}

/**
 * Composant qui contient la grille des cartes
 */
export const CardsGrid = ({ children }: CardsGridProps) => {
  // Vérifier si on est sur mobile
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <motion.div 
      className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};
