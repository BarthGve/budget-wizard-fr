
import { TableCell, TableRow } from "@/components/ui/table";
import { RecurringExpense, periodicityLabels } from "../types";
import { TableRowActions } from "../TableRowActions";

interface TableRowsProps {
  expenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

export const TableRows = ({ expenses, onDeleteExpense }: TableRowsProps) => {
  return (
    <>
      {expenses.map((expense) => (
        <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors">
          <TableCell className="py-2">
            <div className="flex items-center gap-3">
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
              <span className="font-semibold">{expense.name}</span>
            </div>
          </TableCell>
          <TableCell className="py-2">{expense.category}</TableCell>
          <TableCell className="py-2">{periodicityLabels[expense.periodicity]}</TableCell>
          <TableCell className="text-center py-2 font-medium">{expense.amount.toLocaleString('fr-FR')} €</TableCell>
          <TableCell className="text-right py-2">
            <TableRowActions expense={expense} onDeleteExpense={onDeleteExpense} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
