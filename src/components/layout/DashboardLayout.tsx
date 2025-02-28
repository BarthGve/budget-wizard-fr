
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
import { useState, useMemo, memo, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Memoization du Sidebar pour éviter les re-renders inutiles
const MemoizedSidebar = memo(Sidebar);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { contributors, recurringExpenses, monthlySavings } = useDashboardData();
  const queryClient = useQueryClient();

  // Configurer des écouteurs pour la modification des contributeurs
  useEffect(() => {
    // Configurer un canal pour les modifications de contributeurs
    const channel = supabase
      .channel('contributor-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors'
        },
        () => {
          // Invalider les requêtes pour forcer le rechargement des données
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Optimisation de la requête des crédits avec staleTime
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
    staleTime: 1000 * 60 * 2 // Cache de 2 minutes
  });

  // Gestion optimisée du profil utilisateur
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
    staleTime: 1000 * 60 * 5 // Cache de 5 minutes pour le profil
  });

  // Calculs memoizés pour éviter les recalculs inutiles
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

  // Optimisation du rendu avec un conteneur memoizé
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
