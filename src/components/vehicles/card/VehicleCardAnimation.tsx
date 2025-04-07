
import { motion } from "framer-motion";
import { ReactNode } from "react";

type VehicleCardAnimationProps = {
  children: ReactNode;
  index?: number;
  isVisible?: boolean;
};

// Animation simplifiée pour les cartes de véhicules
const cardVariants = {
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 0.4
    }
  },
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.3
    }
  }
};

export const VehicleCardAnimation = ({ 
  children, 
  index = 0, 
  isVisible = true 
}: VehicleCardAnimationProps) => {
  // Limitons la profondeur des animations pour éviter les problèmes de performance
  return (
    <motion.div
      className="perspective-1000 h-full pb-4"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      // Simplification des interactions pour éviter les problèmes de performance
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};
