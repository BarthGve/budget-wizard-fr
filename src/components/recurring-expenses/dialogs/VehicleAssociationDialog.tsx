
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Car, XCircle } from "lucide-react";
import { useState } from "react";
import { VehicleSelectionDialog } from "./VehicleSelectionDialog";
import { cn } from "@/lib/utils";

interface VehicleAssociationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expenseData: any;
  onComplete: (data: any) => void;
}

export function VehicleAssociationDialog({
  isOpen,
  onClose,
  expenseData,
  onComplete,
}: VehicleAssociationDialogProps) {
  const [showVehicleSelection, setShowVehicleSelection] = useState(false);

  const handleYes = () => {
    // Montrer la boîte de dialogue de sélection de véhicule
    setShowVehicleSelection(true);
  };

  const handleNo = () => {
    // Compléter le processus sans association de véhicule
    onComplete(expenseData);
    onClose();
  };

  const handleVehicleSelected = (vehicleData: any) => {
    // Fusionner les données de l'expense avec les données du véhicule
    const completeData = {
      ...expenseData,
      ...vehicleData,
      auto_generate_vehicle_expense: true, // Activer automatiquement la génération
    };
    
    onComplete(completeData);
    setShowVehicleSelection(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showVehicleSelection} onOpenChange={onClose}>
        <DialogContent className={cn(
          "max-w-md p-0 gap-0 border-0 rounded-lg overflow-hidden",
          "shadow-xl"
        )}>
          <DialogHeader className="p-6 pb-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                "bg-blue-100 text-blue-600", 
                "dark:bg-blue-900/30 dark:text-blue-300"
              )}>
                <Car className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl">Association à un véhicule</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              Souhaitez-vous associer cette charge récurrente à un véhicule de votre flotte ?
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-2 space-y-4">
            <div className={cn(
              "p-4 rounded-lg",
              "bg-blue-50 border border-blue-100",
              "dark:bg-blue-900/20 dark:border-blue-800/40"
            )}>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                En associant cette charge à un véhicule, vous pourrez générer automatiquement 
                des dépenses pour ce véhicule à chaque échéance de la charge.
              </p>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2">
            <div className="flex w-full justify-between sm:justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleNo}
                className="flex-1 sm:flex-initial"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Non, pas maintenant
              </Button>
              <Button
                onClick={handleYes}
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500"
              >
                <Car className="mr-2 h-4 w-4" />
                Oui, associer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VehicleSelectionDialog
        isOpen={showVehicleSelection}
        onClose={() => setShowVehicleSelection(false)}
        onSelected={handleVehicleSelected}
      />
    </>
  );
}
