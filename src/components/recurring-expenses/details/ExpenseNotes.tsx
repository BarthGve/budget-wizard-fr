
import { cn } from "@/lib/utils";
import { RecurringExpense } from "../types";

interface ExpenseNotesProps {
  expense: RecurringExpense;
}

export const ExpenseNotes = ({ expense }: ExpenseNotesProps) => {
  if (!expense.notes) return null;

  return (
    <div className={cn(
      "mt-6 p-4 rounded-lg",
      // Light mode
      "bg-gray-50 border border-gray-200",
      // Dark mode
      "dark:bg-gray-800/80 dark:border-gray-700"
    )}>
      <h4 className={cn(
        "text-sm font-medium mb-2",
        // Light mode
        "text-gray-700",
        // Dark mode
        "dark:text-gray-300"
      )}>
        Notes
      </h4>
      <p className={cn(
        "text-sm",
        // Light mode
        "text-gray-600",
        // Dark mode
        "dark:text-gray-400"
      )}>
        {expense.notes}
      </p>
    </div>
  );
};
