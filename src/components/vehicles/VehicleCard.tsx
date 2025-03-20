
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, CalendarIcon, TagIcon, Fuel } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FUEL_TYPES } from "@/types/vehicle";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "./BrandLogoPreview";

// Fonction helper pour obtenir le label du type de carburant
export const getFuelTypeLabel = (value: string) => {
  const fuelType = FUEL_TYPES.find(type => type.value === value);
  return fuelType ? fuelType.label : value;
};

type VehicleCardProps = { 
  vehicle: Vehicle; 
  onEdit: (vehicle: Vehicle) => void; 
  onDelete: (vehicle: Vehicle) => void;
  onClick: (id: string) => void;
  isDeleting: boolean;
};

export const VehicleCard = ({ 
  vehicle, 
  onEdit, 
  onDelete,
  onClick,
  isDeleting 
}: VehicleCardProps) => {
  // On place le hook ici, à l'extérieur de la boucle map
  const { previewLogoUrl, isLogoValid } = useVehicleBrandLogo(vehicle.brand);
  
  return (
    <Card 
      className="shadow-sm cursor-pointer transition-all hover:scale-105"
      onClick={() => onClick(vehicle.id)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            {/* Logo de la marque à côté du nom du modèle */}
            <BrandLogoPreview 
              url={previewLogoUrl}
              isValid={isLogoValid}
              isChecking={false}
              brand={vehicle.brand}
            />
            <span>{vehicle.model || vehicle.brand}</span>
          </span>
          <span className="text-sm text-gray-500 font-normal">
            {vehicle.status === 'actif' && <span className="text-green-500">Actif</span>}
            {vehicle.status === 'inactif' && <span className="text-yellow-500">Inactif</span>}
            {vehicle.status === 'vendu' && <span className="text-gray-500">Vendu</span>}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {vehicle.photo_url && (
          <div className="mb-3">
            <img
              src={vehicle.photo_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex items-center text-sm">
          <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span>{vehicle.registration_number}</span>
        </div>
        <div className="flex items-center text-sm">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span>Acquisition: {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}</span>
        </div>
        <div className="flex items-center text-sm">
          <Fuel className="mr-2 h-4 w-4 text-gray-500" />
          <span>Carburant: {getFuelTypeLabel(vehicle.fuel_type)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(vehicle);
          }}
        >
          <PencilIcon className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(vehicle);
          }}
          disabled={isDeleting}
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
