
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormData, SavingsMode } from "../types";

interface StepOneProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  mode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepOne = ({ data, onChange }: StepOneProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nom" className="text-gray-700 dark:text-gray-300">
          Nom du projet
        </Label>
        <Input
          id="nom"
          placeholder="Ex: Achat voiture, Épargne retraite..."
          value={data.nom || ""}
          onChange={(e) => onChange("nom", e.target.value)}
          className={cn(
            "border-gray-300 focus:border-green-500 focus:ring-green-500", 
            "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Décrivez votre projet d'épargne..."
          value={data.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          className={cn(
            "min-h-[120px] border-gray-300 focus:border-green-500 focus:ring-green-500", 
            "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
          )}
        />
      </div>
    </div>
  );
};
