
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SavingsProject } from "@/types/savings-project";
import { StepComponentProps } from "../types";

export const StepFive = ({ data, onChange }: StepComponentProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="convert-monthly"
          checked={data.added_to_recurring}
          onCheckedChange={(checked) =>
            onChange({ ...data, added_to_recurring: checked })
          }
          className="data-[state=checked]:bg-green-600"
        />
        <Label htmlFor="convert-monthly" className="text-gray-800 dark:text-gray-200">
          Ajouter un versement mensuel
        </Label>
      </div>

      {data.added_to_recurring && (
        <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg space-y-2">
          <p className="font-medium text-green-800 dark:text-green-300">Résumé du versement mensuel :</p>
          <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
            <li>Nom : {data.nom_projet}</li>
            <li>Montant : {data.montant_mensuel} € / mois</li>
            <li>Description : {data.description}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
