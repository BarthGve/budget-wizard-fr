
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "@/hooks/useVehicleForm";
import { FUEL_TYPES } from "@/types/vehicle";

interface VehicleTechnicalFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

export const VehicleTechnicalFields = ({ form }: VehicleTechnicalFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="acquisition_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date d'acquisition</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="fuel_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de carburant</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de carburant" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {FUEL_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
