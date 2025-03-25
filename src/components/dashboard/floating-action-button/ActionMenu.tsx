
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

interface ActionMenuProps {
  isProUser: boolean;
  handleAddFuelExpenseClick: () => void;
  handleAddRetailerExpense: () => void;
}

/**
 * Menu des actions principales
 */
export const ActionMenu = ({ 
  isProUser, 
  handleAddFuelExpenseClick, 
  handleAddRetailerExpense 
}: ActionMenuProps) => {
  return (
    <motion.div 
      className="flex flex-col items-end gap-2"
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Afficher le bouton de dépense carburant uniquement pour les utilisateurs pro */}
      {isProUser && (
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2"
        >
          <span className="bg-white dark:bg-gray-800 text-sm font-medium px-2 py-1 rounded-lg shadow-md">
            Dépense carburant
          </span>
          <Button 
            size="sm" 
            className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
            onClick={handleAddFuelExpenseClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22h12a2 2 0 0 0 2-2V7.5L14.5 4H4a1 1 0 0 0-1 1v15a2 2 0 0 0 2 2Z" />
              <path d="M14 4v3.5H21L14 4Z" />
              <path d="M9 14h2" />
              <path d="M14 9v6" />
              <path d="M9 19h6" />
            </svg>
          </Button>
        </motion.div>
      )}
      
      <motion.div 
        variants={itemVariants}
        className="flex items-center gap-2"
      >
        <span className="bg-white dark:bg-gray-800 text-sm font-medium px-2 py-1 rounded-lg shadow-md">
          Dépense enseigne
        </span>
        <Button 
          size="sm" 
          className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg"
          onClick={handleAddRetailerExpense}
        >
          <Store className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
