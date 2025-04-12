
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
  
  // Propriétés supplémentaires pour compatibilité avec le code existant
  name?: string;
  logo_url?: string;
  debit_day?: number;
  debit_month?: number;
  notes?: string;
  vehicle_expense_type?: string;
  auto_generate_vehicle_expense?: boolean;
}

// Labels pour les types de périodicité
export const periodicityLabels = {
  monthly: "Mensuel",
  quarterly: "Trimestriel",
  yearly: "Annuel"
};

// Liste des catégories
export const ALL_CATEGORIES = [
  "Logement",
  "Transport",
  "Alimentation",
  "Santé",
  "Éducation",
  "Loisirs",
  "Assurances",
  "Impôts",
  "Autres"
];

// Types pour le tableau des dépenses récurrentes
export interface RecurringExpenseTableProps {
  expenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

// Interface étendue pour les propriétés du tableau
export interface ExtendedRecurringExpenseTableProps extends RecurringExpenseTableProps {
  allExpenses: RecurringExpense[];
}
