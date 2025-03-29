
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "../hooks/useRecurringExpenseForm";
import { useEffect } from "react";

interface ExpenseTypeFieldProps {
  form: UseFormReturn<FormValues>;
}

export function ExpenseTypeField({ form }: ExpenseTypeFieldProps) {
  // Vérifier si un véhicule est sélectionné
  const hasVehicle = form.watch("vehicle_id");
  const vehicleId = form.watch("vehicle_id");
  const autoGenerate = form.watch("auto_generate_vehicle_expense");
  
  // Débogage pour suivre l'état du champ
  useEffect(() => {
    console.log("ExpenseTypeField - État actuel:", {
      vehicleId,
      autoGenerate,
      expenseType: form.watch("vehicle_expense_type")
    });
  }, [vehicleId, autoGenerate, form]);

  // Récupérer les types de dépenses pour véhicules
  const { data: expenseTypes, isLoading } = useQuery({
    queryKey: ["vehicle-expense-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_expense_types")
        .select("id, name, category")
        .order("name");
      
      if (error) throw error;
      console.log("Types de dépenses récupérés:", data);
      return data;
    },
    // Seulement exécuter si un véhicule est sélectionné
    enabled: !!hasVehicle
  });

  // Si pas de véhicule ou auto-génération désactivée, ne pas afficher le champ
  if (!hasVehicle) {
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
            onValueChange={(value) => {
              console.log("Type de dépense sélectionné:", value);
              // Assurer que la valeur est correctement définie (jamais une chaîne vide)
              field.onChange(value || null);
              
              // Activer automatiquement la génération si un type est sélectionné
              if (value && value !== "") {
                form.setValue("auto_generate_vehicle_expense", true);
              }
            }}
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
