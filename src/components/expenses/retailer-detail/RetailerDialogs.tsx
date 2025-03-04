
import { EditExpenseDialog } from "@/components/expenses/EditExpenseDialog";
import { ExpenseActionDetails } from "@/components/expenses/ExpenseActionDetails";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { Retailer } from "@/components/settings/retailers/types";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface RetailerDialogsProps {
  expenseToEdit: Expense | null;
  expenseToView: Expense | null;
  editDialogOpen: boolean;
  detailsDialogOpen: boolean;
  addExpenseDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  setAddExpenseDialogOpen: (open: boolean) => void;
  handleExpenseUpdated: () => void;
  retailer: Retailer | null;
}

export function RetailerDialogs({
  expenseToEdit,
  expenseToView,
  editDialogOpen,
  detailsDialogOpen,
  addExpenseDialogOpen,
  setEditDialogOpen,
  setDetailsDialogOpen,
  setAddExpenseDialogOpen,
  handleExpenseUpdated,
  retailer
}: RetailerDialogsProps) {
  return (
    <>
      <EditExpenseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        expense={expenseToEdit}
        onExpenseUpdated={handleExpenseUpdated}
      />

      <ExpenseActionDetails
        expense={expenseToView}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <AddExpenseDialog
        onExpenseAdded={handleExpenseUpdated}
        preSelectedRetailer={retailer}
        open={addExpenseDialogOpen}
        onOpenChange={setAddExpenseDialogOpen}
      />
    </>
  );
}
