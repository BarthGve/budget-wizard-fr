
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "../hooks/useRecurringExpenseForm";

interface ExpenseTypeFieldProps {
  form: UseFormReturn<FormValues>;
}

export function ExpenseTypeField({ form }: ExpenseTypeFieldProps) {
  // Vérifier si un véhicule est sélectionné
  const hasVehicle = form.watch("vehicle_id");
  const autoGenerate = form.watch("auto_generate_vehicle_expense");

  // Récupérer les types de dépenses pour véhicules
  const { data: expenseTypes, isLoading } = useQuery({
    queryKey: ["vehicle-expense-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_expense_types")
        .select("id, name, category")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    // Seulement exécuter si un véhicule est sélectionné
    enabled: !!hasVehicle
  });

  if (!hasVehicle || !autoGenerate) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="vehicle_expense_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de dépense véhicule</FormLabel>
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de dépense" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {expenseTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.category})
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
