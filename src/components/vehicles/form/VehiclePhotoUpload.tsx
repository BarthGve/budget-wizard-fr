
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { useVehiclePhotoUpload } from "@/hooks/useVehiclePhotoUpload";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "@/hooks/useVehicleForm";
import { Button } from "@/components/ui/button";

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

  // Fonction pour supprimer la photo actuelle
  const handleRemovePhoto = () => {
    form.setValue('photo_url', '');
    
    // Réinitialiser le champ de fichier
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Récupérer la valeur actuelle de la photo
  const currentPhotoUrl = form.watch('photo_url');

  return (
    <FormField
      control={form.control}
      name="photo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Photo du véhicule (optionnel)</FormLabel>
          
          {currentPhotoUrl ? (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={currentPhotoUrl} 
                  alt="Aperçu du véhicule"
                  className="max-h-48 rounded-md object-cover" 
                />
                <Button 
                  type="button"
                  variant="destructive" 
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Input type="hidden" {...field} />
              </div>
              
              <div className="text-sm text-gray-500">
                Pour remplacer cette photo, supprimez-la d'abord puis téléchargez-en une nouvelle.
              </div>
              
              {!currentPhotoUrl && (
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                id="photo-upload"
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
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
