
import { useState } from "react";
import { RecurringExpense } from "../types";
import { DeleteExpenseConfirmDialog } from "../dialogs/DeleteExpenseConfirmDialog";
import { RecurringExpenseDialog } from "../RecurringExpenseDialog";
import { Dialog } from "@/components/ui/dialog";
import { RecurringExpenseDetails } from "../RecurringExpenseDetails";

export interface TableDialogProps {
  expenseToDelete: RecurringExpense | null;
  selectedExpense: RecurringExpense | null;
  showEditDialog: boolean;
  showDetailsDialog: boolean;
  setExpenseToDelete: (expense: RecurringExpense | null) => void;
  setShowEditDialog: (show: boolean) => void;
  setShowDetailsDialog: (show: boolean) => void;
  onDeleteExpense: (id: string) => Promise<void>;
}

export const TableDialogs = ({
  expenseToDelete,
  selectedExpense,
  showEditDialog,
  showDetailsDialog,
  setExpenseToDelete,
  setShowEditDialog,
  setShowDetailsDialog,
  onDeleteExpense
}: TableDialogProps) => {
  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  return (
    <>
      <DeleteExpenseConfirmDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => {
          if (!open) setExpenseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        expenseName={expenseToDelete?.name}
      />

      {/* Dialog pour éditer une charge récurrente */}
      <RecurringExpenseDialog
        expense={selectedExpense || undefined}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Dialog pour afficher les détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        {selectedExpense && <RecurringExpenseDetails expense={selectedExpense} />}
      </Dialog>
    </>
  );
};
