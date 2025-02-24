
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
    id: string;
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner: boolean; // Changed from optional to required
    profile_id: string;
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
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");

      if (error) {
        console.error("Error fetching credits:", error);
        return [];
      }

      return data as Credit[];
    }
  });

  const activeCredits = credits?.filter(credit => credit.statut === 'actif') || [];
  const repaidThisMonth = credits?.filter(credit => {
    const repaymentDate = new Date(credit.date_derniere_mensualite);
    return credit.statut === 'remboursé' && repaymentDate >= firstDayOfMonth;
  }) || [];

  const totalActiveMensualites = activeCredits.reduce((sum, credit) => sum + credit.montant_mensualite, 0);
  const totalRepaidThisMonth = repaidThisMonth.reduce((sum, credit) => sum + credit.montant_mensualite, 0);

  const totalMensualites = totalActiveMensualites + totalRepaidThisMonth;

  const baseCardStyle = "hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02]";

  // Map contributors to ensure all required properties are present
  const mappedContributors = contributors.map(contributor => ({
    ...contributor,
    is_owner: contributor.is_owner ?? false, // Provide a default value if is_owner is undefined
    expenseShare: 0, // Add default values for required Contributor properties
    creditShare: 0
  }));

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
         <div>
            <SavingsPieChart
              monthlySavings={monthlySavings}
              totalSavings={savings}
            />
        </div>
        )}
      </div>
      <div>
        <ContributorsTable 
          contributors={mappedContributors}
          totalExpenses={expenses}
          totalCredits={totalMensualites}
        />
      </div>
    </div>
  );
};
