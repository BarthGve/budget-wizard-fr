
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileSidebarToggleProps {
  toggleSidebar: () => void;
  className?: string;
}

// Composant pour le bouton de basculement de la sidebar sur mobile
export const MobileSidebarToggle = ({ toggleSidebar, className }: MobileSidebarToggleProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={cn("fixed z-50", className)}
    >
      <Button
        onClick={toggleSidebar}
        className="rounded-full shadow-lg bg-background/90 backdrop-blur-sm hover:bg-accent ios-top-safe w-12 h-12 border hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-center p-0"
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
        variant="outline"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>
    </motion.div>
  );
};
