
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useRecurringExpenseForm";

const periodicityOptions = [
  { value: "monthly", label: "Mensuelle" },
  { value: "quarterly", label: "Trimestrielle" },
  { value: "yearly", label: "Annuelle" }
];

interface PeriodicityFieldProps {
  form: UseFormReturn<FormValues>;
}

export const PeriodicityField = ({ form }: PeriodicityFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="periodicity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Périodicité</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600">
                <SelectValue placeholder="Sélectionnez la périodicité" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {periodicityOptions.map(option => (
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
