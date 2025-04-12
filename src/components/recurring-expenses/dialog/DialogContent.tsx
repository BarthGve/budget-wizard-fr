
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RecurringExpenseForm } from "../RecurringExpenseForm";
import { RecurringExpense } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogContentProps {
  expense?: RecurringExpense;
  isEditMode: boolean;
  needsScrolling: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  initialVehicleId?: string; // Ajout de la propriété initialVehicleId
}

export const DialogContent = ({ 
  expense, 
  isEditMode, 
  needsScrolling,
  onOpenChange,
  initialVehicleId, // Ajout du prop
  className 
}: DialogContentProps) => {
  const isMobile = useIsMobile();
  
  // Gestionnaire du succès du formulaire
  const handleSuccess = () => {
    onOpenChange?.(false);
  };

  // Gestionnaire d'annulation du formulaire
  const handleCancel = () => {
    onOpenChange?.(false);
  };

  // Adaptation pour la compatibilité avec RecurringExpenseForm
  const formattedExpense = expense ? {
    id: expense.id,
    name: expense.name || "",
    amount: expense.amount,
    category: expense.category,
    periodicity: expense.periodicity as "monthly" | "quarterly" | "yearly",
    debit_day: expense.debit_day,
    debit_month: expense.debit_month,
    logo_url: expense.logo_url,
    notes: expense.notes,
    vehicle_id: expense.vehicle_id,
    vehicle_expense_type: expense.vehicle_expense_type,
    auto_generate_vehicle_expense: expense.auto_generate_vehicle_expense
  } : undefined;

  // Contenu du formulaire avec animation
  const formContent = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <RecurringExpenseForm
        expense={formattedExpense}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        variant={isEditMode ? "edit" : "create"}
        initialVehicleId={initialVehicleId} // Passer la propriété au formulaire
      />
    </motion.div>
  );

  return (
    <div className="relative z-10 mt-2">
      <div 
        className={cn(
          isMobile ? "p-2 pb-6" : "p-6",
          "max-w-full", // Ajout de max-w-full pour contraindre le contenu
          className
        )}
      >
        {formContent}
      </div>
    </div>
  );
};
