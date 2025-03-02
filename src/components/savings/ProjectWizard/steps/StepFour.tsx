
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SavingsMode, SavingsProject } from "@/types/savings-project";
import { addMonths, differenceInMonths, parseISO } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StepFourProps {
  data: Partial<SavingsProject>;
  mode: SavingsMode;
  onChange: (data: Partial<SavingsProject>) => void;
}

export const StepFour = ({ data, mode, onChange }: StepFourProps) => {
  const minDate = addMonths(new Date(), 1); // Date minimum = +1 mois
  const formattedMinDate = minDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

  const [date, setDate] = useState<string>(
    data.date_estimee ? new Date(data.date_estimee).toISOString().split("T")[0] : formattedMinDate
  );

  const { toast } = useToast();

  const handleDateChange = (newDate: string) => {
    if (newDate) {
      const dateObj = parseISO(newDate);

      // Vérifie si la date est inférieure à +1 mois
      if (dateObj < minDate) {
        toast({
          title: "Date invalide",
          description: "La date cible doit être au moins 1 mois après aujourd'hui",
          variant: "destructive"
        });
        return;
      }

      setDate(newDate);
      const months = differenceInMonths(dateObj, new Date());
      const monthlyAmount = data.montant_total ? data.montant_total / months : 0;

      onChange({
        ...data,
        date_estimee: dateObj.toISOString(),
        montant_mensuel: Math.ceil(monthlyAmount)
      });
    }
  };

  const handleMonthlyAmountChange = (amount: string) => {
    const monthlyAmount = parseFloat(amount);
    
    if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
      return;
    }

    // Calcul de la date estimée d'atteinte de l'objectif
    if (data.montant_total && monthlyAmount > 0) {
      const months = Math.ceil(data.montant_total / monthlyAmount);
      const estimatedDate = addMonths(new Date(), months);
      const formattedDate = estimatedDate.toISOString().split("T")[0];
      
      setDate(formattedDate);
      
      onChange({
        ...data,
        montant_mensuel: monthlyAmount,
        date_estimee: estimatedDate.toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      {mode === "par_date" ? (
        <div className="space-y-2">
          <Label>Date cible *</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            min={formattedMinDate} // Bloque les dates inférieures à +1 mois
            required
          />
          {data.montant_mensuel && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>Montant mensuel estimé :</p>
              <p className="text-2xl font-bold">{Math.round(data.montant_mensuel)} €</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="monthly-amount">Montant mensuel (€) *</Label>
          <Input
            id="monthly-amount"
            type="number"
            value={data.montant_mensuel || ""}
            onChange={(e) => handleMonthlyAmountChange(e.target.value)}
            min="1"
            placeholder="Montant mensuel souhaité"
            required
          />
          {date && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>Date estimée d'atteinte de l'objectif :</p>
              <p className="text-2xl font-bold">
                {new Date(date).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
