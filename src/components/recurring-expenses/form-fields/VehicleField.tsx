
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "../hooks/useRecurringExpenseForm";
import { useEffect } from "react";

interface VehicleFieldProps {
  form: UseFormReturn<FormValues>;
}

export function VehicleField({ form }: VehicleFieldProps) {
  const vehicleId = form.watch("vehicle_id");
  
  // Log pour débogage
  useEffect(() => {
    console.log("VehicleField - Vehicle ID actuel:", vehicleId);
  }, [vehicleId]);
  
  // Récupérer la liste des véhicules
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, brand, model, registration_number")
        .eq("status", "actif") // On affiche uniquement les véhicules actifs
        .order("brand");
      
      if (error) throw error;
      console.log("Véhicules récupérés:", data);
      return data;
    }
  });

  return (
    <FormField
      control={form.control}
      name="vehicle_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Véhicule (optionnel)</FormLabel>
          <Select
            value={field.value || undefined}
            onValueChange={(value) => {
              // Si "no-vehicle" est sélectionné, définir comme null
              const newValue = value === "no-vehicle" ? null : value;
              console.log("Nouveau vehicle_id sélectionné:", newValue);
              field.onChange(newValue);
              
              // Réinitialiser les champs liés au véhicule
              if (!newValue) {
                console.log("Réinitialisation des champs liés au véhicule");
                form.setValue("vehicle_expense_type", null);
                form.setValue("auto_generate_vehicle_expense", false);
              }
            }}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule (optionnel)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* Utiliser une valeur spécifique au lieu d'une chaîne vide */}
              <SelectItem value="no-vehicle">Aucun véhicule</SelectItem>
              {vehicles?.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.registration_number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
