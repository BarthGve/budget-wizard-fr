
import { BalanceCard } from "./BalanceCard";
import { RevenueCard } from "./RevenueCard";
import { ExpensesCard } from "./ExpensesCard";
import { SavingsCard } from "./SavingsCard";
import { RecurringExpensesCard } from "./RecurringExpensesCard";
import { ContributorsTable } from "./ContributorsTable";
import { RecurringExpensesPieChart } from "./RecurringExpensesPieChart";
import { SavingsPieChart } from "./SavingsPieChart";
import { CreditsPieChart } from "./CreditsPieChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { CreditCard } from "./CreditCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";

interface DashboardTabContentProps {
  view: "monthly" | "yearly";
}

export const DashboardTabContent = ({ view }: DashboardTabContentProps) => {
  const { contributors, recurringExpenses, monthlySavings } = useDashboardData();
  
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

  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalSavings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
  const totalCredits = credits?.reduce((sum, credit) => sum + credit.monthly_payment, 0) || 0;
  const balance = totalRevenue - totalExpenses - totalSavings - totalCredits;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <BalanceCard amount={balance} />
        <RevenueCard amount={totalRevenue} contributorsCount={contributors?.length || 0} />
        <ExpensesCard amount={totalExpenses} />
        <SavingsCard amount={totalSavings} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecurringExpensesCard expenses={recurringExpenses || []} />
        <CreditCard credits={credits || []} />
        <SavingsCard savings={monthlySavings || []} showDetails={true} />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <ContributorsTable contributors={contributors || []} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <RecurringExpensesPieChart expenses={recurringExpenses || []} />
        <SavingsPieChart savings={monthlySavings || []} />
        <CreditsPieChart credits={credits || []} />
      </div>
    </>
  );
};
