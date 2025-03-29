
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useRecurringExpenseForm";
import { expenseTypes } from "@/components/vehicles/expenses/form/ExpenseTypeField";

interface ExpenseTypeFieldProps {
  form: UseFormReturn<FormValues>;
  expenseTypes: { id: string; name: string; }[];
}

export const ExpenseTypeField = ({ form, expenseTypes }: ExpenseTypeFieldProps) => {
  // Obtenir vehicle_id pour la validation
  const vehicleId = form.watch("vehicle_id");
  const autoGenerate = form.watch("auto_generate_vehicle_expense");
  
  // Utiliser directement les types de dépenses du fichier ExpenseTypeField.tsx
  const allVehicleExpenseTypes = expenseTypes.length > 0 
    ? expenseTypes 
    : expenseTypes.map(type => ({ id: type.id || type.name, name: type.name }));
  
  return (
    <FormField
      control={form.control}
      name="vehicle_expense_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de dépense véhicule</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value === "no-type" ? null : value);
              
              // Désactiver l'auto-génération si aucun type n'est sélectionné
              if (value === "no-type" && autoGenerate) {
                form.setValue("auto_generate_vehicle_expense", false);
              }
            }}
            value={field.value || "no-type"}
            disabled={!vehicleId}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de dépense" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem key="no-type" value="no-type">
                Aucun type de dépense
              </SelectItem>
              {vehicleId && (
                <>
                  {/* Utiliser les types de dépenses standardisés des véhicules */}
                  {expenseTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          {vehicleId && (
            <FormDescription>
              Sélectionnez un type de dépense pour activer la génération automatique
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
