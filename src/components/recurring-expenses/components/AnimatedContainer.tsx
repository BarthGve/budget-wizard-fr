
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { containerVariants } from "../animations/AnimationVariants";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Conteneur avec animation pour les composants de charges récurrentes
 */
export const AnimatedContainer = ({ children, className = "space-y-6 mx-auto  mt-4" }: AnimatedContainerProps) => {
  return (
    <motion.div 
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};
