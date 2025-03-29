
import { useRef } from "react";
import { Dialog, DialogContent as UIDialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { DialogHeader } from "./DialogHeader";
import { DialogContent } from "./DialogContent";
import { RecurringExpense } from "../types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DesktopDialogProps {
  expense?: RecurringExpense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  needsScrolling: boolean;
  trigger?: React.ReactNode;
  initialVehicleId?: string;
}

/**
 * Composant Dialog pour l'affichage desktop des charges récurrentes
 */
export const DesktopDialog = ({
  expense,
  open,
  onOpenChange,
  isEditMode,
  needsScrolling,
  trigger,
  initialVehicleId
}: DesktopDialogProps) => {
  // Thème et référence pour mesurer la hauteur du contenu
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Vérifier si nous sommes sur tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  
  // Fonction pour gérer la fermeture du dialogue
  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <AnimatePresence>
        {open && (
          <UIDialogContent 
            forceMount
            className={cn(
              "p-0 border-0 relative overflow-hidden",
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[650px] translate-x-[-50%] translate-y-[-50%] gap-0",
              "bg-white dark:bg-gray-900",
              // Ajustement pour les tablettes
              isTablet ? "sm:max-w-[85%] w-[85%]" : "w-[90vw]",
              // Hauteur maximum définie pour permettre le défilement
              needsScrolling ? "max-h-[90vh]" : ""
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)",
            }}
          >
            {/* Fond avec dégradés */}
            <DialogBackground isDarkMode={isDarkMode} />

            {/* Bouton de fermeture personnalisé */}
            <button 
              onClick={handleClose}
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
                "transition-opacity hover:opacity-100 focus:outline-none focus:ring-2",
                "focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
                "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                "z-20" // Assurer que le bouton est au-dessus des autres éléments
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </button>

            <div 
              ref={contentRef} 
              className={cn(
                "relative z-10 flex flex-col",
                needsScrolling ? "max-h-[90vh] overflow-y-auto" : "",
                "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                "dark:scrollbar-thumb-gray-700"
              )}
            >
              {/* En-tête du dialogue */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader isEditMode={isEditMode} />
              </motion.div>
              
              {/* Contenu du dialogue avec formulaire */}
              <DialogContent
                expense={expense}
                isEditMode={isEditMode}
                needsScrolling={needsScrolling}
                onOpenChange={onOpenChange}
                initialVehicleId={initialVehicleId}
                className={cn(
                  isTablet ? "overflow-y-auto" : "",
                  isTablet ? "flex-grow" : ""
                )}
              />
            </div>

            {/* Décoration graphique dans le coin inférieur droit */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.025] z-0">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full fill-blue-400 dark:fill-blue-600"
                style={{ mixBlendMode: isDarkMode ? "soft-light" : "overlay" }}
              >
                <circle cx={50} cy={50} r={50} />
              </svg>
            </div>
          </UIDialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
