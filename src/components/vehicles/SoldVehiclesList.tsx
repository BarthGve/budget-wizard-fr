
import { Vehicle } from "@/types/vehicle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "./BrandLogoPreview";

type SoldVehiclesListProps = {
  vehicles: Vehicle[];
};

// Composant pour afficher une ligne de véhicule vendu
const SoldVehicleRow = ({ vehicle }: { vehicle: Vehicle }) => {
  const { previewLogoUrl, isLogoValid } = useVehicleBrandLogo(vehicle.brand || "");
  
  return (
    <div className="flex items-center justify-between py-2 px-4 border-b last:border-0 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <BrandLogoPreview 
          url={previewLogoUrl}
          isValid={isLogoValid}
          isChecking={false}
          brand={vehicle.brand}
          size="sm"
        />
        <div>
          <div className="font-medium">{vehicle.model || vehicle.brand}</div>
          <div className="flex items-center text-sm text-gray-500">
            <Tag className="mr-1 h-3 w-3" />
            {vehicle.registration_number}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SoldVehiclesList = ({ vehicles }: SoldVehiclesListProps) => {
  // Filtrer pour n'afficher que les véhicules vendus
  const soldVehicles = vehicles.filter(v => v.status === "vendu");
  
  if (soldVehicles.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Véhicules vendus</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y">
          {soldVehicles.map(vehicle => (
            <SoldVehicleRow key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
