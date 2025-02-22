
export interface AddExpenseDialogProps {
  onExpenseAdded: () => void;
  preSelectedRetailer?: {
    id: string;
    name: string;
  };
}

export interface ExpenseFormData {
  retailerId: string;
  amount: string;
  date: string;
  comment: string;
}
