
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleExpense } from "@/types/vehicle";
import { useState } from "react";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { AddVehicleExpenseDialog } from "./AddVehicleExpenseDialog";

interface EditVehicleExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: VehicleExpense;
  vehicleId: string;
}

export function EditVehicleExpenseDialog({ 
  open, 
  onOpenChange, 
  expense,
  vehicleId
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
  
  // On utilise le même composant d'ajout de dépense pour l'édition
  // avec les données initiales de la dépense existante
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
            onSuccess={() => onOpenChange(false)}
            hideDialogWrapper={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
