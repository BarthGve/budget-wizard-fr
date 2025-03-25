
export interface AddExpenseDialogProps {
  onExpenseAdded: () => void;
  preSelectedRetailer?: {
    id: string;
    name: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDialogWrapper?: boolean;
}

export interface ExpenseFormData {
  retailerId: string;
  amount: string;
  date: string;
  comment: string;
}
