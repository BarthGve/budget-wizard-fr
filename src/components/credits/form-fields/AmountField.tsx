
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";

interface AmountFieldProps {
  form: UseFormReturn<FormValues>;
}

export const AmountField = ({ form }: AmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="montant_mensualite"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Montant mensuel (€)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex: 1200"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
