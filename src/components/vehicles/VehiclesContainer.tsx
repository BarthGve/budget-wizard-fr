
import { AddVehicleDialog } from "./AddVehicleDialog";
import { VehiclesList } from "./VehiclesList";
import { VehicleExpenseContainer } from "./expenses/VehicleExpenseContainer";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useVehiclesContainer } from "@/hooks/useVehiclesContainer";

export const VehiclesContainer = () => {
  // Utiliser le store global pour la sélection du véhicule
  const { selectedVehicleId } = useVehiclesContainer();
  const { canAccessFeature } = usePagePermissions();
  
  // Vérifier si l'utilisateur a accès aux dépenses des véhicules
  const canAccessExpenses = canAccessFeature('/vehicles', 'vehicles_expenses');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes véhicules</h1>
          <p className="text-muted-foreground">
            Gérez vos véhicules et suivez leurs dépenses.
          </p>
        </div>
        <AddVehicleDialog />
      </div>

      <VehiclesList />

      {canAccessExpenses && selectedVehicleId && (
        <VehicleExpenseContainer vehicleId={selectedVehicleId} />
      )}
    </div>
  );
};
