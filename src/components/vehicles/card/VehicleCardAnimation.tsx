
import { motion, Variant } from "framer-motion";
import { ReactNode } from "react";

type VehicleCardAnimationProps = {
  children: ReactNode;
  index?: number;
  isVisible?: boolean;
};

// Animation variants pour les cartes
const cardVariants = {
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.5,
      delay: index * 0.05
    }
  }),
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.3
    }
  }
};

export const VehicleCardAnimation = ({ 
  children, 
  index = 0, 
  isVisible = true 
}: VehicleCardAnimationProps) => {
  return (
    <motion.div
      className="perspective-1000 h-full pb-4"
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};
