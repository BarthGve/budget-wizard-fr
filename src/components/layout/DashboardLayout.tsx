
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { GlobalBalanceCard } from "../common/GlobalBalanceCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { contributors, recurringExpenses, monthlySavings } = useDashboardData();

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

  // Calculer le solde global
  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalSavings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
  const totalCredits = credits?.reduce((sum, credit) => sum + credit.montant_mensualite, 0) || 0;
  const globalBalance = totalRevenue - totalExpenses - totalSavings - totalCredits;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 p-4 flex justify-end  animate-fade-in">
        <div className="w-auto max-w-xs">
          <GlobalBalanceCard balance={globalBalance} />
        </div>
        </div>
        <div className="container mx-auto p-6">
          <div className="page-transition">{children}</div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};
