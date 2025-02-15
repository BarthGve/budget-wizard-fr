
import { RevenueCard } from "./RevenueCard";
import { ExpensesCard } from "./ExpensesCard";
import { SavingsCard } from "./SavingsCard";
import { BalanceCard } from "./BalanceCard";
import { RecurringExpensesPieChart } from "./RecurringExpensesPieChart";
import { SavingsPieChart } from "./SavingsPieChart";

interface DashboardTabContentProps {
  revenue: number;
  expenses: number;
  savings: number;
  balance: number;
  savingsGoal: number;
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
  contributorShares,
  expenseShares,
  recurringExpenses,
  monthlySavings,
}: DashboardTabContentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard
          totalRevenue={revenue}
          contributorShares={contributorShares}
        />
        <ExpensesCard
          totalExpenses={expenses}
          contributorShares={expenseShares}
        />
        <SavingsCard
          totalMonthlySavings={savings}
          savingsGoal={savingsGoal}
        />
        <BalanceCard balance={balance} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <RecurringExpensesPieChart
          recurringExpenses={recurringExpenses}
          totalExpenses={expenses}
        />
        <SavingsPieChart
          monthlySavings={monthlySavings}
          totalSavings={savings}
        />
      </div>
    </div>
  );
};
