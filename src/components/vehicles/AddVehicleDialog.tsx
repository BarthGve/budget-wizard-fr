
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { PlusIcon } from "lucide-react";

export const AddVehicleDialog = () => {
  const [open, setOpen] = useState(false);
  const { addVehicle, isAdding } = useVehicles();

  const handleSubmit = (data: VehicleFormValues) => {
    addVehicle(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
        </DialogHeader>
        <VehicleForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isPending={isAdding}
        />
      </DialogContent>
    </Dialog>
  );
};
