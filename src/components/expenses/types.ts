
export interface AddExpenseDialogProps {
  onExpenseAdded: () => void;
  preSelectedRetailer?: {
    id: string;
    name: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ExpenseFormData {
  retailerId: string;
  amount: string;
  date: string;
  comment: string;
}
