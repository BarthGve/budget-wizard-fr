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
          container: "bg-transparent",
          text: "text-green-500",
        };
      case 'inactif':
        return {
          container: "bg-transparent",
          text: "text-amber-500",
        };
      case 'vendu':
        return {
          container: "bg-transparent",
          text: "text-gray-400",
        };
      default:
        return {
          container: "bg-transparent",
          text: "text-gray-400",
        };
    }
  };

  const statusStyles = getStatusStyles(vehicle.status);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer",
        "bg-white dark:bg-slate-900",
        "border border-gray-200 dark:border-slate-800",
        "hover:shadow-lg dark:hover:shadow-slate-800/50"
      )}
      onClick={() => onClick(vehicle.id)}
    >
      {vehicle.photo_url && (
        <div className="relative">
          <img
            src={vehicle.photo_url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={cn(
              "px-3 py-1 text-sm font-medium rounded",
              statusStyles.container,
              statusStyles.text
            )}>
              {vehicle.status === 'actif' && "Actif"}
              {vehicle.status === 'inactif' && "Inactif"}
              {vehicle.status === 'vendu' && "Vendu"}
            </span>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-2 pt-4">
        {!vehicle.photo_url && (
          <div className="absolute top-3 right-3">
            <span className={cn(
              "px-3 py-1 text-sm font-medium rounded",
              statusStyles.container,
              statusStyles.text
            )}>
              {vehicle.status === 'actif' && "Actif"}
              {vehicle.status === 'inactif' && "Inactif"}
              {vehicle.status === 'vendu' && "Vendu"}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12">
            <BrandLogoPreview 
              url={previewLogoUrl}
              isValid={isLogoValid}
              isChecking={false}
              brand={vehicle.brand}
            />
          </div>
          <CardTitle className={cn(
            "text-xl font-bold",
            "text-gray-800 dark:text-white"
          )}>
            {vehicle.model || vehicle.brand}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-3">
        <div className={cn(
          "p-4 rounded-md",
          "bg-gray-200/80 dark:bg-slate-700/30",
          "border border-gray-300/30 dark:border-slate-700/80"
        )}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <TagIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-200">
                {vehicle.registration_number}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-200">
                {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center">
              <Fuel className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-200">
                {getFuelTypeLabel(vehicle.fuel_type)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={cn(
        "flex justify-between items-center px-4 py-3 border-t",
        "border-gray-200 dark:border-slate-800"
      )}>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "gap-1 text-gray-600 dark:text-gray-300",
            "hover:bg-gray-100 dark:hover:bg-slate-800"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClick(vehicle.id);
          }}
        >
          <span>Détails</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-black/10 dark:bg-white/5 border-slate-800/10 dark:border-white/10"
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
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(vehicle);
            }}
            disabled={isDeleting}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
