
import { VehiclesHeader } from "./VehiclesHeader";
import { VehiclesList } from "./VehiclesList";

export const VehiclesContainer = () => {
  return (
    <div className="space-y-8">
      <VehiclesHeader />
      <VehiclesList />
    </div>
  );
};
