
import { useState } from "react";
import { useHousing } from "@/hooks/useHousing";
import { RecurringExpense } from "@/components/recurring-expenses/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StyledLoader from "@/components/ui/StyledLoader";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";

interface SelectRecurringExpenseDialogProps {
  onSuccess?: () => void;
}

export const SelectRecurringExpenseDialog = ({ onSuccess }: SelectRecurringExpenseDialogProps) => {
  const { 
    allRecurringExpenses, 
    isLoadingAllExpenses, 
    recurringExpenses,
    addRecurringExpense 
  } = useHousing();
  
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrer les charges déjà associées au logement
  const availableExpenses = allRecurringExpenses?.filter(expense => 
    !recurringExpenses?.some(re => re.id === expense.id)
  ) || [];

  const handleSubmit = async () => {
    if (!selectedExpenseId) {
      toast.error("Veuillez sélectionner une charge récurrente");
      return;
    }

    setIsSubmitting(true);
    try {
      await addRecurringExpense.mutateAsync(selectedExpenseId);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la charge récurrente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAllExpenses) {
    return <StyledLoader />;
  }

  if (availableExpenses.length === 0) {
    return (
      <div className="py-4">
        <p className="text-center text-muted-foreground">
          Toutes vos charges récurrentes sont déjà associées à ce logement.
        </p>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onSuccess}>
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  const getPeriodicityLabel = (periodicity: string) => {
    switch (periodicity) {
      case 'monthly': return 'Mensuelle';
      case 'quarterly': return 'Trimestrielle';
      case 'yearly': return 'Annuelle';
      default: return periodicity;
    }
  };

  return (
    <div className="py-4">
      <div className="mb-6">
        <p className="text-muted-foreground mb-4">
          Sélectionnez une charge récurrente à associer à votre logement :
        </p>
        
        <RadioGroup value={selectedExpenseId} onValueChange={setSelectedExpenseId}>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {availableExpenses.map((expense: RecurringExpense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-md border border-input bg-background"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={expense.id} id={expense.id} />
                  <Label htmlFor={expense.id} className="cursor-pointer flex-1">
                    <div className="flex flex-col">
                      <span className="font-medium">{expense.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {expense.category} • {getPeriodicityLabel(expense.periodicity)}
                      </span>
                    </div>
                  </Label>
                </div>
                <div className="font-medium">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedExpenseId || isSubmitting}>
          {isSubmitting ? "Ajout en cours..." : "Ajouter"}
        </Button>
      </div>
    </div>
  );
};
