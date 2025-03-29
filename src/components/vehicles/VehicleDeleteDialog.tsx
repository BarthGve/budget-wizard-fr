
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface VehicleDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  vehicleBrand?: string;
  vehicleModel?: string;
}

export const VehicleDeleteDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
  vehicleBrand = "",
  vehicleModel = ""
}: VehicleDeleteDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const vehicleInfo = vehicleBrand || vehicleModel 
    ? `${vehicleBrand} ${vehicleModel}`.trim()
    : "ce véhicule";

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-lg">
              <X className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl">
              Supprimer le véhicule
            </AlertDialogTitle>
          </div>
          
          <AlertDialogDescription className="text-base pt-2">
            Êtes-vous sûr de vouloir supprimer {vehicleInfo} ? Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(
              "border-gray-200 text-gray-700 hover:text-gray-800 hover:bg-gray-50",
              "dark:border-gray-700 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
            )}
            disabled={isPending}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Suppression en cours..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
