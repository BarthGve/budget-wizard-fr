
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SavingsProject } from "@/types/savings-project";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { SavingsMode } from "./StepThree";

interface StepFourProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
  savingsMode: SavingsMode;
}

export const StepFour = ({ data, onChange, savingsMode }: StepFourProps) => {
  // Calculer automatiquement certaines valeurs en fonction du mode choisi
  useEffect(() => {
    if (savingsMode === "par_date" && data.target_date && data.montant_total) {
      // Calculer le montant mensuel en fonction de la date cible
      const today = new Date();
      const targetDate = new Date(data.target_date);
      const monthsLeft = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                         (targetDate.getMonth() - today.getMonth());
      
      if (monthsLeft > 0) {
        const monthlyAmount = Math.ceil(data.montant_total / monthsLeft);
        onChange({ ...data, montant_mensuel: monthlyAmount, nombre_mois: monthsLeft });
      }
    } else if (savingsMode === "par_mensualite" && data.montant_mensuel && data.montant_total) {
      // Calculer la date estimée en fonction du montant mensuel
      if (data.montant_mensuel > 0) {
        const monthsNeeded = Math.ceil(data.montant_total / data.montant_mensuel);
        const estimatedDate = addMonths(new Date(), monthsNeeded);
        
        onChange({ 
          ...data, 
          nombre_mois: monthsNeeded,
          date_estimee: format(estimatedDate, 'yyyy-MM-dd') 
        });
      }
    }
  }, [savingsMode, data.target_date, data.montant_mensuel, data.montant_total]);

  if (savingsMode === "par_date") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target-date">Date cible *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.target_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.target_date ? (
                  format(new Date(data.target_date), 'P', { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.target_date ? new Date(data.target_date) : undefined}
                onSelect={(date) => date && onChange({
                  ...data,
                  target_date: format(date, 'yyyy-MM-dd')
                })}
                initialFocus
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {data.montant_mensuel && data.nombre_mois && (
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
              Plan d'épargne calculé
            </h4>
            <p className="text-sm text-purple-600/90 dark:text-purple-300/90">
              Vous devrez épargner <span className="font-semibold">{data.montant_mensuel}€</span> par mois pendant <span className="font-semibold">{data.nombre_mois} mois</span>.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthly-amount">Montant mensuel (€) *</Label>
        <Input
          id="monthly-amount"
          type="number"
          value={data.montant_mensuel || ''}
          onChange={(e) => onChange({ ...data, montant_mensuel: Number(e.target.value) })}
          placeholder="Montant à épargner chaque mois"
          min="0"
          step="10"
          required
        />
      </div>

      {data.date_estimee && data.nombre_mois && (
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
            Estimation de réalisation
          </h4>
          <p className="text-sm text-purple-600/90 dark:text-purple-300/90">
            Avec ce rythme, vous atteindrez votre objectif en <span className="font-semibold">{data.nombre_mois} mois</span>, soit en <span className="font-semibold">
              {format(new Date(data.date_estimee), 'MMMM yyyy', { locale: fr })}
            </span>.
          </p>
        </div>
      )}
    </div>
  );
};
