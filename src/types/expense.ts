
export interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
  profile_id: string;
}
