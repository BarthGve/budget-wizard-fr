
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RecurringExpenseForm } from "../RecurringExpenseForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecurringExpense } from "../types";

interface DialogContentProps {
  expense?: RecurringExpense;
  isEditMode: boolean;
  needsScrolling: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const DialogContent = ({ 
  expense, 
  isEditMode, 
  needsScrolling,
  onOpenChange,
  className 
}: DialogContentProps) => {
  
  // Gestionnaire du succès du formulaire
  const handleSuccess = () => {
    onOpenChange?.(false);
  };

  // Gestionnaire d'annulation du formulaire
  const handleCancel = () => {
    onOpenChange?.(false);
  };

  // Contenu du formulaire avec animation
  const formContent = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <RecurringExpenseForm
        expense={expense}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        variant={isEditMode ? "edit" : "create"}
      />
    </motion.div>
  );

  // Séparateur avec dégradé
  const separator = (
    <div 
      className={cn(
        "h-px w-full flex-shrink-0",
        // Light mode - édition ou création
        isEditMode
          ? "bg-gradient-to-r from-transparent via-amber-100 to-transparent"
          : "bg-gradient-to-r from-transparent via-blue-100 to-transparent",
        // Dark mode - édition ou création
        isEditMode
          ? "dark:bg-gradient-to-r dark:from-transparent dark:via-amber-900/20 dark:to-transparent"
          : "dark:bg-gradient-to-r dark:from-transparent dark:via-blue-900/20 dark:to-transparent"
      )} 
    />
  );

  return (
    <>
      {separator}
      
      {needsScrolling ? (
        <ScrollArea 
          className={cn(
            "flex-grow overflow-x-hidden", // Ajout de overflow-x-hidden pour empêcher le défilement horizontal
            // Light mode
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
            // Dark mode
            "dark:scrollbar-thumb-gray-700",
            className
          )}
        >
          <div 
            className={cn(
              "p-6 max-w-full", // Ajout de max-w-full pour contraindre le contenu
              "bg-blue-50 dark:bg-blue-950" // Correction: suppression des ** autour de la chaîne
            )}
          >
            {formContent}
          </div>
        </ScrollArea>
      ) : (
        // Sans défilement si le contenu tient dans l'écran
        <div 
          className={cn(
            "p-6 overflow-x-hidden max-w-full", // Ajout des mêmes classes pour cohérence
            "bg-blue-50 dark:bg-blue-950" // Correction: suppression des ** autour de la chaîne
          )}
        >
          {formContent}
        </div>
      )}
    </>
  );
};
