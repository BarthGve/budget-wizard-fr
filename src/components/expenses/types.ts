
export interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
  profile_id: string;
}

export interface ExpenseFormData {
  retailerId: string;
  amount: string;
  date: string;
  comment?: string;
}

export interface AddExpenseDialogProps {
  onExpenseAdded?: () => void;
  preSelectedRetailer?: {
    id: string;
    name: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTitleBar?: boolean;
}
