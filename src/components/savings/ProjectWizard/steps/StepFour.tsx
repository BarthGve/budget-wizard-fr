
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { FormData, SavingsMode } from "../types";

interface StepFourProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  mode: SavingsMode;
  onModeChange: (mode: SavingsMode) => void;
}

export const StepFour = ({ data, onChange, mode }: StepFourProps) => {
  // Formater la date pour le calendrier
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.date_cible ? new Date(data.date_cible) : undefined
  );

  // Gérer le changement de date
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onChange("date_cible", date ? date.toISOString() : null);
  };

  return (
    <div className="space-y-6">
      {/* Date cible pour les projets d'achat */}
      {mode === "achat" && (
        <div className="space-y-2">
          <Label htmlFor="date_cible" className="text-gray-700 dark:text-gray-300">
            Date d'achat prévue
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date_cible"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-300",
                  "focus:border-green-500 focus:ring-green-500",
                  "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400",
                  !selectedDate && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "d MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                locale={fr}
                className="border-green-300 shadow-sm rounded"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Fréquence de versement */}
      <div className="space-y-2">
        <Label htmlFor="frequence" className="text-gray-700 dark:text-gray-300">
          Fréquence d'épargne
        </Label>
        <select
          id="frequence"
          value={data.frequence || "monthly"}
          onChange={(e) => onChange("frequence", e.target.value)}
          className={cn(
            "w-full rounded-md border-gray-300 shadow-sm", 
            "focus:border-green-500 focus:ring-green-500",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
            "dark:focus:border-green-400 dark:focus:ring-green-400"
          )}
        >
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuelle</option>
          <option value="quarterly">Trimestrielle</option>
          <option value="yearly">Annuelle</option>
        </select>
      </div>

      {/* Montant de versement périodique */}
      <div className="space-y-2">
        <Label htmlFor="montant_periodique" className="text-gray-700 dark:text-gray-300">
          Montant {data.frequence === "weekly" ? "hebdomadaire" : 
                   data.frequence === "monthly" ? "mensuel" : 
                   data.frequence === "quarterly" ? "trimestriel" : "annuel"}
        </Label>
        <div className="relative">
          <Input
            id="montant_periodique"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={data.montant_periodique || ""}
            onChange={(e) => onChange("montant_periodique", parseFloat(e.target.value) || 0)}
            className={cn(
              "pl-8 border-gray-300 focus:border-green-500 focus:ring-green-500", 
              "dark:border-gray-600 dark:focus:border-green-400 dark:focus:ring-green-400"
            )}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
        </div>
      </div>
    </div>
  );
};
