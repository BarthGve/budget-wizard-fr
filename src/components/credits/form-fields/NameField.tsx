
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";

interface NameFieldProps {
  form: UseFormReturn<FormValues>;
}

export const NameField = ({ form }: NameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="nom_credit"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom du crédit</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Prêt immobilier" {...field} className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
