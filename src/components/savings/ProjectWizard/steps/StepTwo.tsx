
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SavingsProject } from "@/types/savings-project";
import { StepComponentProps } from "../types";

export const StepTwo = ({ data, onChange }: StepComponentProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="target-amount" className="text-gray-800 dark:text-gray-200">Objectif financier (€) *</Label>
        <Input
          id="target-amount"
          type="number"
          value={data.montant_total || ''}
          onChange={(e) => onChange({ ...data, montant_total: Number(e.target.value) })}
          placeholder="Montant total nécessaire"
          min="0"
          step="100"
          required
          className="border-gray-300 focus:border-green-500 focus:ring-green-200"
        />
      </div>
    </div>
  );
};
