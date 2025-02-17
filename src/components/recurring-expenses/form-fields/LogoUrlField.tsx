
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useRecurringExpenseForm";

interface LogoUrlFieldProps {
  form: UseFormReturn<FormValues>;
}

export const LogoUrlField = ({ form }: LogoUrlFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="logo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>URL du logo (optionnel)</FormLabel>
          <FormControl>
            <Input 
              type="url" 
              placeholder="https://exemple.com/logo.png"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Si non renseigné, le logo sera automatiquement récupéré via Clearbit
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
