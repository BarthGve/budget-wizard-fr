import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import { motion } from "framer-motion";

export const DashboardBanners = () => {
  // Animation variants pour l'entrée des bannières
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className="space-y-3 w-full mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={itemVariants}
        className="w-full overflow-hidden"
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <CreateCategoryBanner />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="w-full overflow-hidden"
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <CreateRetailerBanner />
      </motion.div>
    </motion.div>
  );
};
