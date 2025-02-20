
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

  const totalMensualites = credits?.reduce((sum, credit) => sum + credit.montant_mensualite, 0) || 0;

  const baseCardStyle = "hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02]";

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard
          totalRevenue={revenue}
          contributorShares={contributorShares}
        />
        <ExpensesCard
          totalExpenses={expenses}
          recurringExpenses={recurringExpenses.map(expense => ({
            amount: expense.amount,
            debit_day: expense.debit_day,
            debit_month: expense.debit_month,
            periodicity: expense.periodicity
          }))}
        />
        <CreditCard
          totalMensualites={totalMensualites}
          totalRevenue={revenue}
        />
        <SavingsCard
          totalMonthlySavings={savings}
          savingsGoal={savingsGoal}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {recurringExpenses.length > 0 && (
          <div>
            <RecurringExpensesPieChart
              recurringExpenses={recurringExpenses}
              totalExpenses={expenses}
            />
          </div>
        )}
        {credits && credits.length > 0 && (
          <div>
            <CreditsPieChart
              credits={credits}
              totalMensualites={totalMensualites}
            />
          </div>
        )}
        {monthlySavings.length > 0 && (
         
            <SavingsPieChart
              monthlySavings={monthlySavings}
              totalSavings={savings}
            />
        
        )}
      </div>
      <div >
        <ContributorsTable 
          contributors={contributors}
          totalExpenses={expenses}
          totalCredits={totalMensualites}
        />
      </div>
    </div>
  );
};
