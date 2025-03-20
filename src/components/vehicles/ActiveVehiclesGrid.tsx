
import { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "./VehicleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CarIcon } from "lucide-react";

type ActiveVehiclesGridProps = {
  vehicles: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onVehicleClick: (id: string) => void;
  isDeleting: boolean;
};

export const ActiveVehiclesGrid = ({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
  onVehicleClick,
  isDeleting
}: ActiveVehiclesGridProps) => {
  // Filtre pour obtenir seulement les véhicules actifs ou inactifs (non vendus)
  const activeVehicles = vehicles?.filter(v => v.status !== "vendu") || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!vehicles || activeVehicles.length === 0) {
    return (
      <div className="text-center p-8">
        <CarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold">Aucun véhicule</h3>
        <p className="mt-1 text-gray-500">Commencez par ajouter votre premier véhicule.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activeVehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.id} 
          vehicle={vehicle} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onClick={onVehicleClick}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};
