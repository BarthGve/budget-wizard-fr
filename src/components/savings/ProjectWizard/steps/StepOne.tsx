
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StepComponentProps } from "../types";

export const StepOne = ({ data, onChange }: StepComponentProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name" className="text-gray-800 dark:text-gray-200">
          Nom du projet *
        </Label>
        <Input
          id="project-name"
          value={data.nom_projet || ''}
          onChange={(e) => onChange({ ...data, nom_projet: e.target.value })}
          placeholder="Nommez votre projet d'épargne"
          required
          className="border-gray-300 focus:border-green-500 focus:ring-green-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description" className="text-gray-800 dark:text-gray-200">
          Description
        </Label>
        <Textarea
          id="project-description"
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Décrivez votre projet d'épargne"
          rows={3}
          className="border-gray-300 focus:border-green-500 focus:ring-green-200"
        />
      </div>
    </div>
  );
};
