
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AutoGenerateFieldProps {
  form: UseFormReturn<any>;
}

export function AutoGenerateField({ form }: AutoGenerateFieldProps) {
  const isMobile = useIsMobile();
  const vehicleId = form.watch("vehicle_id");
  const expenseType = form.watch("vehicle_expense_type");
  
  return (
    <FormField
      control={form.control}
      name="auto_generate_vehicle_expense"
      render={({ field }) => (
        <FormItem className={cn(
          "flex flex-row items-center justify-between",
          "rounded-lg border p-3 shadow-sm",
          isMobile && "p-2.5"
        )}>
          <div className="space-y-0.5">
            <FormLabel className={cn(isMobile && "text-sm")}>Générer automatiquement les dépenses</FormLabel>
            <FormDescription className={cn(isMobile && "text-xs")}>
              Crée automatiquement une dépense de véhicule pour chaque mensualité
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={!vehicleId || !expenseType || expenseType === "no-type"}
              className={cn(isMobile && "scale-90")}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
