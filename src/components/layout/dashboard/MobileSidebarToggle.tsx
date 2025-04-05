
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileSidebarToggleProps {
  toggleSidebar: () => void;
  className?: string;
}

// Composant pour le bouton de basculement de la sidebar sur mobile avec design flottant
export const MobileSidebarToggle = ({ toggleSidebar, className }: MobileSidebarToggleProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      className={cn("fixed z-50", className)}
    >
      <Button
        onClick={toggleSidebar}
        className="mobile-sidebar-toggle w-12 h-12 rounded-full bg-primary/90 text-white backdrop-blur-sm ios-top-safe p-0 flex items-center justify-center"
        variant="outline"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};
