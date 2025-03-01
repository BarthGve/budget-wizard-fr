
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback, memo } from "react";
import { Credit } from "@/components/credits/types";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { CreditSummaryCards } from "@/components/credits/CreditSummaryCards";
import { CreditsList } from "@/components/credits/CreditsList";
import StyledLoader from "@/components/ui/StyledLoader";

// Optimisation avec memo et une fonction d'égalité vide (pas de props à comparer)
const Credits = memo(() => {
  // Réduire les logs pour éviter les opérations coûteuses
  // console.log("Rendering Credits page");
  
  const queryClient = useQueryClient();
  
  // Configuration des requêtes avec un long staleTime pour éviter les rechargements inutiles
  const {
    data: credits = [],
    isLoading: isLoadingCredits
  } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      // console.log("Fetching credits data");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos crédits");
        throw new Error("Not authenticated");
      }
      
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }
      
      // console.log("Credits data fetched successfully", data?.length);
      return data as Credit[];
    },
    staleTime: 1000 * 60 * 20, // 20 minutes
    gcTime: 1000 * 60 * 40, // 40 minutes
    refetchOnWindowFocus: false, 
    refetchInterval: false,
    refetchOnMount: false, // Ne pas refetch au montage 
    refetchOnReconnect: false,
  });
  
  // Configuration des stats mensuelles avec un long staleTime
  const {
    data: monthlyStats = {
      credits_rembourses_count: 0,
      total_mensualites_remboursees: 0
    },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ["credits-monthly-stats"],
    queryFn: async () => {
      // console.log("Fetching monthly stats");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .rpc('get_credits_stats_current_month', {
          p_profile_id: user.id
        });
      
      if (error) {
        console.error("Error fetching monthly stats:", error);
        toast.error("Erreur lors du chargement des statistiques mensuelles");
        throw error;
      }
      
      // console.log("Monthly stats fetched successfully");
      return data?.[0] || {
        credits_rembourses_count: 0,
        total_mensualites_remboursees: 0
      };
    },
    staleTime: 1000 * 60 * 20, // 20 minutes 
    gcTime: 1000 * 60 * 40, // 40 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: false, // Ne pas refetch au montage
    refetchOnReconnect: false,
  });

  // Calculer les valeurs dérivées avec useMemo pour éviter des recalculs
  const { activeCredits, totalActiveMensualites } = useMemo(() => {
    // console.log("Calculating derived values from credits");
    if (!credits || credits.length === 0) {
      return {
        activeCredits: [],
        totalActiveMensualites: 0
      };
    }
    
    const active = credits.filter(credit => credit.statut === 'actif');
    const total = active.reduce((sum, credit) => sum + credit.montant_mensualite, 0);
    
    return {
      activeCredits: active,
      totalActiveMensualites: total
    };
  }, [credits]);

  // Stabiliser cette fonction de rappel avec useCallback
  const handleCreditDeleted = useCallback(() => {
    // console.log("Credit deleted, invalidating queries");
    queryClient.invalidateQueries({
      queryKey: ["credits"]
    });
    queryClient.invalidateQueries({
      queryKey: ["credits-monthly-stats"]
    });
  }, [queryClient]);

  const isLoading = isLoadingCredits || isLoadingStats;
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Crédits</h1>
            <p className="text-muted-foreground">
              Gérez vos crédits et leurs échéances
            </p>
          </div>
          <CreditDialog 
            trigger={
              <Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un crédit
              </Button>
            } 
          />
        </div>

        <CreditSummaryCards 
          activeCredits={activeCredits} 
          repaidThisMonth={monthlyStats.credits_rembourses_count} 
          totalActiveMensualites={totalActiveMensualites} 
          totalRepaidMensualitesThisMonth={monthlyStats.total_mensualites_remboursees} 
        />

        <div className="space-y-6">
          <div>
            <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl mb-4">Crédits en cours</h2>
            <CreditsList 
              credits={activeCredits} 
              onCreditDeleted={handleCreditDeleted} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
});

// Nom explicite pour le débogage
Credits.displayName = "CreditsPage";

export default Credits;
