
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
  const [date, setDate] = useState<string>(
    data.date_estimee ? new Date(data.date_estimee).toISOString().split('T')[0] : ''
  );
  const { toast } = useToast();

  const handleDateChange = (newDate: string) => {
    if (newDate) {
      const dateObj = parseISO(newDate);
      if (dateObj < new Date()) {
        toast({
          title: "Date invalide",
          description: "La date cible doit être dans le futur",
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

  const handleMonthlyAmountChange = (amount: number) => {
    if (amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Le montant mensuel doit être supérieur à 0",
        variant: "destructive"
      });
      return;
    }

    if (amount > 0 && data.montant_total) {
      const months = data.montant_total / amount;
      const targetDate = addMonths(new Date(), Math.ceil(months));
      setDate(targetDate.toISOString().split('T')[0]);
      
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
          <Label>Date cible *</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
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
            value={data.montant_mensuel || ''}
            onChange={(e) => handleMonthlyAmountChange(Number(e.target.value))}
            min="1"
            placeholder="Montant mensuel souhaité"
            required
          />
          {date && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>Date estimée d'atteinte de l'objectif :</p>
              <p className="text-2xl font-bold">
                {new Date(date).toLocaleDateString('fr-FR', {
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
