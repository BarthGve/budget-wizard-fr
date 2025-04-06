
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MobileSidebarToggleProps {
  toggleSidebar: () => void;
}

// Composant pour le bouton de basculement de la sidebar sur mobile
export const MobileSidebarToggle = ({ toggleSidebar }: MobileSidebarToggleProps) => {
  return (
    <Button
      variant="outline"
      onClick={toggleSidebar}
      className="fixed left-5 top-4 z-50 rounded-full shadow-lg bg-background hover:bg-accent ios-top-safe w-11 h-11 border hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-center p-0"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <motion.div 
        className="flex items-center justify-center w-full h-full"
        whileTap={{ scale: 0.9 }}
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </motion.div>
    </Button>
  );
};
