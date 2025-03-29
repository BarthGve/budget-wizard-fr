
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PencilIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/types/vehicle";

type VehicleCardFooterProps = {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onClick: (id: string) => void;
  isDeleting: boolean;
};

export const VehicleCardFooter = ({ 
  vehicle, 
  onEdit, 
  onDelete, 
  onClick, 
  isDeleting 
}: VehicleCardFooterProps) => {
  return (
    <CardFooter className={cn(
      "vehicle-card-footer flex justify-between items-center px-4 py-3 mt-auto",
      "bg-gray-50/90 dark:bg-gray-800/40"
    )}>
      <Button
        variant="default"
        size="sm"
        className={cn(
          "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
          "dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700",
          "text-white shadow-sm"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick(vehicle.id);
        }}
      >
        <span className="mr-1">Détails</span>
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Button>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(vehicle);
          }}
          aria-label="Modifier le véhicule"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(vehicle);
          }}
          disabled={isDeleting}
          aria-label="Supprimer le véhicule"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  );
};
