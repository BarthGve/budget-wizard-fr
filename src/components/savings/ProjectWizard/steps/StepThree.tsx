
import { Label } from "@/components/ui/label";
import { SavingsMode } from "@/types/savings-project";
import { Button } from "@/components/ui/button";
import { Calendar, PiggyBank } from "lucide-react";

interface StepThreeProps {
  mode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepThree = ({ mode, onModeChange }: StepThreeProps) => {
  return (
    <div className="space-y-4">
      <Label>Mode d'épargne</Label>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={mode === 'target_date' ? 'default' : 'outline'}
          className="h-32 space-y-2"
          onClick={() => onModeChange('target_date')}
        >
          <Calendar className="h-8 w-8" />
          <div>Date cible</div>
        </Button>

        <Button
          variant={mode === 'monthly_amount' ? 'default' : 'outline'}
          className="h-32 space-y-2"
          onClick={() => onModeChange('monthly_amount')}
        >
          <PiggyBank className="h-8 w-8" />
          <div>Montant mensuel</div>
        </Button>
      </div>
    </div>
  );
};
