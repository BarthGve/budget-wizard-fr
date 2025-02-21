
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { GlobalBalanceCard } from "../common/GlobalBalanceCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { contributors, recurringExpenses, monthlySavings } = useDashboardData();

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

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      return { 
        ...profile, 
        isAdmin
      };
    }
  });

  // Calculer le solde global
  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  
  const currentMonth = new Date().getMonth() + 1;
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => {
    switch (expense.periodicity) {
      case "monthly":
        return sum + expense.amount;
      case "quarterly":
        return sum + (expense.debit_month === currentMonth ? expense.amount : 0);
      case "yearly":
        return sum + (expense.debit_month === currentMonth ? expense.amount : 0);
      default:
        return sum;
    }
  }, 0) || 0;

  const totalSavings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
  const totalCredits = credits?.reduce((sum, credit) => sum + credit.montant_mensualite, 0) || 0;
  const globalBalance = totalRevenue - totalExpenses - totalSavings - totalCredits;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 p-4 justify-end animate-fade-in">
          <div className="flex items-center justify-end gap-4 container mx-auto">
            {!userProfile?.isAdmin && (
              <GlobalBalanceCard balance={globalBalance} />
            )}
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
