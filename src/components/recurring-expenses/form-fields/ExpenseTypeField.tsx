
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useRecurringExpenseForm";

interface ExpenseTypeFieldProps {
  form: UseFormReturn<FormValues>;
  expenseTypes: { id: string; name: string; }[];
}

export const ExpenseTypeField = ({ form, expenseTypes }: ExpenseTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="vehicle_expense_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de dépense véhicule</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de dépense" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {expenseTypes?.map(type => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
