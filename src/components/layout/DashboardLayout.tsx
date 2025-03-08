
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { GlobalBalanceCard } from "../common/GlobalBalanceCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";
import { calculateGlobalBalance } from "@/utils/dashboardCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useState, useMemo, memo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const MemoizedSidebar = memo(Sidebar);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { contributors, recurringExpenses, monthlySavings, refetch } = useDashboardData();
  const queryClient = useQueryClient();
  const channelRef = useRef(null);

  // Forcer un rafraîchissement des données lors du montage du composant
  useEffect(() => {
    // Rafraîchir les données dès le chargement
    const timeoutId = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [refetch]);

  // Configurer un canal dédié pour les contributeurs dans le layout
  useEffect(() => {
    if (channelRef.current) {
      console.log('Suppression du canal existant dans DashboardLayout');
      supabase.removeChannel(channelRef.current);
    }
    
    const channel = supabase
      .channel('dashboard-layout-' + Date.now())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('Contributeurs modifiés depuis DashboardLayout, invalidation des requêtes');
          queryClient.invalidateQueries({ 
            queryKey: ['dashboard-data'],
            refetchType: 'all'
          });
          
          queryClient.invalidateQueries({ 
            queryKey: ['contributors'],
            refetchType: 'all'
          });

          // Forcer un rafraîchissement immédiat
          setTimeout(() => {
            refetch();
          }, 500);
        }
      )
      .subscribe((status) => {
        console.log('État du canal DashboardLayout:', status);
      });
      
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Nettoyage du canal dans DashboardLayout démontage');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient, refetch]);

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
    },
    staleTime: 1000 * 60, // Réduire à 1 minute pour plus de réactivité
    refetchOnWindowFocus: true // Activer le rechargement lors du focus
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
    },
    staleTime: 1000 * 60, // Réduire à 1 minute pour plus de réactivité
    refetchOnWindowFocus: true // Activer le rechargement lors du focus
  });

  const totalRevenue = useMemo(() => 
    contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0,
    [contributors]
  );

  const globalBalance = useMemo(() => 
    calculateGlobalBalance(totalRevenue, recurringExpenses, monthlySavings, credits),
    [totalRevenue, recurringExpenses, monthlySavings, credits]
  );

  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Memoized content to prevent unnecessary re-renders
  const MemoizedContent = useMemo(() => (
    <main className="flex-1 flex flex-col h-screen touch-scroll">
      {!userProfile?.isAdmin && (
        <div className={`fixed right-6 top-4 z-50 ${isMobile ? 'ios-top-safe pt-4' : ''}`}>
          <GlobalBalanceCard 
            balance={globalBalance} 
            className="shadow-lg"
          />
        </div>
      )}

      <div className={`flex-1 container mx-auto p-6 overflow-auto relative ${isMobile ? 'ios-top-safe pt-20' : 'pt-20'}`}>
        <div className="page-transition">
          {children}
        </div>
      </div>

      {isMobile && <div className="h-16 ios-bottom-safe" />}
    </main>
  ), [userProfile?.isAdmin, isMobile, globalBalance, children]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 ios-top-safe">
      <div className={`${isMobile ? (showMobileSidebar ? 'block' : 'hidden') : 'block'}`}>
        <MemoizedSidebar onClose={() => setShowMobileSidebar(false)} />
      </div>

      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 rounded-full shadow-lg bg-background hover:bg-accent ios-top-safe"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {MemoizedContent}
      <Toaster />
    </div>
  );
};
