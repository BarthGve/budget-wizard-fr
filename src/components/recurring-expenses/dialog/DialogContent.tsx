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
      className="relative z-10"
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
        // Séparateur bleu pour maintenir la cohérence
        "bg-gradient-to-r from-transparent via-blue-100 to-transparent",
        "dark:bg-gradient-to-r dark:from-transparent dark:via-blue-900/20 dark:to-transparent"
      )} 
    />
  );

  // Conteneur du contenu
  const contentContainer = (innerContent: React.ReactNode) => (
    <div 
      className={cn(
        "p-6 max-w-full relative",
        // Fond subtil pour cohérence visuelle
        "bg-gradient-to-b from-white to-blue-50/30",
        "dark:bg-gradient-to-b dark:from-gray-800/80 dark:to-blue-950/10"
      )}
    >
      {/* Fond de texture subtil (optionnel) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] dark:opacity-[0.03] pointer-events-none" />
      
      {innerContent}
    </div>
  );

  return (
    <>
      {separator}
      
      {needsScrolling ? (
        <ScrollArea 
          className={cn(
            "flex-grow overflow-x-hidden",
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
            "dark:scrollbar-thumb-gray-700",
            className
          )}
        >
          {contentContainer(formContent)}
        </ScrollArea>
      ) : (
        contentContainer(formContent)
      )}
    </>
  );
};
