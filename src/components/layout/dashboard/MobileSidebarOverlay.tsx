
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSidebarOverlayProps {
  showMobileSidebar: boolean;
  onOverlayClick: (e: React.MouseEvent) => void;
}

// Composant pour l'overlay qui s'affiche derrière la sidebar sur mobile
export const MobileSidebarOverlay = ({ 
  showMobileSidebar, 
  onOverlayClick 
}: MobileSidebarOverlayProps) => {
  return (
    <AnimatePresence>
      {showMobileSidebar && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          )}
          onClick={onOverlayClick}
        />
      )}
    </AnimatePresence>
  );
};
