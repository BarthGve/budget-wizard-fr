import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, CalendarIcon, TagIcon, Fuel, ArrowRightIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FUEL_TYPES } from "@/types/vehicle";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "./BrandLogoPreview";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  
  // Détermine les classes CSS pour le statut du véhicule
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'actif':
        return {
          container: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400",
        };
      case 'inactif':
        return {
          container: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-600 dark:text-amber-400",
        };
      case 'vendu':
        return {
          container: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
        };
      default:
        return {
          container: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const statusStyles = getStatusStyles(vehicle.status);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer border-0 shadow-md",
        "bg-white dark:bg-gray-850",
        "hover:shadow-lg dark:shadow-gray-900/40"
      )}
      onClick={() => onClick(vehicle.id)}
      style={{ 
        // Utilisons le style pour ajouter des ombres avancées
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)"
      }}
    >
      {vehicle.photo_url && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={vehicle.photo_url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 p-2">
            <Badge 
              variant="outline" 
              className={cn(
                "px-2.5 py-0.5 text-xs font-medium capitalize", 
                statusStyles.container,
                statusStyles.text
              )}
            >
              {vehicle.status}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className={cn(
        "pb-1 pt-4",
        !vehicle.photo_url && "relative"
      )}>
        {!vehicle.photo_url && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant="outline" 
              className={cn(
                "px-2.5 py-0.5 text-xs font-medium capitalize", 
                statusStyles.container,
                statusStyles.text
              )}
            >
              {vehicle.status}
            </Badge>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Logo de la marque à côté du nom du modèle */}
          <BrandLogoPreview 
            url={previewLogoUrl}
            isValid={isLogoValid}
            isChecking={false}
            brand={vehicle.brand}
          />
          <CardTitle className={cn(
            "text-lg font-medium leading-none",
            "text-gray-800 dark:text-gray-100"
          )}>
            {vehicle.model || vehicle.brand}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-3 space-y-2.5">
        <div className={cn(
          "p-3 rounded-lg",
          "bg-gray-50 dark:bg-gray-800/60",
          "border border-gray-100 dark:border-gray-700/50"
        )}>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center text-sm">
              <TagIcon className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {vehicle.registration_number}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <CalendarIcon className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Fuel className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {getFuelTypeLabel(vehicle.fuel_type)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={cn(
        "flex justify-between items-center px-4 py-3 border-t",
        "border-gray-100 dark:border-gray-700/50"
      )}>
        <div>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "px-2.5 h-8 text-xs",
              "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
              "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClick(vehicle.id);
            }}
          >
            <span>Détails</span>
            <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "px-2.5 h-8 text-xs",
              "border-gray-200 hover:bg-gray-100 text-gray-700",
              "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(vehicle);
            }}
          >
            <PencilIcon className="h-3.5 w-3.5 mr-1" />
            Modifier
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className={cn(
              "px-2.5 h-8 text-xs",
              "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700", 
              "dark:bg-red-900/20 dark:border-red-700/50 dark:text-red-300 dark:hover:bg-red-800/40"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(vehicle);
            }}
            disabled={isDeleting}
          >
            <TrashIcon className="h-3.5 w-3.5 mr-1" />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
