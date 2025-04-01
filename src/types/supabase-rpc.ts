
/**
 * Types pour les retours des fonctions RPC de Supabase
 */

export interface FinancialStats {
  total_expenses: number;
  total_savings: number;
  total_investments: number;
  active_credits: number;
  avg_monthly_expense: number;
  avg_savings_rate: number;
  expense_distribution?: { name: string; value: number }[];
}

export interface TrendData {
  date: string;
  expenses: number;
  savings: number;
  investments: number;
  creditPayments: number;
}

export interface ExpenseData {
  monthlyData: {
    name: string;
    expenses: number;
    recurring: number;
    other: number;
  }[];
  userExpenseData: {
    name: string;
    expenses: number;
  }[];
}

export interface SegmentationData {
  profileData: {
    name: string;
    value: number;
  }[];
  incomeDistribution: {
    range: string;
    count: number;
  }[];
  userTableData: {
    id: string;
    type: string;
    epargne: number;
    depenses: number;
    credits: number;
    investissements: string;
    properties: number;
  }[];
}
