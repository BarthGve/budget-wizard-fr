
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { AddVehicleExpenseDialog } from "./AddVehicleExpenseDialog";
import { VehicleExpenseList } from "./VehicleExpenseList";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleExpenseContainerProps {
  vehicleId: string;
}

export const VehicleExpenseContainer = ({ vehicleId }: VehicleExpenseContainerProps) => {
  const { expenses, isLoading, deleteExpense } = useVehicleExpenses(vehicleId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  };

  const handleExpenseSuccess = () => {
    // Invalider la requête pour rafraîchir les données
    queryClient.invalidateQueries({ queryKey: ["vehicle-expenses", vehicleId] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dépenses du véhicule</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une dépense
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : expenses && expenses.length > 0 ? (
        <VehicleExpenseList 
          expenses={expenses} 
          onDeleteExpense={handleDeleteExpense}
          vehicleId={vehicleId}
          onSuccess={handleExpenseSuccess}
        />
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">Aucune dépense enregistrée pour ce véhicule.</p>
        </div>
      )}

      <AddVehicleExpenseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        vehicleId={vehicleId}
        onSuccess={handleExpenseSuccess}
      />
    </div>
  );
};
