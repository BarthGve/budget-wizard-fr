
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../hooks/useCreditForm";

interface MonthsCountFieldProps {
  form: UseFormReturn<FormValues>;
}

export const MonthsCountField = ({ form }: MonthsCountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="months_count"
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
                field.onChange(value ? parseInt(value, 10) : "");
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
