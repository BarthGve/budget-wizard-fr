
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FormValues } from "../hooks/useCreditForm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

interface AutoGenerateExpenseFieldProps {
  form: UseFormReturn<FormValues>;
}

export function AutoGenerateExpenseField({ form }: AutoGenerateExpenseFieldProps) {
  const isMobile = useIsMobile();
  
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
          <div className="space-y-0.5 flex gap-2 items-start">
            <div>
              <FormLabel className={cn(isMobile && "text-sm")}>Générer les dépenses automatiquement</FormLabel>
              <FormDescription className={cn(isMobile && "text-xs")}>
                Créer automatiquement une dépense pour chaque mensualité
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
                  Lorsque cette option est activée, une dépense du montant de la mensualité
                  sera automatiquement créée chaque mois pour le véhicule associé.
                </p>
              </PopoverContent>
            </Popover>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className={cn(isMobile && "scale-90")}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
