
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AssociateVehicleFieldProps {
  form: UseFormReturn<any>;
}

export function AssociateVehicleField({ form }: AssociateVehicleFieldProps) {
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={form.control}
      name="associate_with_vehicle"
      render={({ field }) => (
        <FormItem className={cn(
          "flex flex-row items-center justify-between",
          "rounded-lg border p-3 shadow-sm",
          isMobile && "p-2.5"
        )}>
          <div className="space-y-0.5">
            <FormLabel className={cn(isMobile && "text-sm")}>Associer à un véhicule</FormLabel>
            <FormDescription className={cn(isMobile && "text-xs")}>
              Lier ce crédit à un véhicule spécifique
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                
                // Réinitialiser les champs liés au véhicule si le toggle est désactivé
                if (!checked) {
                  form.setValue("vehicle_id", null);
                  form.setValue("vehicle_expense_type", null);
                  form.setValue("auto_generate_vehicle_expense", false);
                }
              }}
              className={cn(isMobile && "scale-90")}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
