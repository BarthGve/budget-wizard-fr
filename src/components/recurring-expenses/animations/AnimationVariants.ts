
// Définitions des variantes d'animation pour framer-motion
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
    rotateX: 10
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Animation pour les transitions d'entrée/sortie des graphiques
export const chartTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  duration: 0.4
};
