
// Types pour les dépenses récurrentes
export interface RecurringExpense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  periodicity: "monthly" | "quarterly" | "yearly";
  next_payment_date: string;
  created_at: string;
  updated_at: string;
  vehicle_id: string | null;
  property_id: string | null;
  payment_method: string | null;
  description: string | null;
  reminder_days: number | null;
}
