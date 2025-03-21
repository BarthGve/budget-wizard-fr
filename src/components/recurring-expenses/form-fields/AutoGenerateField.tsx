
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { InfoCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AutoGenerateFieldProps {
  form: UseFormReturn<any>;
}

export function AutoGenerateField({ form }: AutoGenerateFieldProps) {
  const vehicleId = form.watch("vehicle_id");
  const vehicleExpenseType = form.watch("vehicle_expense_type");
  
  // Désactiver si aucun véhicule ou type d'expense n'est sélectionné
  // ou si le type est "no-type"
  const isDisabled = !vehicleId || !vehicleExpenseType || vehicleExpenseType === "no-type";
  
  return (
    <FormField
      control={form.control}
      name="auto_generate_vehicle_expense"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <FormLabel>Générer automatiquement</FormLabel>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Cette option permettra la génération automatique d'une dépense véhicule au jour d'échéance chaque mois/trimestre/année.</p>
                    <p className="mt-2 text-xs">La génération est effectuée automatiquement par le système.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-sm text-muted-foreground">
              Créer automatiquement une dépense véhicule à la date d'échéance
            </div>
          </div>
          <FormControl>
            <Switch
              checked={field.value || false}
              onCheckedChange={(checked) => {
                // Utiliser null quand désactivé pour éviter les problèmes de types
                field.onChange(checked);
                
                // Désactiver automatiquement si les conditions ne sont pas remplies
                if (isDisabled && checked) {
                  field.onChange(false);
                }
              }}
              disabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
