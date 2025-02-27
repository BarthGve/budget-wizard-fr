import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Credit } from "@/components/credits/types";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { CreditSummaryCards } from "@/components/credits/CreditSummaryCards";
import { CreditsList } from "@/components/credits/CreditsList";
import StyledLoader from "@/components/ui/StyledLoader";
const Credits = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);
  const {
    data: credits = [],
    isLoading: isLoadingCredits
  } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos crédits");
        throw new Error("Not authenticated");
      }
      const {
        data,
        error
      } = await supabase.from("credits").select("*").eq('profile_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }
      return data as Credit[];
    }
  });
  const {
    data: monthlyStats = {
      credits_rembourses_count: 0,
      total_mensualites_remboursees: 0
    },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ["credits-monthly-stats"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const {
        data,
        error
      } = await supabase.rpc('get_credits_stats_current_month', {
        p_profile_id: user.id
      });
      if (error) {
        console.error("Error fetching monthly stats:", error);
        toast.error("Erreur lors du chargement des statistiques mensuelles");
        throw error;
      }
      return data?.[0] || {
        credits_rembourses_count: 0,
        total_mensualites_remboursees: 0
      };
    }
  });
  const {
    activeCredits,
    totalActiveMensualites
  } = credits.reduce((acc, credit) => ({
    activeCredits: credit.statut === 'actif' ? [...acc.activeCredits, credit] : acc.activeCredits,
    totalActiveMensualites: credit.statut === 'actif' ? acc.totalActiveMensualites + credit.montant_mensualite : acc.totalActiveMensualites
  }), {
    activeCredits: [] as Credit[],
    totalActiveMensualites: 0
  });
  const isLoading = isLoadingCredits || isLoadingStats;
  if (isLoading) {
    return <DashboardLayout>
     <StyledLoader/>
    </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Crédits</h1>
            <p className="text-muted-foreground">
              Gérez vos crédits et leurs échéances
            </p>
          </div>
          <CreditDialog trigger={<Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un crédit
              </Button>} />
        </div>

        <CreditSummaryCards activeCredits={activeCredits} repaidThisMonth={monthlyStats.credits_rembourses_count} totalActiveMensualites={totalActiveMensualites} totalRepaidMensualitesThisMonth={monthlyStats.total_mensualites_remboursees} />

        <div className="space-y-6">
          <div>
            <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-2xl mb-4">Crédits en cours</h2>
            <CreditsList credits={activeCredits} onCreditDeleted={() => {
            queryClient.invalidateQueries({
              queryKey: ["credits"]
            });
            queryClient.invalidateQueries({
              queryKey: ["credits-monthly-stats"]
            });
          }} />
          </div>
        </div>
      </div>
    </DashboardLayout>;
};
export default Credits;