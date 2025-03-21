
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface AutoGenerateFieldProps {
  form: UseFormReturn<any>;
}

export function AutoGenerateField({ form }: AutoGenerateFieldProps) {
  const vehicleId = form.watch("vehicle_id");
  const vehicleExpenseType = form.watch("vehicle_expense_type");
  
  // Désactiver si aucun véhicule ou type d'expense n'est sélectionné
  const isDisabled = !vehicleId || !vehicleExpenseType;
  
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
              checked={field.value || false}
              onCheckedChange={(checked) => {
                // Utiliser null quand désactivé pour éviter les problèmes de types
                field.onChange(checked);
                
                // Désactiver automatiquement si les conditions ne sont pas remplies
                if (isDisabled && checked) {
                  field.onChange(false);
                }
              }}
              disabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
