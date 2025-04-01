
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";
import { useVehicles } from "@/hooks/queries/useVehicles";

interface VehicleFieldProps {
  form: UseFormReturn<FormValues>;
}

export function VehicleField({ form }: VehicleFieldProps) {
  // Récupérer la liste des véhicules actifs
  const { data: vehicles, isLoading } = useVehicles();
  const activeVehicles = vehicles?.filter(v => v.status === "actif") || [];
  
  return (
    <FormField
      control={form.control}
      name="vehicle_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Véhicule</FormLabel>
          <Select
            value={field.value || ""}
            onValueChange={(value) => {
              field.onChange(value);
              // Réinitialiser les champs qui dépendent du véhicule
              form.setValue("vehicle_expense_type", null);
              form.setValue("auto_generate_vehicle_expense", false);
            }}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un véhicule" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {activeVehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model || ''} ({vehicle.registration_number})
                </SelectItem>
              ))}
              {activeVehicles.length === 0 && (
                <SelectItem value="no-vehicles" disabled>
                  Aucun véhicule actif disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
