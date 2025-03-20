import { useVehicleForm, VehicleFormValues } from "@/hooks/useVehicleForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Vehicle, FUEL_TYPES } from "@/types/vehicle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "./BrandLogoPreview";

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
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser } = useCurrentUser();
  
  // Observer la valeur du champ brand pour la prévisualisation du logo
  const brand = form.watch("brand") || "";
  const { previewLogoUrl, isLogoValid, isCheckingLogo } = useVehicleBrandLogo(brand);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!currentUser) {
      toast.error("Vous devez être connecté pour télécharger une photo");
      return;
    }

    const file = files[0];
    setIsUploading(true);

    try {
      // Création d'un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`; // Ajout de l'ID de l'utilisateur dans le chemin

      // Vérification du type de fichier (uniquement images)
      if (!file.type.startsWith('image/')) {
        throw new Error('Seules les images sont autorisées');
      }

      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 5MB');
      }

      console.log("Téléchargement de l'image...", filePath);

      // Upload de l'image
      const { error: uploadError, data } = await supabase.storage
        .from('vehicle_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Erreur d'upload:", uploadError);
        throw uploadError;
      }

      console.log("Image téléchargée avec succès:", data);

      // Récupération de l'URL publique de l'image
      const { data: urlData } = supabase.storage
        .from('vehicle_photos')
        .getPublicUrl(filePath);

      console.log("URL publique générée:", urlData.publicUrl);

      // Mise à jour du formulaire
      form.setValue('photo_url', urlData.publicUrl);
      toast.success("Photo téléchargée avec succès");
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast.error(`Erreur lors du téléchargement de la photo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (data: VehicleFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="registration_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro d'immatriculation</FormLabel>
              <FormControl>
                <Input 
                  placeholder="AB-123-CD" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marque (nom de domaine)</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Input 
                      placeholder="Ex: mercedes.com, peugeot.fr ..." 
                      {...field} 
                    />
                  </FormControl>
                  <BrandLogoPreview
                    url={previewLogoUrl}
                    isValid={isLogoValid}
                    isChecking={isCheckingLogo}
                    brand={brand}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle (optionnel)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Clio, 308..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="acquisition_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'acquisition</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de carburant</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de carburant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FUEL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isPending || isUploading}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {vehicle ? 'Mettre à jour' : 'Ajouter'} le véhicule
          </Button>
        </div>
      </form>
    </Form>
  );
};
