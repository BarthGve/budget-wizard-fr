import { memo, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { CreditSummaryCards } from "@/components/credits/CreditSummaryCards";
import { CreditsList } from "@/components/credits/CreditsList";
import StyledLoader from "@/components/ui/StyledLoader";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Credit } from "@/components/credits/types";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const Credits = memo(function Credits() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
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
      
      return data as Credit[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false
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
      
      return data?.[0] || {
        credits_rembourses_count: 0,
        total_mensualites_remboursees: 0
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false
  });

  // Calculer les valeurs dérivées de manière optimisée
  const activeCredits = credits?.filter(credit => credit.statut === 'actif') || [];
  const totalActiveMensualites = activeCredits.reduce((sum, credit) => sum + credit.montant_mensualite, 0);

  const handleCreditDeleted = useCallback(() => {
    // Utilisation de invalidateQueries avec options précises
    queryClient.invalidateQueries({
      queryKey: ["credits"],
      exact: true
    });
    queryClient.invalidateQueries({
      queryKey: ["credits-monthly-stats"],
      exact: true
    });
    
    toast.success("Le crédit a été supprimé avec succès");
  }, [queryClient]);

  const isLoading = isLoadingCredits || isLoadingStats;
  
  if (isLoading) {
    return <DashboardLayout><StyledLoader /></DashboardLayout>;
  }
  
  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-purple-100 dark:bg-purple-900/30"
            )}>
              <CreditCard className={cn("h-5 w-5", "text-purple-600 dark:text-purple-400")} />
            </div>
            <div>
              <h1 className={cn(
                "text-3xl font-bold tracking-tight",
                "text-gray-900 dark:text-gray-50"
              )}>
                Crédits
              </h1>
              <p className={cn(
                "text-muted-foreground",
                "dark:text-gray-400"
              )}>
                Gérez vos crédits et leurs échéances
              </p>
            </div>
          </div>
          <CreditDialog 
            trigger={
              <Button 
                size="sm"
                className={cn(
                  "bg-purple-600 hover:bg-purple-700",
                  "text-white shadow-sm",
                  "dark:bg-purple-600 dark:hover:bg-purple-700",
                  "dark:text-white"
                )}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un crédit
              </Button>
            } 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CreditSummaryCards 
            activeCredits={activeCredits} 
            repaidThisMonth={monthlyStats.credits_rembourses_count} 
            totalActiveMensualites={totalActiveMensualites} 
            totalRepaidMensualitesThisMonth={monthlyStats.total_mensualites_remboursees} 
          />
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className={cn(
              "font-bold tracking-tight text-2xl mb-4",
              "text-gray-900 dark:text-gray-50"
            )}>
              Crédits en cours
            </h2>
            
            {activeCredits.length > 0 ? (
              <CreditsList 
                credits={activeCredits} 
                onCreditDeleted={handleCreditDeleted} 
              />
            ) : (
              <div className={cn(
                "text-center rounded-lg border p-8",
                "bg-white border-gray-200",
                "dark:bg-gray-800/50 dark:border-gray-700"
              )}>
                <h3 className={cn(
                  "text-lg font-medium mb-2",
                  "text-gray-800 dark:text-gray-200"
                )}>
                  Aucun crédit actif
                </h3>
                <p className={cn(
                  "text-sm mb-6 max-w-md mx-auto",
                  "text-gray-600 dark:text-gray-400"
                )}>
                  Vous n'avez pas encore de crédit en cours. Ajoutez votre premier crédit pour commencer à suivre vos remboursements.
                </p>
                <CreditDialog 
                  trigger={
                    <Button
                      size="sm" 
                      className={cn(
                        "bg-purple-600 hover:bg-purple-700",
                        "text-white shadow-sm",
                        "dark:bg-purple-600 dark:hover:bg-purple-700",
                        "dark:text-white"
                      )}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter votre premier crédit
                    </Button>
                  } 
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
});

export default Credits;
