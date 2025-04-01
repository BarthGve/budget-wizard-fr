
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";
import { expenseTypes } from "@/components/vehicles/expenses/form/ExpenseTypeField";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

interface ExpenseTypeFieldProps {
  form: UseFormReturn<FormValues>;
}

export const ExpenseTypeField = ({ form }: ExpenseTypeFieldProps) => {
  // Obtenir vehicle_id pour la validation
  const vehicleId = form.watch("vehicle_id");
  const autoGenerate = form.watch("auto_generate_vehicle_expense");
  
  return (
    <FormField
      control={form.control}
      name="vehicle_expense_type"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel>Type de dépense véhicule</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Aide</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm">
                <p>
                  Sélectionnez un type de dépense pour catégoriser les dépenses 
                  générées automatiquement pour ce crédit.
                </p>
              </PopoverContent>
            </Popover>
          </div>
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
              {/* Utiliser les types de dépenses provenant des options du véhicule */}
              {expenseTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
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
}
