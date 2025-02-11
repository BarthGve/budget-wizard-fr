
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RevenueCard } from "@/components/dashboard/RevenueCard";
import { ExpensesCard } from "@/components/dashboard/ExpensesCard";
import { SavingsCard } from "@/components/dashboard/SavingsCard";
import { RecurringExpensesPieChart } from "@/components/dashboard/RecurringExpensesPieChart";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { contributors, monthlySavings, profile, recurringExpenses } = useDashboardData();

  // Calculate total revenue from contributors
  const totalRevenue = contributors?.reduce(
    (sum, contributor) => sum + contributor.total_contribution,
    0
  ) || 0;

  // Calculate cumulative percentages for the revenue stacked progress bar
  const cumulativeContributionPercentages = contributors?.reduce<{ name: string; start: number; end: number; amount: number }[]>(
    (acc, contributor) => {
      const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
      const percentage = (contributor.total_contribution / totalRevenue) * 100;
      return [
        ...acc,
        {
          name: contributor.name,
          start: lastEnd,
          end: lastEnd + percentage,
          amount: contributor.total_contribution
        }
      ];
    },
    []
  ) || [];

  // Calculate total expenses
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  // Calculate cumulative expense percentages
  const cumulativeExpensePercentages = contributors?.reduce<{ name: string; start: number; end: number; amount: number }[]>(
    (acc, contributor) => {
      const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
      const contributorShare = totalExpenses * (contributor.percentage_contribution / 100);
      return [
        ...acc,
        {
          name: contributor.name,
          start: lastEnd,
          end: lastEnd + contributor.percentage_contribution,
          amount: contributorShare
        }
      ];
    },
    []
  ) || [];

  // Calculate total monthly savings
  const totalMonthlySavings = monthlySavings?.reduce(
    (sum, saving) => sum + saving.amount,
    0
  ) || 0;

  // Calculate savings goal based on total revenue and savings percentage
  const savingsGoal = profile?.savings_goal_percentage
    ? (totalRevenue * profile.savings_goal_percentage) / 100
    : 0;

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {/* En-tête du dashboard */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Aperçu du budget mensuel
              </p>
            </div>
          </div>
        </div>

        {/* Cartes principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RevenueCard 
            totalRevenue={totalRevenue}
            contributorShares={cumulativeContributionPercentages}
          />
          <ExpensesCard 
            totalExpenses={totalExpenses}
            contributorShares={cumulativeExpensePercentages}
          />
          <SavingsCard 
            totalMonthlySavings={totalMonthlySavings}
            savingsGoal={savingsGoal}
          />
        </div>

        {/* Graphiques circulaires */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecurringExpensesPieChart 
            recurringExpenses={recurringExpenses || []}
            totalExpenses={totalExpenses}
          />
          <SavingsPieChart 
            monthlySavings={monthlySavings || []}
            totalSavings={totalMonthlySavings}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
