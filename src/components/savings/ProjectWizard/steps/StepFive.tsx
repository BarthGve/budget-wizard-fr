
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormData, SavingsMode } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface StepFiveProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  mode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepFive = ({ data, onChange }: StepFiveProps) => {
  // Gérer le changement pour ajouter aux versements récurrents
  const handleRecurringToggle = (checked: boolean) => {
    onChange("added_to_recurring", checked);
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Label 
            htmlFor="added_to_recurring" 
            className="text-md font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Ajouter aux versements mensuels
          </Label>
          <Switch
            id="added_to_recurring"
            checked={data.added_to_recurring}
            onCheckedChange={handleRecurringToggle}
            className="bg-gray-200 data-[state=checked]:bg-green-500 dark:bg-gray-700 dark:data-[state=checked]:bg-green-600"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ce versement apparaîtra dans votre liste d'épargnes mensuelles
        </p>
      </div>

      {data.added_to_recurring && (
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="saving_name" className="text-gray-700 dark:text-gray-300">
              Nom du versement
            </Label>
            <Input
              id="saving_name"
              placeholder="Ex: Épargne pour voiture"
              value={data.saving_name || data.nom || ""}
              onChange={(e) => onChange("saving_name", e.target.value)}
              className={cn(
                "border-gray-300 focus:border-green-500 focus:ring-green-500", 
                "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saving_description" className="text-gray-700 dark:text-gray-300">
              Description (optionnel)
            </Label>
            <Textarea
              id="saving_description"
              placeholder="Description du versement mensuel..."
              value={data.saving_description || ""}
              onChange={(e) => onChange("saving_description", e.target.value)}
              className={cn(
                "min-h-[80px] border-gray-300 focus:border-green-500 focus:ring-green-500", 
                "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saving_amount" className="text-gray-700 dark:text-gray-300">
              Montant mensuel
            </Label>
            <div className="relative">
              <Input
                id="saving_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={data.saving_amount || data.montant_periodique || ""}
                onChange={(e) => onChange("saving_amount", parseFloat(e.target.value) || 0)}
                className={cn(
                  "pl-8 border-gray-300 focus:border-green-500 focus:ring-green-500", 
                  "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
                )}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
            </div>
          </div>

          <div className="flex items-start mt-4 text-xs text-gray-500 dark:text-gray-400">
            <Info className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p>
              Ce versement mensuel sera automatiquement associé à ce projet et
              contribuera à votre objectif d'épargne global.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
