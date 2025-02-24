
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { GlobalBalanceCard } from "../common/GlobalBalanceCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";
import { Badge } from "@/components/ui/badge";
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
        <div className={`sticky top-0 z-10 p-4 justify-end animate-fade-in bg-background/80 backdrop-blur-sm ${isMobile ? 'ios-top-safe' : ''}`}>
          <div className="flex items-center justify-end gap-4 container mx-auto">
            {!userProfile?.isAdmin && (
              <GlobalBalanceCard balance={globalBalance} />
            )}
          </div>
        </div>
        <div className="container mx-auto p-6 flex-1 overflow-auto touch-scroll">
          <div className="page-transition">{children}</div>
        </div>
        {isMobile && <div className="h-16 ios-bottom-safe" />}
      </main>
      <Toaster />
    </div>
  );
};
