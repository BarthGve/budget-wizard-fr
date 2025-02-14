
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RevenueCard } from "@/components/dashboard/RevenueCard";
import { ExpensesCard } from "@/components/dashboard/ExpensesCard";
import { SavingsCard } from "@/components/dashboard/SavingsCard";
import { RecurringExpensesPieChart } from "@/components/dashboard/RecurringExpensesPieChart";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const {
    contributors,
    monthlySavings,
    profile,
    recurringExpenses
  } = useDashboardData();

  // Calculate total revenue from contributors
  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  const yearlyRevenue = totalRevenue * 12;

  // Calculate monthly expenses
  const monthlyExpenses = recurringExpenses?.reduce((sum, expense) => {
    switch (expense.periodicity) {
      case "monthly":
        return sum + expense.amount;
      case "quarterly":
        return sum + (expense.amount / 3);
      case "yearly":
        return sum + (expense.amount / 12);
      default:
        return sum;
    }
  }, 0) || 0;

  // Calculate yearly expenses
  const yearlyExpenses = recurringExpenses?.reduce((sum, expense) => {
    switch (expense.periodicity) {
      case "monthly":
        return sum + (expense.amount * 12);
      case "quarterly":
        return sum + (expense.amount * 4);
      case "yearly":
        return sum + expense.amount;
      default:
        return sum;
    }
  }, 0) || 0;

  // Calculate cumulative percentages for the revenue stacked progress bar
  const getCumulativeContributionPercentages = (total: number) => {
    return contributors?.reduce<{
      name: string;
      start: number;
      end: number;
      amount: number;
    }[]>((acc, contributor) => {
      const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
      const percentage = contributor.total_contribution / total * 100;
      return [...acc, {
        name: contributor.name,
        start: lastEnd,
        end: lastEnd + percentage,
        amount: contributor.total_contribution * (currentView === "yearly" ? 12 : 1)
      }];
    }, []) || [];
  };

  // Calculate cumulative expense percentages
  const getCumulativeExpensePercentages = (totalExpenses: number) => {
    return contributors?.reduce<{
      name: string;
      start: number;
      end: number;
      amount: number;
    }[]>((acc, contributor) => {
      const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
      const contributorShare = totalExpenses * (contributor.percentage_contribution / 100);
      return [...acc, {
        name: contributor.name,
        start: lastEnd,
        end: lastEnd + contributor.percentage_contribution,
        amount: contributorShare
      }];
    }, []) || [];
  };

  // Calculate total monthly savings
  const totalMonthlySavings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;

  // Calculate savings goal based on total revenue and savings percentage
  const savingsGoal = profile?.savings_goal_percentage 
    ? (currentView === "yearly" ? yearlyRevenue : totalRevenue) * profile.savings_goal_percentage / 100 
    : 0;

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-muted-foreground">
                Aperçu du budget {currentView === "monthly" ? "mensuel" : "annuel"}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="monthly" onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}>
          <TabsList>
            <TabsTrigger value="monthly">Vue mensuelle</TabsTrigger>
            <TabsTrigger value="yearly">Vue annuelle</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <RevenueCard 
                totalRevenue={totalRevenue} 
                contributorShares={getCumulativeContributionPercentages(totalRevenue)} 
              />
              <ExpensesCard 
                totalExpenses={monthlyExpenses} 
                contributorShares={getCumulativeExpensePercentages(monthlyExpenses)} 
              />
              <SavingsCard totalMonthlySavings={totalMonthlySavings} savingsGoal={savingsGoal} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <RecurringExpensesPieChart recurringExpenses={recurringExpenses || []} totalExpenses={monthlyExpenses} />
              <SavingsPieChart monthlySavings={monthlySavings || []} totalSavings={totalMonthlySavings} />
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <RevenueCard 
                totalRevenue={yearlyRevenue} 
                contributorShares={getCumulativeContributionPercentages(totalRevenue)} 
              />
              <ExpensesCard 
                totalExpenses={yearlyExpenses} 
                contributorShares={getCumulativeExpensePercentages(yearlyExpenses)} 
              />
              <SavingsCard totalMonthlySavings={totalMonthlySavings * 12} savingsGoal={savingsGoal} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <RecurringExpensesPieChart recurringExpenses={recurringExpenses || []} totalExpenses={yearlyExpenses} />
              <SavingsPieChart monthlySavings={monthlySavings || []} totalSavings={totalMonthlySavings * 12} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
