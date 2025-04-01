
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AmountFieldProps {
  form: UseFormReturn<any>;
}

export const AmountField = ({ form }: AmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Montant mensuel (€)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex: 1200"
              {...field}
              className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
