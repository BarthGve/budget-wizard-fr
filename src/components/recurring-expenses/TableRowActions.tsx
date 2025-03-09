
import { useState } from "react";
import { RecurringExpense } from "./types";
import { RecurringExpenseDialog } from "./RecurringExpenseDialog";
import { RecurringExpenseDetails } from "./RecurringExpenseDetails";
import { DeleteExpenseDialog } from "./dialogs/DeleteExpenseDialog";
import { ExpenseActionsDropdown } from "./dialogs/ExpenseActionsDropdown";
import { Dialog } from "@/components/ui/dialog";

interface TableRowActionsProps {
  expense: RecurringExpense;
  onDeleteExpense: (id: string) => Promise<void>;
}

export const TableRowActions = ({ expense, onDeleteExpense }: TableRowActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = async () => {
    await onDeleteExpense(expense.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <ExpenseActionsDropdown
        onViewDetails={() => setShowDetailsDialog(true)}
        onEdit={() => setShowEditDialog(true)}
        onDelete={() => setShowDeleteDialog(true)}
      />

      {/* Utiliser Dialog pour contrôler l'ouverture et passer RecurringExpenseDetails comme children */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <RecurringExpenseDetails expense={expense} />
      </Dialog>

      <RecurringExpenseDialog 
        expense={expense}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteExpenseDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDelete}
      />
    </>
  );
};
