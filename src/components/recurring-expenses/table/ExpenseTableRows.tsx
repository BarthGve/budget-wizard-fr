
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RecurringExpense, periodicityLabels } from "../types";
import { ExpenseActionsDropdown } from "../dialogs/ExpenseActionsDropdown";
import { formatCurrency } from "@/utils/format";
import { Calendar, Euro, Repeat, Tag } from "lucide-react";
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
          <TableCell className="py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-900/40">
                <Tag className="h-4 w-4 text-gray-500" />
              </div>
              <span className="font-medium">{expense.name}</span>
            </div>
          </TableCell>
          <TableCell className="py-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 mr-2">
                <Tag className="h-4 w-4 text-gray-500" />
              </div>
              {expense.category}
            </div>
          </TableCell>
          <TableCell className="py-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 mr-2">
                <Repeat className="h-4 w-4 text-gray-500" />
              </div>
              {periodicityLabels[expense.periodicity]}
            </div>
          </TableCell>
          <TableCell className="text-center py-3 font-medium">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 mr-2">
                <Euro className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">{formatCurrency(expense.amount)}</span>
            </div>
          </TableCell>
          <TableCell className="text-right py-3">
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
