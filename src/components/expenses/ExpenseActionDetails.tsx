
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface ExpenseActionDetailsProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseActionDetails({ expense, open, onOpenChange }: ExpenseActionDetailsProps) {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la dépense</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Date:</span>
            <span>{new Date(expense.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Montant:</span>
            <span>{formatCurrency(expense.amount)}</span>
          </div>
          {expense.comment && (
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Commentaire:</span>
              <span>{expense.comment}</span>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">ID:</span>
            <span className="text-xs text-muted-foreground truncate">{expense.id}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
