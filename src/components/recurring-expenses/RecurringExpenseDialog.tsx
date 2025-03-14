import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { RecurringExpense } from "./types";
import { DialogHeader } from "./dialog/DialogHeader";
import { DialogContent as ExpenseDialogContent } from "./dialog/DialogContent";
import { useDialogMeasurements } from "./dialog/useDialogMeasurements";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface RecurringExpenseDialogProps {
  expense?: RecurringExpense;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RecurringExpenseDialog({ 
  expense, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: RecurringExpenseDialogProps) {
  // État contrôlé ou non contrôlé
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  // Thème et référence pour mesurer la hauteur du contenu
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Vérifier si nous sommes sur tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  
  // Déterminer si nous sommes en mode édition
  const isEditMode = !!expense;
  
  // Hook pour mesurer et déterminer si le défilement est nécessaire
  const { needsScrolling } = useDialogMeasurements({ 
    open, 
    contentRef 
  });

  // Forcer le défilement sur tablette
  const shouldEnableScroll = needsScrolling || isTablet;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className={cn(
              "relative p-0 border-0 shadow-2xl", // Note "relative" est ajouté pour gérer le fond
              // Toujours activer overflow-auto sur tablette
              isTablet ? "overflow-auto" : "overflow-hidden",
              // Ajustement pour les tablettes et mobiles
              isTablet 
                ? "sm:max-w-[85%] w-[85%]" 
                : "sm:max-w-[600px]",
              // Hauteur maximum définie pour permettre le défilement
              shouldEnableScroll ? "max-h-[calc(100vh-40px)]" : "",
              // Light mode
              "bg-white",
              // Dark mode
              "dark:bg-gray-800/95"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)",
            }}
          >
            {/* Ajout d'un fond bleu subtil */}
            <div className={cn(
              "absolute inset-0", // Fond étendu au conteneur du dialogue complet
              "bg-gradient-to-b from-blue-50/70 via-white to-white", // Fond radial ou dégradé léger
              "dark:from-blue-950/20 dark:via-gray-900/70 dark:to-gray-900",
              "pointer-events-none z-0"
            )} />
            
            <div 
              ref={contentRef} 
              className={cn(
                "relative z-10 flex flex-col", // Contenant positionné devant le fond
                // S'assurer que le conteneur interne prend la hauteur disponible mais
                // ne dépasse pas la hauteur maximale autorisée
                shouldEnableScroll ? "h-full" : ""
              )}
            >
              {/* En-tête du dialogue */}
              <DialogHeader isEditMode={isEditMode} />
              
              {/* Contenu du dialogue avec formulaire */}
              <ExpenseDialogContent
                expense={expense}
                isEditMode={isEditMode}
                needsScrolling={shouldEnableScroll}
                onOpenChange={onOpenChange}
                className={cn(
                  // Ajouter le défilement au niveau du contenu également
                  isTablet ? "overflow-y-auto" : "",
                  // Assurer que le contenu prend le maximum de l'espace disponible
                  isTablet ? "flex-grow" : ""
                )}
              />
            </div>

            {/* Décoration subtile */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.05] z-0">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full fill-blue-400 dark:fill-blue-600"
                style={{ mixBlendMode: isDarkMode ? "soft-light" : "overlay" }}
              >
                <circle cx={50} cy={50} r={50} />
              </svg>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
