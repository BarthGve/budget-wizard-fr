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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <AnimatePresence>
        {open && (
          <DialogContent 
            forceMount
            className={cn(
              "p-0 border-0 shadow-2xl overflow-hidden",
              // Ajustement pour les tablettes et mobiles
              isTablet 
                ? "sm:max-w-[85%] w-[85%]" 
                : "sm:max-w-[600px]",
              needsScrolling ? "max-h-[calc(100vh-40px)]" : "",
              // Assurer un affichage adéquat sur tablette en mode portrait
              isTablet ? "max-h-[80vh]" : "",
              // Light mode
              "bg-white",
              // Dark mode
              "dark:bg-gray-800/95"
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(37, 99, 235, 0.1)",
              // Ajuster la position en mode tablette pour centrer correctement
              ...(isTablet && {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              })
            }}
          >
            <div 
              ref={contentRef} 
              className={cn(
                "flex flex-col",
                needsScrolling || isTablet ? "max-h-full" : ""
              )}
            >
              {/* En-tête du dialogue */}
              <DialogHeader isEditMode={isEditMode} />
              
              {/* Contenu du dialogue avec formulaire */}
              <ExpenseDialogContent
                expense={expense}
                isEditMode={isEditMode}
                needsScrolling={needsScrolling || isTablet}
                onOpenChange={onOpenChange}
              />
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
