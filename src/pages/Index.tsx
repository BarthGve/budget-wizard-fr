import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RevenueCard } from "@/components/dashboard/RevenueCard";
import { ExpensesCard } from "@/components/dashboard/ExpensesCard";
import { SavingsCard } from "@/components/dashboard/SavingsCard";
import { RecurringExpensesPieChart } from "@/components/dashboard/RecurringExpensesPieChart";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const {
    contributors,
    monthlySavings,
    profile,
    recurringExpenses
  } = useDashboardData();

  // Get current month name
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  // Calculate total revenue from contributors
  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  const yearlyRevenue = totalRevenue * 12;

  // Calculate monthly expenses based on debit dates
  const calculateMonthlyExpenses = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

    return recurringExpenses?.reduce((sum, expense) => {
      switch (expense.periodicity) {
        case "monthly":
          return sum + expense.amount;
        case "quarterly":
          // Check if this quarter's debit month matches current month
          const quarterMonths = expense.debit_month ? 
            [expense.debit_month, ((expense.debit_month + 2) % 12) + 1, ((expense.debit_month + 5) % 12) + 1] : 
            [1, 4, 7, 10];
          return sum + (quarterMonths.includes(currentMonth) ? expense.amount : 0);
        case "yearly":
          // Include yearly expense only if current month matches debit month
          return sum + (expense.debit_month === currentMonth ? expense.amount : 0);
        default:
          return sum;
      }
    }, 0) || 0;
  };

  // Calculate yearly expenses with separate accumulation
  const calculateYearlyExpenses = () => {
    if (!recurringExpenses) return 0;

    // Monthly expenses annualized
    const monthlyTotal = recurringExpenses
      .filter(expense => expense.periodicity === "monthly")
      .reduce((sum, expense) => sum + expense.amount * 12, 0);

    // Quarterly expenses annualized
    const quarterlyTotal = recurringExpenses
      .filter(expense => expense.periodicity === "quarterly")
      .reduce((sum, expense) => sum + expense.amount * 4, 0);

    // Yearly expenses as is
    const yearlyTotal = recurringExpenses
      .filter(expense => expense.periodicity === "yearly")
      .reduce((sum, expense) => sum + expense.amount, 0);

    return monthlyTotal + quarterlyTotal + yearlyTotal;
  };

  const monthlyExpenses = calculateMonthlyExpenses();
  const yearlyExpenses = calculateYearlyExpenses();

  // Calculate total monthly savings
  const totalMonthlySavings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
  const yearlyMonthlySavings = totalMonthlySavings * 12;

  // Calculate monthly balance
  const monthlyBalance = totalRevenue - monthlyExpenses - totalMonthlySavings;
  const yearlyBalance = yearlyRevenue - yearlyExpenses - yearlyMonthlySavings;

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
  const getCumulativeExpensePercentages = (expenses: number) => {
    return contributors?.reduce<{
      name: string;
      start: number;
      end: number;
      amount: number;
    }[]>((acc, contributor) => {
      const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
      const contributorShare = expenses * (contributor.percentage_contribution / 100);
      return [...acc, {
        name: contributor.name,
        start: lastEnd,
        end: lastEnd + contributor.percentage_contribution,
        amount: contributorShare
      }];
    }, []) || [];
  };

  // Calculate savings goal based on total revenue and savings percentage
  const savingsGoal = profile?.savings_goal_percentage 
    ? (currentView === "yearly" ? yearlyRevenue : totalRevenue) * profile.savings_goal_percentage / 100 
    : 0;

  // Get expenses for pie chart based on current view
  const getExpensesForPieChart = () => {
    if (!recurringExpenses) return [];

    if (currentView === "yearly") {
      return recurringExpenses.map(expense => {
        let amount = expense.amount;
        if (expense.periodicity === "monthly") {
          amount = expense.amount * 12;
        } else if (expense.periodicity === "quarterly") {
          amount = expense.amount * 4;
        }
        return { ...expense, amount };
      });
    }
    
    return recurringExpenses.map(expense => {
      let amount = expense.amount;
      if (expense.periodicity === "quarterly") {
        amount = expense.amount / 3;
      } else if (expense.periodicity === "yearly") {
        amount = expense.amount / 12;
      }
      return { ...expense, amount };
    });
  };

  // Prepare savings data for pie chart based on view
  const getSavingsForPieChart = () => {
    if (!monthlySavings) return [];
    
    if (currentView === "yearly") {
      return monthlySavings.map(saving => ({
        ...saving,
        amount: saving.amount * 12
      }));
    }
    return monthlySavings;
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-muted-foreground">
                {currentView === "monthly" 
                  ? `Aperçu du budget pour ${currentMonthName}` 
                  : "Aperçu du budget annuel"}
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <RevenueCard 
                totalRevenue={totalRevenue} 
                contributorShares={getCumulativeContributionPercentages(totalRevenue)} 
              />
              <ExpensesCard 
                totalExpenses={monthlyExpenses} 
                contributorShares={getCumulativeExpensePercentages(monthlyExpenses)} 
              />
              <SavingsCard totalMonthlySavings={totalMonthlySavings} savingsGoal={savingsGoal} />
              <Card>
                <CardHeader className="py-[16px]">
                  <CardTitle className="text-2xl">Solde</CardTitle>
                  <CardDescription>Montant restant après charges et épargne</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {monthlyBalance.toFixed(2)} €
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <RecurringExpensesPieChart recurringExpenses={getExpensesForPieChart()} totalExpenses={monthlyExpenses} />
              <SavingsPieChart monthlySavings={monthlySavings || []} totalSavings={totalMonthlySavings} />
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <RevenueCard 
                totalRevenue={yearlyRevenue} 
                contributorShares={getCumulativeContributionPercentages(totalRevenue)} 
              />
              <ExpensesCard 
                totalExpenses={yearlyExpenses} 
                contributorShares={getCumulativeExpensePercentages(yearlyExpenses)} 
              />
              <SavingsCard totalMonthlySavings={yearlyMonthlySavings} savingsGoal={savingsGoal} />
              <Card>
                <CardHeader className="py-[16px]">
                  <CardTitle className="text-2xl">Solde</CardTitle>
                  <CardDescription>Montant restant après charges et épargne</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${yearlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {yearlyBalance.toFixed(2)} €
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <RecurringExpensesPieChart 
                recurringExpenses={getExpensesForPieChart()} 
                totalExpenses={yearlyExpenses} 
              />
              <SavingsPieChart 
                monthlySavings={getSavingsForPieChart()} 
                totalSavings={yearlyMonthlySavings} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
