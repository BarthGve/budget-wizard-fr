
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
    data.target_date ? new Date(data.target_date) : undefined
  );

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      const months = differenceInMonths(newDate, new Date());
      const monthlyAmount = data.target_amount ? data.target_amount / months : 0;
      
      onChange({
        ...data,
        target_date: newDate.toISOString(),
        monthly_amount: Math.ceil(monthlyAmount)
      });
    }
  };

  const handleMonthlyAmountChange = (amount: number) => {
    if (amount > 0 && data.target_amount) {
      const months = data.target_amount / amount;
      const targetDate = addMonths(new Date(), Math.ceil(months));
      setDate(targetDate);
      
      onChange({
        ...data,
        monthly_amount: amount,
        target_date: targetDate.toISOString()
      });
    } else {
      onChange({
        ...data,
        monthly_amount: amount
      });
    }
  };

  return (
    <div className="space-y-6">
      {mode === 'target_date' ? (
        <div className="space-y-2">
          <Label>Date cible</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
          {data.monthly_amount && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>Montant mensuel estimé :</p>
              <p className="text-2xl font-bold">{Math.round(data.monthly_amount)} €</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="monthly-amount">Montant mensuel (€)</Label>
          <Input
            id="monthly-amount"
            type="number"
            value={data.monthly_amount || ''}
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
