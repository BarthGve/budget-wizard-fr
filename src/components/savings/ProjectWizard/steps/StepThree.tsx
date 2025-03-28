
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SavingsMode, SavingsProject } from "@/types/savings-project";
import { CalendarClock, Wallet } from "lucide-react";

export interface StepThreeProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
  mode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepThree = ({ data, onChange, mode, onModeChange }: StepThreeProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Mode de planification</Label>
        <RadioGroup 
          value={mode}
          onValueChange={(value) => onModeChange(value as SavingsMode)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="par_date" id="par_date" />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="par_date" 
                  className="text-base font-medium flex items-center gap-2"
                >
                  <CalendarClock className="h-4 w-4 text-purple-500" />
                  Par date cible
                </Label>
                <p className="text-sm text-muted-foreground">
                  Définissez une date à laquelle vous souhaitez atteindre votre objectif d'épargne.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="par_mensualite" id="par_mensualite" />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="par_mensualite" 
                  className="text-base font-medium flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4 text-purple-500" />
                  Par mensualité fixe
                </Label>
                <p className="text-sm text-muted-foreground">
                  Définissez un montant mensuel que vous êtes prêt à épargner.
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
