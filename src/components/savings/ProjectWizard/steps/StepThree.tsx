
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SavingsProject } from "@/types/savings-project";
import { CalendarDays, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

// Type pour le mode d'épargne
export type SavingsMode = "par_date" | "par_mensualite";

interface StepThreeProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
  savingsMode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepThree = ({ data, onChange, savingsMode, onModeChange }: StepThreeProps) => {
  const handleModeChange = (value: SavingsMode) => {
    onModeChange(value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comment souhaitez-vous planifier votre épargne ?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choisissez une méthode pour atteindre votre objectif d'épargne
          </p>
        </div>

        <RadioGroup 
          value={savingsMode} 
          onValueChange={handleModeChange}
          className="grid grid-cols-1 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="par_date" 
              id="par_date" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="par_date"
              className={cn(
                "flex flex-col items-center justify-center w-full p-4 border-2 rounded-xl cursor-pointer",
                "hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
                savingsMode === "par_date" 
                  ? "border-purple-400 bg-purple-50/70 dark:border-purple-600 dark:bg-purple-900/20"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              )}
            >
              <div 
                className={cn(
                  "p-2 rounded-lg mb-2",
                  savingsMode === "par_date" 
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                )}
              >
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-800 dark:text-gray-200">Par date</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Définissez une date butoir pour atteindre votre objectif
                </div>
              </div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="par_mensualite" 
              id="par_mensualite" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="par_mensualite"
              className={cn(
                "flex flex-col items-center justify-center w-full p-4 border-2 rounded-xl cursor-pointer",
                "hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
                savingsMode === "par_mensualite" 
                  ? "border-purple-400 bg-purple-50/70 dark:border-purple-600 dark:bg-purple-900/20"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              )}
            >
              <div 
                className={cn(
                  "p-2 rounded-lg mb-2",
                  savingsMode === "par_mensualite" 
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                )}
              >
                <Calculator className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-800 dark:text-gray-200">Par mensualité</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Définissez un montant mensuel que vous souhaitez économiser
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
