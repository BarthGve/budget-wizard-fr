
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
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard
          totalRevenue={revenue}
          contributorShares={contributorShares}
        />
        <ExpensesCard
          totalExpenses={expenses}
          recurringExpenses={recurringExpenses}
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
        <RecurringExpensesPieChart
          recurringExpenses={recurringExpenses}
          totalExpenses={expenses}
        />
        {credits && credits.length > 0 && (
          <CreditsPieChart
            credits={credits}
            totalMensualites={totalMensualites}
          />
        )}
        <SavingsPieChart
          monthlySavings={monthlySavings}
          totalSavings={savings}
        />
        
      </div>
      <ContributorsTable 
        contributors={contributors}
        totalExpenses={expenses}
        totalCredits={totalMensualites}
      />
    </div>
  );
};
