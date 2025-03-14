
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RecurringExpense, periodicityLabels } from "../types";
import { ExpenseActionsDropdown } from "../dialogs/ExpenseActionsDropdown";
import { Euro } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseTableRowsProps {
  expenses: RecurringExpense[];
  onViewDetails: (expense: RecurringExpense) => void;
  onEditClick: (expense: RecurringExpense) => void;
  onDeleteClick: (expense: RecurringExpense) => void;
}

export const ExpenseTableRows = ({
  expenses,
  onViewDetails,
  onEditClick,
  onDeleteClick
}: ExpenseTableRowsProps) => {
  return (
    <TableBody>
      {expenses.map((expense, index) => (
        <TableRow key={expense.id} className={cn(
          "transition-colors",
          index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/20"
        )}>
          <TableCell className="py-2">
            <div className="flex items-center gap-3">
              {expense.logo_url ? (
                <img
                  src={expense.logo_url}
                  alt={expense.name}
                  className="w-8 h-8 rounded-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Euro className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <span className="font-semibold">{expense.name}</span>
            </div>
          </TableCell>
          <TableCell className="py-2">{expense.category}</TableCell>
          <TableCell className="py-2">{periodicityLabels[expense.periodicity]}</TableCell>
          <TableCell className="text-center py-2 font-medium">{expense.amount.toLocaleString('fr-FR')} €</TableCell>
          <TableCell className="text-right py-2">
            <div className="flex justify-end">
              <ExpenseActionsDropdown
                onViewDetails={() => onViewDetails(expense)}
                onEdit={() => onEditClick(expense)}
                onDelete={() => onDeleteClick(expense)}
              />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
