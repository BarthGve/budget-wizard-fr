
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Credit } from "@/components/credits/types";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { CreditSummaryCards } from "@/components/credits/CreditSummaryCards";
import { CreditsList } from "@/components/credits/CreditsList";

const Credits = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: credits = [], isLoading } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      console.log("Fetching credits...");
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

      console.log("Fetched credits:", data);
      return data as Credit[];
    },
    staleTime: Infinity, // Don't refetch automatically
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
  });

  // Use useMemo to prevent unnecessary recalculations
  const { activeCredits, repaidCredits, firstDayOfMonth, totalActiveMensualites, totalRepaidMensualites } = useMemo(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const activeCredits = credits.filter(credit => credit.statut === 'actif');
    const repaidCredits = credits.filter(credit => credit.statut === 'remboursé');

    console.log("Filtering credits - Active:", activeCredits.length, "Repaid:", repaidCredits.length);

    return {
      activeCredits,
      repaidCredits,
      firstDayOfMonth,
      totalActiveMensualites: activeCredits.reduce((sum, credit) => sum + credit.montant_mensualite, 0),
      totalRepaidMensualites: repaidCredits.reduce((sum, credit) => 
        new Date(credit.date_derniere_mensualite) >= firstDayOfMonth ? sum + credit.montant_mensualite : sum, 0
      )
    };
  }, [credits]);

  if (isLoading) {
    return <DashboardLayout>
      <div>Chargement...</div>
    </DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Crédits</h1>
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
          repaidCredits={repaidCredits}
          totalActiveMensualites={totalActiveMensualites}
          totalRepaidMensualites={totalRepaidMensualites}
          firstDayOfMonth={firstDayOfMonth}
        />

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Crédits en cours</h2>
            <CreditsList 
              credits={activeCredits}
              onCreditDeleted={() => {
                queryClient.invalidateQueries({ queryKey: ["credits"] });
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Crédits remboursés</h2>
            <CreditsList 
              credits={repaidCredits}
              onCreditDeleted={() => {
                queryClient.invalidateQueries({ queryKey: ["credits"] });
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Credits;
