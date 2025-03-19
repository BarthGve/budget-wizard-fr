
import { AddVehicleDialog } from "./AddVehicleDialog";
import { VehiclesList } from "./VehiclesList";

export const VehiclesContainer = () => {
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
    </div>
  );
};
