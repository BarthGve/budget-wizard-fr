
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SavingsMode, SavingsProject } from "@/types/savings-project";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { addMonths, differenceInMonths } from "date-fns";

interface StepFourProps {
  data: Partial<SavingsProject>;
  mode: SavingsMode;
  onChange: (data: Partial<SavingsProject>) => void;
}

export const StepFour = ({ data, mode, onChange }: StepFourProps) => {
  const [date, setDate] = useState<Date | undefined>(
    data.date_estimee ? new Date(data.date_estimee) : undefined
  );

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      const months = differenceInMonths(newDate, new Date());
      const monthlyAmount = data.montant_total ? data.montant_total / months : 0;
      
      onChange({
        ...data,
        date_estimee: newDate.toISOString(),
        montant_mensuel: Math.ceil(monthlyAmount)
      });
    }
  };

  const handleMonthlyAmountChange = (amount: number) => {
    if (amount > 0 && data.montant_total) {
      const months = data.montant_total / amount;
      const targetDate = addMonths(new Date(), Math.ceil(months));
      setDate(targetDate);
      
      onChange({
        ...data,
        montant_mensuel: amount,
        date_estimee: targetDate.toISOString()
      });
    } else {
      onChange({
        ...data,
        montant_mensuel: amount
      });
    }
  };

  return (
    <div className="space-y-6">
      {mode === 'par_date' ? (
        <div className="space-y-2">
          <Label>Date cible</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
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
          <Label htmlFor="monthly-amount">Montant mensuel (€)</Label>
          <Input
            id="monthly-amount"
            type="number"
            value={data.montant_mensuel || ''}
            onChange={(e) => handleMonthlyAmountChange(Number(e.target.value))}
            min="0"
            placeholder="Montant mensuel souhaité"
          />
          {date && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>Date estimée d'atteinte de l'objectif :</p>
              <p className="text-2xl font-bold">
                {date.toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
