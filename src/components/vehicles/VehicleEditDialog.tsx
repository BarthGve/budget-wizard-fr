
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
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
