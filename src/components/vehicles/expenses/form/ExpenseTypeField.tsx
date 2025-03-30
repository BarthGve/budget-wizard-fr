
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ExpenseFormValues } from "@/hooks/useExpenseForm";

// Types de dépenses disponibles
export const expenseTypes = [
  { value: "carburant", label: "Carburant" },
    { value: "loyer", label: "Loyer" },
  { value: "entretien", label: "Entretien" },
  { value: "reparation", label: "Réparation" },
  { value: "assurance", label: "Assurance" },
  { value: "amende", label: "Amende" },
  { value: "parking", label: "Parking" },
  { value: "peage", label: "Péage" },
  { value: "autre", label: "Autre" }
];

interface ExpenseTypeFieldProps {
  control: Control<ExpenseFormValues>;
}

export const ExpenseTypeField = ({ control }: ExpenseTypeFieldProps) => {
  return (
    <FormField
      control={control}
      name="expense_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de dépense</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de dépense" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {expenseTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
