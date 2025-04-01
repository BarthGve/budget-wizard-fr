
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FormValues } from "../hooks/useCreditForm";

interface VehicleFieldProps {
  form: UseFormReturn<FormValues>;
}

export function VehicleField({ form }: VehicleFieldProps) {
  const isMobile = useIsMobile();
  
  // Récupérer la liste des véhicules actifs uniquement
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["active-vehicles"],
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
          <FormLabel className={cn(isMobile && "text-sm")}>Véhicule</FormLabel>
          <Select
            value={field.value || undefined}
            onValueChange={(value) => {
              // Si "no-vehicle" est sélectionné, définir comme null
              const newValue = value === "no-vehicle" ? null : value;
              field.onChange(newValue);
              
              // Réinitialiser les champs liés au véhicule
              if (!newValue) {
                form.setValue("vehicle_expense_type", null);
                form.setValue("auto_generate_vehicle_expense", false);
              }
            }}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger className={cn(
                "bg-white dark:bg-gray-800",
                isMobile && "h-9 text-sm"
              )}>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn(isMobile && "text-sm")}>
              {/* Utiliser une valeur spécifique au lieu d'une chaîne vide */}
              <SelectItem value="no-vehicle">Aucun véhicule</SelectItem>
              {vehicles?.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.registration_number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className={cn(isMobile && "text-xs")} />
        </FormItem>
      )}
    />
  );
}
