
import { Vehicle } from "@/types/vehicle";
import { CardContent } from "@/components/ui/card";
import { CalendarIcon, TagIcon, Fuel } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getFuelTypeLabel } from "../utils/vehicleUtils";

type VehicleCardInfoProps = {
  vehicle: Vehicle;
  hasPhoto: boolean;
};

export const VehicleCardInfo = ({ vehicle, hasPhoto }: VehicleCardInfoProps) => {
  return (
    <CardContent className={cn(
      "vehicle-card-body px-4 pb-3 space-y-4",
      hasPhoto ? "pt-1" : "pt-0"
    )}>
      <div className="vehicle-card-info-grid">
        <div className="vehicle-card-info-item bg-gray-50/80 dark:bg-gray-800/50">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Immatriculation</span>
          <div className="flex items-center gap-1.5">
            <TagIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {vehicle.registration_number}
            </span>
          </div>
        </div>
        
        <div className="vehicle-card-info-item bg-gray-50/80 dark:bg-gray-800/50">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date d'acquisition</span>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {format(new Date(vehicle.acquisition_date), 'dd MMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
        
        <div className="vehicle-card-info-item bg-gray-50/80 dark:bg-gray-800/50">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Carburant</span>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {getFuelTypeLabel(vehicle.fuel_type)}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
