
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { type Retailer } from "./useFloatingActionButton";

// Animation variants
const menuVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.8,
    transition: { 
      duration: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20
    }
  }
};

interface RetailersListProps {
  retailers: Retailer[];
  isLoading: boolean;
  onRetailerSelect: (retailer: Retailer) => void;
  onBackClick: () => void;
}

/**
 * Liste des enseignes pour sélection
 */
export const RetailersList = ({ 
  retailers, 
  isLoading, 
  onRetailerSelect, 
  onBackClick 
}: RetailersListProps) => {
  return (
    <motion.div 
      className="flex flex-col items-end gap-2 min-w-52"
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between w-full">
        <Button 
          variant="secondary" 
          size="sm" 
          className="h-8 px-2 text-xs"
          onClick={onBackClick}
        >
          Retour
        </Button>
        
      </motion.div>
      
      {isLoading ? (
        <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          Chargement...
        </motion.div>
      ) : retailers.length === 0 ? (
        <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          Aucune enseigne disponible
        </motion.div>
      ) : (
        retailers.map(retailer => (
          <motion.div 
            key={retailer.id}
            variants={itemVariants}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onRetailerSelect(retailer)}
          >
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{retailer.name}</span>
            </div>
            {retailer.logo_url && (
              <img 
                src={retailer.logo_url} 
                alt={retailer.name} 
                className="h-6 w-6 object-contain"
              />
            )}
          </motion.div>
        ))
      )}
    </motion.div>
  );
};
