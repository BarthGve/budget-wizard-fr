export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  periodicity: "monthly" | "quarterly" | "yearly";
  debit_day: number;
  debit_month: number | null;
  created_at: string;
  logo_url?: string;
  notes?: string;
  vehicle_id?: string;
  vehicle_expense_type?: string;
  auto_generate_vehicle_expense?: boolean;
}

export interface RecurringExpenseTableProps {
  expenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

export const periodicityLabels = {
  monthly: "Mensuelle",
  quarterly: "Trimestrielle",
  yearly: "Annuelle"
};

export const ALL_CATEGORIES = "all_categories";
export const ALL_PERIODICITIES = "all_periodicities";
