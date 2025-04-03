
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FormValues } from "../hooks/useCreditForm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

interface AssociateVehicleFieldProps {
  form: UseFormReturn<FormValues>;
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
          <div className="space-y-0.5 flex gap-2 items-start">
            <div>
              <FormLabel className={cn(isMobile && "text-sm")}>Associer à un véhicule</FormLabel>
              <FormDescription className={cn(isMobile && "text-xs")}>
                Lier ce crédit à un véhicule spécifique
              </FormDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Aide</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm">
                <p>
                  En associant ce crédit à un véhicule, vous pourrez suivre les dépenses
                  liées à ce véhicule et générer automatiquement des dépenses pour chaque mensualité.
                </p>
              </PopoverContent>
            </Popover>
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
