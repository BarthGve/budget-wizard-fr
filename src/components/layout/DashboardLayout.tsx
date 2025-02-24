
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { GlobalBalanceCard } from "../common/GlobalBalanceCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";
import { calculateGlobalBalance } from "@/utils/dashboardCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
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

  const totalRevenue = contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0;
  const globalBalance = calculateGlobalBalance(totalRevenue, recurringExpenses, monthlySavings, credits);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 ios-top-safe">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen touch-scroll">
        {/* Header avec GlobalBalanceCard fixe */}
        {!userProfile?.isAdmin && (
          <div className={`fixed right-6 top-4 z-50 ${isMobile ? 'ios-top-safe pt-4' : ''}`}>
            <GlobalBalanceCard 
              balance={globalBalance} 
              className="shadow-lg"
            />
          </div>
        )}

        {/* Contenu principal défilable */}
        <div className={`flex-1 container mx-auto p-6 overflow-auto relative ${isMobile ? 'ios-top-safe pt-20' : 'pt-20'}`}>
          <div className="page-transition">
            {children}
          </div>
        </div>

        {isMobile && <div className="h-16 ios-bottom-safe" />}
      </main>
      <Toaster />
    </div>
  );
};
