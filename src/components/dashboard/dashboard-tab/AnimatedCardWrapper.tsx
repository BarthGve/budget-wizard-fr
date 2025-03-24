
import { motion } from "framer-motion";
import { ReactNode } from "react";

// Variants d'animation pour les cartes
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

interface AnimatedCardWrapperProps {
  children: ReactNode;
}

/**
 * Composant qui enveloppe chaque carte avec des animations
 */
export const AnimatedCardWrapper = ({ children }: AnimatedCardWrapperProps) => {
  return (
    <motion.div 
      variants={itemVariants} 
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
