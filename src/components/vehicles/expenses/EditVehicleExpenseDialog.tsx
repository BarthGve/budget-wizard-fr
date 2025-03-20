
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleExpense } from "@/types/vehicle";
import { AddVehicleExpenseDialog } from "./AddVehicleExpenseDialog";

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
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };
  
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
