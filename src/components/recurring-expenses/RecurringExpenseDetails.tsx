
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecurringExpense, periodicityLabels } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface RecurringExpenseDetailsProps {
  expense: RecurringExpense;
  onClose?: () => void;
}

export const RecurringExpenseDetails = ({ expense, onClose }: RecurringExpenseDetailsProps) => {
  const formattedDate = expense.created_at 
    ? format(new Date(expense.created_at), "dd MMMM yyyy", { locale: fr })
    : "Date inconnue";

  const getDebitInfo = () => {
    switch (expense.periodicity) {
      case "monthly":
        return `Le ${expense.debit_day} de chaque mois`;
      case "quarterly":
        return `Le ${expense.debit_day} du mois ${expense.debit_month || 1} chaque trimestre`;
      case "yearly":
        return `Le ${expense.debit_day} du mois ${expense.debit_month || 1} chaque année`;
      default:
        return "Information non disponible";
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          {expense.logo_url && (
            <img
              src={expense.logo_url}
              alt={expense.name}
              className="w-8 h-8 rounded-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          )}
          {expense.name}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Catégorie</div>
          <div className="font-medium">{expense.category}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Montant</div>
          <div className="font-medium">{expense.amount.toLocaleString('fr-FR')} €</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Périodicité</div>
          <div className="font-medium">{periodicityLabels[expense.periodicity]}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Prélèvement</div>
          <div className="font-medium">{getDebitInfo()}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Date d'ajout</div>
          <div className="font-medium">{formattedDate}</div>
        </div>
      </div>
    </DialogContent>
  );
};
