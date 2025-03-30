
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { AddVehicleExpenseDialog } from "./AddVehicleExpenseDialog";
import { VehicleExpenseTable } from "./table/VehicleExpenseTable";
import { useQueryClient } from "@tanstack/react-query";
import { useVehicleDetail } from "@/hooks/useVehicleDetail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { VehicleExpenseRecentList } from "./VehicleExpenseRecentList";

interface VehicleExpenseContainerProps {
  vehicleId: string;
}

export const VehicleExpenseContainer = ({
  vehicleId
}: VehicleExpenseContainerProps) => {
  const {
    expenses,
    isLoading,
    deleteExpense,
    refetch,
    invalidateAndRefetch
  } = useVehicleExpenses(vehicleId);
  
  const { vehicle, isLoading: isVehicleLoading } = useVehicleDetail(vehicleId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // Vérifier si le véhicule est vendu
  const isVehicleSold = vehicle?.status === 'vendu';

  // Afficher des logs pour le débogage
  useEffect(() => {
    console.log("VehicleExpenseContainer - vehicleId:", vehicleId);
    console.log("VehicleExpenseContainer - expenses:", expenses?.length || 0);
    console.log("VehicleExpenseContainer - isLoading:", isLoading);
    console.log("VehicleExpenseContainer - vehicle status:", vehicle?.status);
    console.log("VehicleExpenseContainer - isMobile:", isMobile);
  }, [vehicleId, expenses, isLoading, vehicle, isMobile]);

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
  
  // Contenu à afficher en fonction de l'état et du périphérique
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!expenses || expenses.length === 0) {
      return (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">Aucune dépense enregistrée pour ce véhicule.</p>
        </div>
      );
    }
    
    // Afficher la liste simplifiée sur mobile avec tous les éléments, au lieu de limitée à 5
    return isMobile ? 
      <VehicleExpenseRecentList 
        expenses={expenses} 
        onDeleteExpense={handleDeleteExpense} 
        vehicleId={vehicleId} 
        onSuccess={handleExpenseSuccess}
        limit={expenses.length} // Afficher toutes les dépenses
      /> : 
      <VehicleExpenseTable 
        expenses={expenses} 
        onDeleteExpense={handleDeleteExpense} 
        vehicleId={vehicleId} 
        onSuccess={handleExpenseSuccess} 
      />;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Historique des dépenses
        </h2>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          disabled={isVehicleSold} 
          className={cn(isVehicleSold && "opacity-60 cursor-not-allowed")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une dépense
        </Button>
      </div>

      {isVehicleSold && (
        <Alert variant="default" className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 mb-4">
          <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <AlertTitle className="text-gray-800 dark:text-gray-200">Véhicule vendu</AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-400">
            Ce véhicule étant marqué comme vendu, il n'est plus possible d'ajouter de nouvelles dépenses.
          </AlertDescription>
        </Alert>
      )}

      {renderContent()}

      <AddVehicleExpenseDialog 
        key={`add-dialog-${isAddDialogOpen}`} // Forcer le remontage du composant
        open={isAddDialogOpen && !isVehicleSold} 
        onOpenChange={handleDialogOpenChange} 
        vehicleId={vehicleId} 
        onSuccess={handleExpenseSuccess} 
      />
    </div>
  );
};
