
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ExpenseFormValues } from "@/hooks/useExpenseForm";

interface NumericFieldsProps {
  control: Control<ExpenseFormValues>;
}

export const NumericFields = ({ control }: NumericFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="fuel_volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume carburant (L)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="Optionnel" 
                  {...field} 
                  value={field.value === undefined ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kilométrage</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Optionnel" 
                  {...field} 
                  value={field.value === undefined ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
