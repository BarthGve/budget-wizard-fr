
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useRecurringExpenseForm";

interface DomainFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DomainField = ({ form }: DomainFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="domain"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Domaine de l'organisme (optionnel)</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Ex: boursorama.com, fortuneo.fr..."
            />
          </FormControl>
          <FormDescription>
            Le logo sera automatiquement récupéré à partir du domaine
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
