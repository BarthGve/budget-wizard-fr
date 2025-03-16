
// RecurringExpenseDialog.tsx
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
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
  
  // Vérifier si nous sommes sur tablette ou mobile
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useMediaQuery("(max-width: 639px)");
  
  // Déterminer si nous sommes en mode édition
  const isEditMode = !!expense;
  
  // Hook pour mesurer et déterminer si le défilement est nécessaire
  const { needsScrolling } = useDialogMeasurements({ 
    open, 
    contentRef 
  });

  // Forcer le défilement sur tablette
  const shouldEnableScroll = needsScrolling || isTablet;

  // Animation pour le contenu du dialog
  const dialogAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        duration: 0.4,
        bounce: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent 
        className={cn(
          "relative p-0 border-0 overflow-hidden",
          // Assurer la position centrée
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          // Ajustement pour les différentes tailles d'écran
          isMobile ? "max-w-[calc(100vw-32px)] w-full" :
          isTablet ? "max-w-[85%] w-[85%]" : 
          "max-w-[560px] w-full",
          // Hauteur maximum définie pour permettre le défilement
          shouldEnableScroll ? "max-h-[calc(100vh-40px)]" : "",
          // Arrondissement cohérent
          "rounded-lg",
          // Background
          "bg-white dark:bg-gray-900",
          // Ombre portée
          "shadow-[0_0_30px_6px_rgba(37,99,235,0.12)]",
          "dark:shadow-[0_0_30px_6px_rgba(2,6,23,0.25)]"
        )}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)"
        }}
      >
        <motion.div
          variants={dialogAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Effet de bordure subtil */}
          <div 
            className={cn(
              "absolute inset-0 pointer-events-none",
              "rounded-lg",
              "border border-blue-100/80 dark:border-blue-800/30"
            )} 
          />

          {/* Ajout d'un fond bleu subtil */}
          <div className={cn(
            "absolute inset-0",
            "bg-gradient-to-b from-blue-50/80 via-white to-white",
            "dark:from-blue-950/30 dark:via-gray-900/95 dark:to-gray-900",
            "pointer-events-none z-0",
            "rounded-lg"
          )} />
          
          <div 
            ref={contentRef} 
            className={cn(
              "relative z-10 flex flex-col",
              shouldEnableScroll ? "overflow-auto" : "",
              "rounded-lg"
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

          {/* Décoration subtile - coins supérieur gauche */}
          <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none opacity-[0.07] z-0">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full fill-blue-500 dark:fill-blue-400"
              style={{ mixBlendMode: isDarkMode ? "soft-light" : "overlay" }}
            >
              <circle cx={20} cy={20} r={50} />
            </svg>
          </div>
          
          {/* Décoration subtile - coin inférieur droit */}
          <div className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none opacity-[0.04] z-0 overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full fill-blue-500 dark:fill-blue-400 transform translate-x-1/4 translate-y-1/4"
              style={{ mixBlendMode: isDarkMode ? "soft-light" : "overlay" }}
            >
              <circle cx={50} cy={50} r={50} />
            </svg>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
