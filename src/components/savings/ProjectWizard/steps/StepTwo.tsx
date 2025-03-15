
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FormData, SavingsMode } from "../types";
import { Info } from "lucide-react";

interface StepTwoProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  mode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepTwo = ({ data, onChange, mode, onModeChange }: StepTwoProps) => {
  const [montantTotal, setMontantTotal] = useState<number | string>(data.montant_total || "");

  // Gérer le changement du montant avec validation
  const handleMontantChange = (value: string) => {
    // Permettre la saisie de valeurs valides uniquement (nombres avec ou sans décimales)
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setMontantTotal(value);
      onChange("montant_total", value === "" ? 0 : parseFloat(value));
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode d'épargne - Achat ou épargne pour quelque chose */}
      <div className="space-y-3">
        <Label className="text-gray-700 dark:text-gray-300">Type de projet</Label>
        <RadioGroup
          value={mode}
          onValueChange={(value) => onModeChange(value as SavingsMode)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="achat" 
              id="achat" 
              className="border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:text-green-400 dark:focus:ring-green-400"
            />
            <Label htmlFor="achat" className="cursor-pointer">Projet d'achat</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="epargne" 
              id="epargne" 
              className="border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:text-green-400 dark:focus:ring-green-400"
            />
            <Label htmlFor="epargne" className="cursor-pointer">Épargne continue</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Montant total cible */}
      <div className="space-y-2">
        <Label htmlFor="montant_total" className="text-gray-700 dark:text-gray-300">
          {mode === "achat" ? "Montant à atteindre" : "Objectif financier"}
        </Label>
        <div className="relative">
          <Input
            id="montant_total"
            type="text"
            placeholder="0.00"
            value={montantTotal}
            onChange={(e) => handleMontantChange(e.target.value)}
            className={cn(
              "pl-8 border-gray-300 focus:border-green-500 focus:ring-green-500", 
              "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
            )}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
        </div>
        
        {mode === "epargne" && (
          <div className="flex items-start mt-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p>Pour une épargne continue, définir un objectif vous aide à suivre votre progression, mais n'est pas obligatoire.</p>
          </div>
        )}
      </div>
    </div>
  );
};
