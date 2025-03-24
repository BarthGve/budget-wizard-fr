
import { CreditCard } from "../CreditCard";
import { ExpensesCard } from "../ExpensesCard";
import { RevenueCard } from "../RevenueCard";
import { SavingsCard } from "../SavingsCard";
import { BalanceCard } from "../BalanceCard";

interface DashboardCardsProps {
  revenue: number;
  expenses: number;
  totalMensualites: number;
  savings: number;
  savingsGoal: number;
  contributorShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  recurringExpenses: Array<{
    amount: number;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  currentView: "monthly" | "yearly";
}

export const DashboardCards = ({
  revenue,
  expenses,
  totalMensualites,
  savings,
  savingsGoal,
  contributorShares,
  recurringExpenses,
  currentView,
}: DashboardCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <RevenueCard revenue={revenue} currentView={currentView} />
      <CreditCard 
        totalMensualites={totalMensualites} 
        totalRevenue={revenue} 
        currentView={currentView}
      />
      <ExpensesCard 
        totalExpenses={expenses} 
        recurringExpenses={recurringExpenses} 
        currentView={currentView}
      />
      <SavingsCard 
        savings={savings} 
        savingsGoal={savingsGoal} 
        currentView={currentView}
      />
      <BalanceCard currentView={currentView} />
    </div>
  );
};
