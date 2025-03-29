
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecurringExpenseForm } from "@/components/recurring-expenses/RecurringExpenseForm";
import { useState } from "react";
import { Plus } from "lucide-react";

interface AddRecurringExpenseDialogProps {
  vehicleId: string;
}

export function AddRecurringExpenseDialog({
  vehicleId
}: AddRecurringExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
  };
  
  const handleCancel = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une charge récurrente pour ce véhicule</DialogTitle>
          <DialogDescription>
            Cette charge sera automatiquement associée au véhicule et pourra générer des dépenses automatiquement à sa date d'échéance.
          </DialogDescription>
        </DialogHeader>
        <RecurringExpenseForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
          // Nous allons plutôt passer un objet expense préconfiguré avec le vehicleId
          expense={{
            id: "",
            name: "",
            amount: 0,
            category: "",
            periodicity: "monthly",
            debit_day: 1,
            debit_month: null,
            vehicle_id: vehicleId,
            vehicle_expense_type: null,
            auto_generate_vehicle_expense: false
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
