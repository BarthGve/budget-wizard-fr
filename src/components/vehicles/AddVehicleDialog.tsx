
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { PlusIcon } from "lucide-react";
import { type VehicleFormValues } from "@/hooks/useVehicleForm";
import { toast } from "sonner";

type AddVehicleDialogProps = {
  trigger?: React.ReactNode;
};

export const AddVehicleDialog = ({ trigger }: AddVehicleDialogProps = {}) => {
  const [open, setOpen] = useState(false);
  const { addVehicle, isAdding } = useVehicles();

  const handleSubmit = (data: VehicleFormValues) => {
    // Vérifier que tous les champs requis sont présents
    if (!data.registration_number || !data.brand || !data.acquisition_date || !data.fuel_type) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // S'assurer que toutes les propriétés requises sont présentes
    const vehicleData = {
      registration_number: data.registration_number,
      brand: data.brand,
      model: data.model || "",
      acquisition_date: data.acquisition_date,
      fuel_type: data.fuel_type,
      status: data.status || "actif",
      photo_url: data.photo_url || undefined
    };
    
    addVehicle(vehicleData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        )}
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
