
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addMonths, format } from "date-fns";
import { fr } from "date-fns/locale";
import { StepComponentProps } from "../types";
import { SavingsMode } from "@/types/savings-project";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const StepFour = ({ data, onChange, mode = "par_date" }: StepComponentProps) => {
  const currentDate = new Date();
  const defaultDate = addMonths(currentDate, 6);
  
  // Si date_cible est définie et c'est une chaîne, la convertir en objet Date
  const targetDate = data.date_cible ? new Date(data.date_cible) : defaultDate;

  return (
    <div className="space-y-6">
      {mode === "par_date" && (
        <div className="space-y-2">
          <Label htmlFor="target-date" className="text-gray-800 dark:text-gray-200">
            Date cible
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="target-date"
                variant="outline"
                className="w-full justify-start text-left font-normal border-gray-300 hover:border-green-400 focus:border-green-500"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                {data.date_cible ? (
                  format(targetDate, "d MMMM yyyy", { locale: fr })
                ) : (
                  "Sélectionnez une date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={targetDate}
                onSelect={(date) => onChange({ ...data, date_cible: date?.toISOString() })}
                initialFocus
                fromDate={currentDate}
                className="border-green-200"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {mode === "par_mensualite" && (
        <>
          <div className="space-y-2">
            <Label className="text-gray-800 dark:text-gray-200">Fréquence d'épargne</Label>
            <RadioGroup
              value={data.frequence || "mensuel"}
              onValueChange={(value) => onChange({ ...data, frequence: value })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="mensuel" 
                  id="mensuel" 
                  className="border-green-400 text-green-600 focus:ring-green-200"
                />
                <Label htmlFor="mensuel" className={`${data.frequence === 'mensuel' ? 'text-green-700' : 'text-gray-700'} dark:text-gray-200`}>Mensuel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="trimestriel" 
                  id="trimestriel" 
                  className="border-green-400 text-green-600 focus:ring-green-200"
                />
                <Label htmlFor="trimestriel" className={`${data.frequence === 'trimestriel' ? 'text-green-700' : 'text-gray-700'} dark:text-gray-200`}>Trimestriel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="annuel" 
                  id="annuel" 
                  className="border-green-400 text-green-600 focus:ring-green-200"
                />
                <Label htmlFor="annuel" className={`${data.frequence === 'annuel' ? 'text-green-700' : 'text-gray-700'} dark:text-gray-200`}>Annuel</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodic-amount" className="text-gray-800 dark:text-gray-200">
              Montant périodique (€)
            </Label>
            <Input
              id="periodic-amount"
              type="number"
              value={data.montant_periodique || ''}
              onChange={(e) => onChange({ ...data, montant_periodique: Number(e.target.value) })}
              placeholder="Montant à épargner régulièrement"
              className="border-gray-300 focus:border-green-500 focus:ring-green-200"
              min="0"
              step="10"
            />
          </div>
        </>
      )}
    </div>
  );
};
