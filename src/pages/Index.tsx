
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import {
  calculateTotalRevenue,
  calculateMonthlyExpenses,
  calculateYearlyExpenses,
  calculateTotalSavings,
  getCumulativeContributionPercentages,
  getCumulativeExpensePercentages,
} from "@/utils/dashboardCalculations";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const { contributors, monthlySavings, profile, recurringExpenses } = useDashboardData();

  // Get current month name
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  // Calculate revenues
  const totalRevenue = calculateTotalRevenue(contributors);
  const yearlyRevenue = totalRevenue * 12;

  // Calculate expenses
  const monthlyExpenses = calculateMonthlyExpenses(recurringExpenses);
  const yearlyExpenses = calculateYearlyExpenses(recurringExpenses);

  // Calculate savings
  const totalMonthlySavings = calculateTotalSavings(monthlySavings);
  const yearlyMonthlySavings = totalMonthlySavings * 12;

  // Calculate balances
  const monthlyBalance = totalRevenue - monthlyExpenses - totalMonthlySavings;
  const yearlyBalance = yearlyRevenue - yearlyExpenses - yearlyMonthlySavings;

  // Calculate savings goal
  const savingsGoal = profile?.savings_goal_percentage 
    ? (currentView === "yearly" ? yearlyRevenue : totalRevenue) * profile.savings_goal_percentage / 100 
    : 0;

  // Get expenses for pie chart based on current view
  const getExpensesForPieChart = () => {
    if (!recurringExpenses) return [];

    return recurringExpenses.map(expense => {
      let amount = expense.amount;
      if (currentView === "yearly") {
        if (expense.periodicity === "monthly") {
          amount = expense.amount * 12;
        } else if (expense.periodicity === "quarterly") {
          amount = expense.amount * 4;
        }
      } else {
        if (expense.periodicity === "quarterly") {
          amount = expense.amount / 3;
        } else if (expense.periodicity === "yearly") {
          amount = expense.amount / 12;
        }
      }
      
      return {
        id: expense.id,
        name: expense.name,
        amount,
        category: expense.category,
        debit_day: expense.debit_day,
        debit_month: expense.debit_month,
        periodicity: expense.periodicity as "monthly" | "quarterly" | "yearly"
      };
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
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground">
                {currentView === "monthly" 
                  ? `Aperçu du budget pour le mois de ${currentMonthName} ${new Date().getFullYear()}` 
                  : `Aperçu du budget annuel ${new Date().getFullYear()}`}
              </p>
            </div>
          </div>
        </div>

        
            <DashboardTabContent
              revenue={totalRevenue}
              expenses={monthlyExpenses}
              savings={totalMonthlySavings}
              balance={monthlyBalance}
              savingsGoal={savingsGoal}
              contributorShares={getCumulativeContributionPercentages(contributors, totalRevenue)}
              expenseShares={getCumulativeExpensePercentages(contributors, monthlyExpenses)}
              recurringExpenses={getExpensesForPieChart()}
              monthlySavings={monthlySavings || []}
              contributors={contributors || []}
            />
         
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
