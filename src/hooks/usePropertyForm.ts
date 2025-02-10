
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { geocodeAddress } from "@/services/geocoding";
import { NewProperty } from "@/types/property";

export const usePropertyForm = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [newProperty, setNewProperty] = useState<NewProperty>({
    name: "",
    address: "",
    area: "",
    purchase_value: "",
    monthly_rent: "",
    loan_payment: "",
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un bien");
        return;
      }

      if (!newProperty.name || !newProperty.address || !newProperty.area || !newProperty.purchase_value) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      let coordinates;
      try {
        coordinates = await geocodeAddress(newProperty.address);
      } catch (error) {
        toast.error("Impossible de géolocaliser cette adresse");
        return;
      }

      const { error } = await supabase.from("properties").insert({
        name: newProperty.name,
        address: newProperty.address,
        area: Number(newProperty.area),
        purchase_value: Number(newProperty.purchase_value),
        monthly_rent: newProperty.monthly_rent ? Number(newProperty.monthly_rent) : null,
        loan_payment: newProperty.loan_payment ? Number(newProperty.loan_payment) : null,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        profile_id: user.id,
      });

      if (error) throw error;

      toast.success("Bien ajouté avec succès");
      setNewProperty({
        name: "",
        address: "",
        area: "",
        purchase_value: "",
        monthly_rent: "",
        loan_payment: "",
      });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onSuccess();
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Erreur lors de l'ajout du bien");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newProperty,
    setNewProperty,
    handleSubmit,
    isLoading
  };
};
