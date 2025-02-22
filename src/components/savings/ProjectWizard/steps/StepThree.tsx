
import { Label } from "@/components/ui/label";
import { SavingsMode } from "@/types/savings-project";
import { Button } from "@/components/ui/button";
import { Calendar, PiggyBank } from "lucide-react";
import { StepComponentProps } from "../types";

export const StepThree = ({ mode = "par_date", onModeChange }: StepComponentProps) => {
  // If onModeChange is not provided, we don't want the component to crash
  const handleModeChange = (newMode: SavingsMode) => {
    onModeChange?.(newMode);
  };

  return (
    <div className="space-y-4">
      <Label>Mode d'épargne</Label>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={mode === 'par_date' ? 'default' : 'outline'}
          className="h-32 space-y-2"
          onClick={() => handleModeChange('par_date')}
        >
          <Calendar className="h-8 w-8" />
          <div>Date cible</div>
        </Button>

        <Button
          variant={mode === 'par_mensualite' ? 'default' : 'outline'}
          className="h-32 space-y-2"
          onClick={() => handleModeChange('par_mensualite')}
        >
          <PiggyBank className="h-8 w-8" />
          <div>Montant mensuel</div>
        </Button>
      </div>
    </div>
  );
};
