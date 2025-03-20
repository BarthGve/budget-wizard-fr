
import { useVehicleForm, VehicleFormValues } from "@/hooks/useVehicleForm";
import { Form } from "@/components/ui/form";
import { Vehicle } from "@/types/vehicle";
import { VehicleRegistrationFields } from "./form/VehicleRegistrationFields";
import { VehicleTechnicalFields } from "./form/VehicleTechnicalFields";
import { VehiclePhotoUpload } from "./form/VehiclePhotoUpload";
import { VehicleFormActions } from "./form/VehicleFormActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useVehiclePhotoUpload } from "@/hooks/useVehiclePhotoUpload";

interface VehicleFormProps {
  onSubmit: (data: VehicleFormValues) => void;
  onCancel: () => void;
  vehicle?: Vehicle;
  isPending: boolean;
}

// Exportons VehicleFormValues depuis ce fichier également
export type { VehicleFormValues };

export const VehicleForm = ({ onSubmit, onCancel, vehicle, isPending }: VehicleFormProps) => {
  const { form } = useVehicleForm(vehicle);
  const { currentUser } = useCurrentUser();
  const { isUploading } = useVehiclePhotoUpload(currentUser?.id);
  
  const handleSubmit = (data: VehicleFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <VehicleRegistrationFields form={form} />
        <VehicleTechnicalFields form={form} />
        <VehiclePhotoUpload form={form} />
        <VehicleFormActions 
          onCancel={onCancel} 
          isPending={isPending} 
          isUploading={isUploading}
          isEditMode={!!vehicle}
        />
      </form>
    </Form>
  );
};
