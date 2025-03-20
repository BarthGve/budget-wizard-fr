
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useVehiclePhotoUpload } from "@/hooks/useVehiclePhotoUpload";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "@/hooks/useVehicleForm";

interface VehiclePhotoUploadProps {
  form: UseFormReturn<VehicleFormValues>;
}

export const VehiclePhotoUpload = ({ form }: VehiclePhotoUploadProps) => {
  const { currentUser } = useCurrentUser();
  const { isUploading, uploadPhoto } = useVehiclePhotoUpload(currentUser?.id);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const photoUrl = await uploadPhoto(file);
    
    if (photoUrl) {
      form.setValue('photo_url', photoUrl);
    }
  };

  return (
    <FormField
      control={form.control}
      name="photo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Photo du véhicule (optionnel)</FormLabel>
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />

            {isUploading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Téléchargement en cours...</span>
              </div>
            )}

            {field.value && (
              <div className="mt-2">
                <img 
                  src={field.value} 
                  alt="Aperçu du véhicule"
                  className="max-h-48 rounded-md object-cover" 
                />
                <Input type="hidden" {...field} />
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
