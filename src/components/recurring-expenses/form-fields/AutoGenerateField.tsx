
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface AutoGenerateFieldProps {
  form: UseFormReturn<any>;
}

export function AutoGenerateField({ form }: AutoGenerateFieldProps) {
  const vehicleExpenseType = form.watch("vehicle_expense_type");
  
  return (
    <FormField
      control={form.control}
      name="auto_generate_vehicle_expense"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Générer automatiquement</FormLabel>
            <div className="text-sm text-muted-foreground">
              Créer automatiquement une dépense véhicule à la date d'échéance
            </div>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={!vehicleExpenseType}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
