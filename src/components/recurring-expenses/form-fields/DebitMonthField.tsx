
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useRecurringExpenseForm";

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: new Date(0, i).toLocaleString('fr-FR', { month: 'long' })
}));

interface DebitMonthFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DebitMonthField = ({ form }: DebitMonthFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="debit_month"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mois du prélèvement</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le mois" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
