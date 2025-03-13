import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import { motion } from "framer-motion";

export const DashboardBanners = () => {
  // Animation variants pour l'effet de stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

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

  return (
    <motion.div 
      className="relative w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ height: "fit-content" }}
    >
      {/* Première bannière (en arrière) */}
      <motion.div 
        variants={itemVariants}
        className="w-full"
        whileHover={{ 
          scale: 1.03, 
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
        }}
        transition={{ duration: 0.2 }}
      >
        <CreateCategoryBanner />
      </motion.div>
      
      {/* Deuxième bannière (superposée) */}
      <motion.div 
        variants={itemVariants}
        className="absolute top-4 left-4 right-4 w-auto z-10"
        whileHover={{ 
          scale: 1.03, 
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)"
        }}
        transition={{ duration: 0.2 }}
        // Animation pour simuler une carte "empilée"  
        animate={{ 
          rotate: '-2deg',
        }}
      >
        <CreateRetailerBanner />
      </motion.div>
    </motion.div>
  );
};
