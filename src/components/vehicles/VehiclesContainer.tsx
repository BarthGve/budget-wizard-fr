
import { AddVehicleDialog } from "./AddVehicleDialog";
import { VehiclesList } from "./VehiclesList";
import { useState } from "react";
import { VehicleExpenseContainer } from "./expenses/VehicleExpenseContainer";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const VehiclesContainer = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const { hasFeaturePermission } = usePagePermissions();
  
  // Vérifier si l'utilisateur a accès aux dépenses des véhicules
  const canAccessExpenses = hasFeaturePermission('/vehicles', 'vehicles_expenses');

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

      <VehiclesList 
        onVehicleSelect={setSelectedVehicleId}
        selectedVehicleId={selectedVehicleId}
      />

      {canAccessExpenses && selectedVehicleId && (
        <VehicleExpenseContainer vehicleId={selectedVehicleId} />
      )}
    </div>
  );
};
