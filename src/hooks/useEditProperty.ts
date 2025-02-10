
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { geocodeAddress } from "@/services/geocoding";
import { NewProperty, Property } from "@/types/property";
import { v4 as uuidv4 } from "uuid";

export const useEditProperty = (property: Property, onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [editedProperty, setEditedProperty] = useState<NewProperty>({
    name: property.name,
    address: property.address,
    area: property.area.toString(),
    purchase_value: property.purchase_value.toString(),
    monthly_rent: property.monthly_rent?.toString() || "",
    loan_payment: property.loan_payment?.toString() || "",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('properties')
        .update({ photo_url: publicUrl })
        .eq('id', property.id);

      if (updateError) throw updateError;

      toast.success("Photo mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour modifier un bien");
        return;
      }

      if (!editedProperty.name || !editedProperty.address || !editedProperty.area || !editedProperty.purchase_value) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      let coordinates;
      try {
        coordinates = await geocodeAddress(editedProperty.address);
      } catch (error) {
        toast.error("Impossible de géolocaliser cette adresse");
        return;
      }

      const { error } = await supabase
        .from("properties")
        .update({
          name: editedProperty.name,
          address: editedProperty.address,
          area: Number(editedProperty.area),
          purchase_value: Number(editedProperty.purchase_value),
          monthly_rent: editedProperty.monthly_rent ? Number(editedProperty.monthly_rent) : null,
          loan_payment: editedProperty.loan_payment ? Number(editedProperty.loan_payment) : null,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        })
        .eq('id', property.id);

      if (error) throw error;

      toast.success("Bien modifié avec succès");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onSuccess();
    } catch (error) {
      console.error("Error editing property:", error);
      toast.error("Erreur lors de la modification du bien");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editedProperty,
    setEditedProperty,
    handleSubmit,
    handlePhotoUpload,
    isLoading
  };
};
