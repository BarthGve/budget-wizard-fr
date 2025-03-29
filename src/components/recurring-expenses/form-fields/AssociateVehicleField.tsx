
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface AssociateVehicleFieldProps {
  form: UseFormReturn<any>;
}

export function AssociateVehicleField({ form }: AssociateVehicleFieldProps) {
  return (
    <FormField
      control={form.control}
      name="associate_with_vehicle"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Associer à un véhicule</FormLabel>
            <FormDescription>
              Lier cette charge récurrente à un véhicule spécifique
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                
                // Réinitialiser les champs liés au véhicule si le toggle est désactivé
                if (!checked) {
                  form.setValue("vehicle_id", null);
                  form.setValue("vehicle_expense_type", null);
                  form.setValue("auto_generate_vehicle_expense", false);
                }
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
