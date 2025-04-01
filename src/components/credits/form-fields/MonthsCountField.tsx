
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface MonthsCountFieldProps {
  form: UseFormReturn<any>;
}

export const MonthsCountField = ({ form }: MonthsCountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="monthsCount"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Nombre de mensualités</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              placeholder="Ex: 24"
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value ? value : "");
              }}
              className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
