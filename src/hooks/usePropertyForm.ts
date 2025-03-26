
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
    investment_type: "",
    heating_type: "", // Ajout du champ manquant
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un bien");
        return;
      }

      // Vérification des champs obligatoires
      if (!newProperty.name.trim()) {
        toast.error("Le nom du bien est obligatoire");
        return;
      }
      if (!newProperty.address.trim()) {
        toast.error("L'adresse est obligatoire");
        return;
      }
      if (!newProperty.area || Number(newProperty.area) <= 0) {
        toast.error("La surface doit être supérieure à 0");
        return;
      }
      if (!newProperty.purchase_value || Number(newProperty.purchase_value) <= 0) {
        toast.error("La valeur d'achat doit être supérieure à 0");
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
        name: newProperty.name.trim(),
        address: newProperty.address.trim(),
        area: Number(newProperty.area),
        purchase_value: Number(newProperty.purchase_value),
        monthly_rent: newProperty.monthly_rent ? Number(newProperty.monthly_rent) : null,
        loan_payment: newProperty.loan_payment ? Number(newProperty.loan_payment) : null,
        investment_type: newProperty.investment_type ? newProperty.investment_type.trim() : null,
        heating_type: newProperty.heating_type ? newProperty.heating_type.trim() : null, // Ajout du heating_type
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
        investment_type: "",
        heating_type: "", // Réinitialisation du champ
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
