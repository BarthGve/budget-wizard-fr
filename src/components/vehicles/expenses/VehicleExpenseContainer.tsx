
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { AddVehicleExpenseDialog } from "./AddVehicleExpenseDialog";
import { VehicleExpenseTable } from "./table/VehicleExpenseTable";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleExpenseContainerProps {
  vehicleId: string;
}

export const VehicleExpenseContainer = ({ vehicleId }: VehicleExpenseContainerProps) => {
  const { expenses, isLoading, deleteExpense, refetch, invalidateAndRefetch } = useVehicleExpenses(vehicleId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fonction optimisée pour supprimer une dépense
  const handleDeleteExpense = useCallback((id: string) => {
    deleteExpense(id);
  }, [deleteExpense]);

  // Fonction optimisée pour gérer le succès des opérations
  const handleExpenseSuccess = useCallback(() => {
    // Utiliser la fonction invalidateAndRefetch du hook
    invalidateAndRefetch();
  }, [invalidateAndRefetch]);

  // Gestion de l'ouverture/fermeture de la boîte de dialogue
  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsAddDialogOpen(open);
    
    // Si on ferme le dialogue, rafraîchir les données
    if (!open) {
      setTimeout(() => {
        handleExpenseSuccess();
      }, 300); // Petit délai pour laisser le temps à la requête de se terminer
    }
  }, [handleExpenseSuccess]);

  // Effet pour nettoyer l'état lors du démontage
  useEffect(() => {
    return () => {
      setIsAddDialogOpen(false);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
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
        <VehicleExpenseTable 
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
        key={`add-dialog-${isAddDialogOpen}`} // Forcer le remontage du composant
        open={isAddDialogOpen}
        onOpenChange={handleDialogOpenChange}
        vehicleId={vehicleId}
        onSuccess={handleExpenseSuccess}
      />
    </div>
  );
};
