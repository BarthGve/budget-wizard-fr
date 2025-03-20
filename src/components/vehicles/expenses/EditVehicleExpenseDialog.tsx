
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleExpense } from "@/types/vehicle";
import { AddVehicleExpenseDialog } from "./AddVehicleExpenseDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface EditVehicleExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: VehicleExpense;
  vehicleId: string;
  onSuccess?: () => void;
}

export function EditVehicleExpenseDialog({ 
  open, 
  onOpenChange, 
  expense,
  vehicleId,
  onSuccess
}: EditVehicleExpenseDialogProps) {
  const queryClient = useQueryClient();
  
  // L'état initial pour le formulaire sera basé sur la dépense existante
  const initialExpenseData = {
    vehicleId,
    expenseType: expense.expense_type,
    date: expense.date,
    amount: expense.amount.toString(),
    mileage: expense.mileage?.toString() || "",
    fuelCompanyId: expense.fuel_company_id || undefined,
    fuelVolume: expense.fuel_volume?.toString() || "",
    maintenanceType: expense.maintenance_type || "",
    repairType: expense.repair_type || "",
    comment: expense.comment || ""
  };
  
  // Fonction de gestion du succès de l'édition
  const handleSuccess = () => {
    // Forcer l'invalidation du cache pour rafraîchir les données
    queryClient.invalidateQueries({ queryKey: ["vehicle-expenses", vehicleId] });
    
    if (onSuccess) {
      // Ajouter un léger délai pour permettre au changement d'état de se propager
      setTimeout(() => {
        onSuccess();
      }, 150);
    }
    
    onOpenChange(false);
  };
  
  // Nettoyage lors de la fermeture
  useEffect(() => {
    if (!open) {
      // Effet de nettoyage lorsque le dialogue se ferme
      return () => {
        // Rafraîchir les données après la fermeture
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["vehicle-expenses", vehicleId] });
        }, 150);
      };
    }
  }, [open, queryClient, vehicleId]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier la dépense</DialogTitle>
        </DialogHeader>
        {expense && (
          <AddVehicleExpenseDialog 
            isEditMode={true}
            vehicleId={vehicleId}
            expenseId={expense.id}
            initialValues={initialExpenseData}
            onSuccess={handleSuccess}
            hideDialogWrapper={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
