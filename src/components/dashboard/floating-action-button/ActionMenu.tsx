
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Store, CarFront, RotateCcw } from "lucide-react";
import { type Retailer } from "./useFloatingActionButton";

// Animation variants
const menuVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8
  },
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
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8
  },
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
  handleRestoreContribution?: () => void;
}

/**
 * Menu des actions principales avec style Apple (glassmorphism)
 */
export const ActionMenu = ({
  isProUser,
  handleAddFuelExpenseClick,
  handleAddRetailerExpense,
  handleRestoreContribution
}: ActionMenuProps) => {
  return (
    <motion.div 
      className="flex flex-col items-end gap-3" 
      variants={menuVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <span className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 text-sm font-medium px-4 py-2 rounded-full shadow-md border border-white/20 dark:border-gray-700/30">
          Dépense véhicule
        </span>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400 }}>
          <Button 
            size="sm" 
            className="h-12 w-12 rounded-full backdrop-blur-md bg-quaternary-500/90 hover:bg-quaternary-500 shadow-lg border border-quaternary-400/20"
            onClick={handleAddFuelExpenseClick}
          >
            <CarFront className="h-5 w-5 text-white" />
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <span className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 text-sm font-medium px-4 py-2 rounded-full shadow-md border border-white/20 dark:border-gray-700/30">
          Dépense enseigne
        </span>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400 }}>
          <Button 
            size="sm" 
            className="h-12 w-12 rounded-full backdrop-blur-md bg-tertiary-500/90 hover:bg-tertiary-500 shadow-lg border border-tertiary-400/20"
            onClick={handleAddRetailerExpense}
          >
            <Store className="h-5 w-5 text-white" />
          </Button>
        </motion.div>
      </motion.div>

      {handleRestoreContribution && (
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <span className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 text-sm font-medium px-4 py-2 rounded-full shadow-md border border-white/20 dark:border-gray-700/30">
            Restaurer contributeur
          </span>
          <motion.div whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400 }}>
            <Button 
              size="sm" 
              className="h-12 w-12 rounded-full backdrop-blur-md bg-quinary-500/90 hover:bg-quinary-500 shadow-lg border border-quinary-400/20"
              onClick={handleRestoreContribution}
            >
              <RotateCcw className="h-5 w-5 text-white" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
