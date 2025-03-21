
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

interface VehicleFieldProps {
  form: UseFormReturn<any>;
}

export function VehicleField({ form }: VehicleFieldProps) {
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
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule (optionnel)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">Aucun véhicule</SelectItem>
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
