
import { RevenueCard } from "./RevenueCard";
import { ExpensesCard } from "./ExpensesCard";
import { SavingsCard } from "./SavingsCard";
import { CreditCard } from "./CreditCard";
import { RecurringExpensesPieChart } from "./RecurringExpensesPieChart";
import { SavingsPieChart } from "./SavingsPieChart";
import { CreditsPieChart } from "./CreditsPieChart";
import { ContributorsTable } from "./ContributorsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";

interface DashboardTabContentProps {
  revenue: number;
  expenses: number;
  savings: number;
  balance: number;
  savingsGoal: number;
  contributors: Array<{
    name: string;
    total_contribution: number;
    percentage_contribution: number;
  }>;
  contributorShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  expenseShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  recurringExpenses: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
}

export const DashboardTabContent = ({
  revenue,
  expenses,
  savings,
  balance,
  savingsGoal,
  contributors,
  contributorShares,
  expenseShares,
  recurringExpenses,
  monthlySavings,
}: DashboardTabContentProps) => {
  // Récupérer les crédits actifs
  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq("statut", "actif");

      if (error) {
        console.error("Error fetching credits:", error);
        return [];
      }

      return data as Credit[];
    }
  });

  // Calculer le total des mensualités de crédit
  const totalMensualites = credits?.reduce((sum, credit) => sum + credit.montant_mensualite, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard
          totalRevenue={revenue}
          contributorShares={contributorShares}
          className="hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"
        />
        <ExpensesCard
          totalExpenses={expenses}
          recurringExpenses={recurringExpenses.map(expense => ({
            amount: expense.amount,
            debit_day: expense.debit_day,
            debit_month: expense.debit_month,
            periodicity: expense.periodicity
          }))}
          className="hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-red-500/10"
        />
        <CreditCard
          totalMensualites={totalMensualites}
          totalRevenue={revenue}
          className="hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10"
        />
        <SavingsCard
          totalMonthlySavings={savings}
          savingsGoal={savingsGoal}
          className="hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {recurringExpenses.length > 0 && (
          <div className="p-6 rounded-lg bg-card hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5">
            <RecurringExpensesPieChart
              recurringExpenses={recurringExpenses}
              totalExpenses={expenses}
            />
          </div>
        )}
        {credits && credits.length > 0 && (
          <div className="p-6 rounded-lg bg-card hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5">
            <CreditsPieChart
              credits={credits}
              totalMensualites={totalMensualites}
            />
          </div>
        )}
        {monthlySavings.length > 0 && (
          <div className="p-6 rounded-lg bg-card hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5">
            <SavingsPieChart
              monthlySavings={monthlySavings}
              totalSavings={savings}
            />
          </div>
        )}
      </div>
      <div className="rounded-lg bg-card hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/5 p-6">
        <ContributorsTable 
          contributors={contributors}
          totalExpenses={expenses}
          totalCredits={totalMensualites}
        />
      </div>
    </div>
  );
};
