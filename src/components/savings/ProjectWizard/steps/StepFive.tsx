
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SavingsProject } from "@/types/savings-project";

interface StepFiveProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
}

export const StepFive = ({ data, onChange }: StepFiveProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="convert-monthly"
          checked={data.convert_to_monthly}
          onCheckedChange={(checked) =>
            onChange({ ...data, convert_to_monthly: checked })
          }
        />
        <Label htmlFor="convert-monthly">
          Créer un versement mensuel automatique
        </Label>
      </div>

      {data.convert_to_monthly && (
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <p className="font-medium">Résumé du versement mensuel :</p>
          <ul className="space-y-1 text-sm">
            <li>Nom : {data.name}</li>
            <li>Montant : {data.monthly_amount} € / mois</li>
            <li>Description : {data.description}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
