
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RecurringExpenseForm } from "../RecurringExpenseForm";
import { RecurringExpense } from "../types";
import { VehicleAssociationDialog } from "../dialogs/VehicleAssociationDialog";
import { useState } from "react";

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
  const [showVehicleAssociationDialog, setShowVehicleAssociationDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  // Gestionnaire du succès du formulaire
  const handleSuccess = (data?: any) => {
    if (!isEditMode && data) {
      // Si c'est une création, on stocke les données et on ouvre le dialogue d'association
      setFormData(data);
      setShowVehicleAssociationDialog(true);
    } else {
      // Si c'est une édition, on ferme directement
      onOpenChange?.(false);
    }
  };

  // Gestionnaire d'annulation du formulaire
  const handleCancel = () => {
    onOpenChange?.(false);
  };

  // Gestionnaire pour la finalisation après l'association véhicule
  const handleVehicleAssociationComplete = (data: any) => {
    setShowVehicleAssociationDialog(false);
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
    <>
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

      {/* Dialogue d'association de véhicule */}
      <VehicleAssociationDialog
        isOpen={showVehicleAssociationDialog}
        onClose={() => setShowVehicleAssociationDialog(false)}
        expenseData={formData}
        onComplete={handleVehicleAssociationComplete}
      />
    </>
  );
};
