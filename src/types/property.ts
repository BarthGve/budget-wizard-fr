
export interface Property {
  id: string;
  name: string;
  address: string;
  area: number;
  latitude: number;
  longitude: number;
  purchase_value: number;
  monthly_rent?: number | null;
  loan_payment?: number | null;
  photo_url?: string | null;
  investment_type?: string | null;
  heating_type?: string | null;
  created_at: string;
  updated_at: string;
  profile_id: string;
}

export interface NewProperty {
  name: string;
  address: string;
  area: string;
  purchase_value: string;
  monthly_rent: string;
  loan_payment: string;
  investment_type: string;
  heating_type: string;
}

export interface PropertyRecurringExpense {
  id: string;
  property_id: string;
  recurring_expense_id: string;
  created_at: string;
}
