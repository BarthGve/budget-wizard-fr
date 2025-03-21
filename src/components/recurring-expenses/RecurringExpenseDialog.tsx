
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
  
  // Vérifier si nous sommes sur tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  
  // Déterminer si nous sommes en mode édition
  const isEditMode = !!expense;
  
  // Forcer le défilement pour le formulaire avec les champs véhicule
  const needsScrolling = true;

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
              "p-0 border-0 relative overflow-hidden",
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[650px] translate-x-[-50%] translate-y-[-50%] gap-0",
              "bg-white dark:bg-gray-900",
              // Ajustement pour les tablettes et mobiles
              isTablet 
                ? "sm:max-w-[85%] w-[85%]" 
                : "w-[90vw]",
              // Hauteur maximum définie pour permettre le défilement
              shouldEnableScroll ? "max-h-[95vh]" : ""
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)",
            }}
          >
            {/* Fond bleu subtil appliqué à l'intérieur du DialogContent */}
            <div className={cn(
              "absolute inset-0",
              "bg-gradient-to-b from-blue-50/70 to-white",
              "dark:from-blue-950/20 dark:to-gray-900/60",
              "pointer-events-none"
            )}>
              {/* Effet radial supplémentaire */}
              <div className={cn(
                "absolute inset-0",
                "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
                "from-blue-100/40 via-blue-50/20 to-transparent",
                "dark:from-blue-800/15 dark:via-blue-700/10 dark:to-transparent",
                "opacity-60"
              )} />
            </div>

            <div 
              ref={contentRef} 
              className={cn(
                "relative z-10 flex flex-col",
                shouldEnableScroll ? "max-h-[95vh] overflow-y-auto" : "",
                "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                "dark:scrollbar-thumb-gray-700"
              )}
            >
              {/* En-tête du dialogue - pas besoin d'être scrollable */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader isEditMode={isEditMode} />
              </motion.div>
              
              {/* Contenu du dialogue avec formulaire */}
              <ExpenseDialogContent
                expense={expense}
                isEditMode={isEditMode}
                needsScrolling={shouldEnableScroll}
                onOpenChange={onOpenChange}
                className={cn(
                  isTablet ? "overflow-y-auto" : "",
                  isTablet ? "flex-grow" : ""
                )}
              />
            </div>

            {/* Décoration graphique dans le coin inférieur droit - subtile */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.025] z-0">
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
