
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDebitDate } from "./utils";
import { RecurringExpense, periodicityLabels } from "./types";

interface RecurringExpenseDetailsProps {
  expense: RecurringExpense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RecurringExpenseDetails = ({
  expense,
  open,
  onOpenChange,
}: RecurringExpenseDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la charge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {expense.logo_url && (
              <img
                src={expense.logo_url}
                alt={expense.name}
                className="w-12 h-12 rounded-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{expense.name}</h3>
              <p className="text-sm text-muted-foreground">{expense.category}</p>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Montant</span>
              <span className="font-medium">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(expense.amount)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Périodicité</span>
              <span className="font-medium">{periodicityLabels[expense.periodicity]}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Prélèvement</span>
              <span className="font-medium">
                {formatDebitDate(expense.debit_day, expense.debit_month, expense.periodicity)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Créée le</span>
              <span className="font-medium">
                {format(new Date(expense.created_at), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
