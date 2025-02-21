
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SavingsProject } from "@/types/savings-project";

interface StepTwoProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
}

export const StepTwo = ({ data, onChange }: StepTwoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="target-amount">Objectif financier (€)</Label>
        <Input
          id="target-amount"
          type="number"
          value={data.target_amount || ''}
          onChange={(e) => onChange({ ...data, target_amount: Number(e.target.value) })}
          placeholder="Montant total nécessaire"
          min="0"
          step="100"
        />
      </div>
    </div>
  );
};
