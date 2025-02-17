
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useRecurringExpenseForm";

interface DebitDayFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DebitDayField = ({ form }: DebitDayFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="debit_day"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Jour du prélèvement</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              max="31"
              placeholder="Ex: 15"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
