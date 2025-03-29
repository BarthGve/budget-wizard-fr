
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RecurringExpenseForm } from "../RecurringExpenseForm";
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

  return (
    <div className="relative z-10 mt-2">
      <div 
        className={cn(
          "p-6 max-w-full", // Ajout de max-w-full pour contraindre le contenu
          className
        )}
      >
        {formContent}
      </div>
    </div>
  );
};
