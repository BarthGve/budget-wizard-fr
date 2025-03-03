
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { RetailerExpenseActions } from "@/components/expenses/RetailerExpenseActions";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface RetailerExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export function RetailerExpensesTable({
  expenses,
  isLoading,
  onEditExpense,
  onDeleteExpense
}: RetailerExpensesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Aucune dépense enregistrée pour cette année
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Commentaire</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                {new Date(expense.date).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell>
                {expense.comment || "-"}
              </TableCell>
              <TableCell className="text-right">
                <RetailerExpenseActions
                  onEdit={() => onEditExpense(expense)}
                  onDelete={() => onDeleteExpense(expense.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
