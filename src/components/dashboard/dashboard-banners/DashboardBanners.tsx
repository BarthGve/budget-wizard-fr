
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
        staggerChildren: 0.1,
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
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={itemVariants}
        whileHover={{ 
          scale: 1.03, 
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
        }}
        transition={{ duration: 0.2 }}
      >
        <CreateCategoryBanner />
      </motion.div>
      <motion.div 
        variants={itemVariants}
        whileHover={{ 
          scale: 1.03, 
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
        }}
        transition={{ duration: 0.2 }}
      >
        <CreateRetailerBanner />
      </motion.div>
    </motion.div>
  );
};
