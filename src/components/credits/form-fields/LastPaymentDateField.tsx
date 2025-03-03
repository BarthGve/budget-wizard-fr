
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";

interface LastPaymentDateFieldProps {
  form: UseFormReturn<FormValues>;
}

export const LastPaymentDateField = ({ form }: LastPaymentDateFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="date_derniere_mensualite"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date de dernière mensualité</FormLabel>
          <FormControl>
            <Input
              type="date"
              {...field}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
