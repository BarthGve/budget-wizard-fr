
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Bouton principal du FAB qui ouvre/ferme le menu
 * Style inspiré du design Apple avec effet glassmorphism
 */
export const MenuButton = ({ isOpen, onClick }: MenuButtonProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button 
        onClick={onClick}
        className={cn(
          "h-14 w-14 rounded-full backdrop-blur-md shadow-lg",
          "bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-gray-700/30",
          "hover:bg-white/90 dark:hover:bg-slate-800/90",
          "transition-all duration-300 ease-in-out",
          isOpen && "rotate-45"
        )}
        style={{ 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)"
        }}
      >
        <Plus className={cn(
          "h-6 w-6 transition-colors duration-200",
          "text-gray-800 dark:text-gray-200"
        )} />
      </Button>
    </motion.div>
  );
};
