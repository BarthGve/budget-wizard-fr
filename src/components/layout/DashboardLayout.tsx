
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { GlobalBalanceCard } from "../common/GlobalBalanceCard";
import { useDashboardData } from "@/hooks/useDashboardData";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { contributors, recurringExpenses, monthlySavings } = useDashboardData();

  // Calculer le solde global
  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalSavings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
  const globalBalance = totalRevenue - totalExpenses - totalSavings;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 p-4 animate-fade-in">
          <GlobalBalanceCard balance={globalBalance} />
        </div>
        <div className="container mx-auto p-6">
          <div className="page-transition">{children}</div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};
