
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { Vehicle } from "@/types/vehicle";

type VehicleEditDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVehicle: Vehicle | null;
  onUpdate: (data: VehicleFormValues) => void;
  isPending: boolean;
};

export const VehicleEditDialog = ({
  isOpen,
  onOpenChange,
  selectedVehicle,
  onUpdate,
  isPending
}: VehicleEditDialogProps) => {
  // S'assurer que le dialogue reste ouvert tant qu'isOpen est true
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Empêcher la fermeture pendant le chargement
        if (isPending && !open) {
          return;
        }
        onOpenChange(open);
      }}
    >
      <DialogContent 
        className="sm:max-w-[550px]"
        onInteractOutside={(e) => {
          // Empêcher la fermeture par clic extérieur si en chargement
          if (isPending) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Modifier le véhicule</DialogTitle>
        </DialogHeader>
        {selectedVehicle && (
          <VehicleForm
            vehicle={selectedVehicle}
            onSubmit={onUpdate}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
