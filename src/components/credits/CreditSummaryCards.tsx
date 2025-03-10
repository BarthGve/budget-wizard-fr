import { memo, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { CreditsList } from "@/components/credits/CreditsList";
import StyledLoader from "@/components/ui/StyledLoader";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Credit } from "@/components/credits/types";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

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

        {/* Cards avec dégradés comme dans le design fourni */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid gap-4 md:grid-cols-2 mb-6"
        >
          <Card className={cn(
            "overflow-hidden border transition-all duration-200",
            // Light mode
            "border-0 shadow-sm hover:shadow-md bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600",
            // Dark mode
            "dark:border-purple-800/60 dark:from-purple-800 dark:via-violet-800 dark:to-purple-900"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Crédits actifs</CardTitle>
              <CardDescription className="text-violet-100">
                {activeCredits.length} crédit(s) en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalActiveMensualites.toLocaleString('fr-FR')} €
              </div>
              <div className="text-violet-100 mt-2">
                Mensualités totales
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "overflow-hidden border transition-all duration-200",
            // Light mode
            "border-0 shadow-sm hover:shadow-md bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
            // Dark mode
            "dark:border-green-800/60 dark:from-green-700 dark:via-emerald-800 dark:to-teal-900"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Crédits remboursés ce mois</CardTitle>
              <CardDescription className="text-emerald-100">
                {monthlyStats.credits_rembourses_count} crédit(s) à échéance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {monthlyStats.total_mensualites_remboursees.toLocaleString('fr-FR')} €
              </div>
              <div className="text-emerald-100 mt-2">
                Mensualités échues
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className={cn(
                  "font-bold tracking-tight text-2xl",
                  "text-gray-900 dark:text-gray-50"
                )}>
                  Crédits en cours
                </h2>
                <span className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full",
                  "bg-purple-100 text-purple-600",
                  "dark:bg-purple-900/30 dark:text-purple-400"
                )}>
                  {activeCredits.length}
                </span>
              </div>
              {activeCredits.length > 0 && (
                <p className={cn(
                  "text-sm text-muted-foreground",
                  "dark:text-gray-400"
                )}>
                  Consultez et gérez tous vos crédits actifs
                </p>
              )}
            </div>
            
            {activeCredits.length > 0 ? (
              <div className="grid gap-4">
                <CreditsList 
                  credits={activeCredits} 
                  onCreditDeleted={handleCreditDeleted} 
                />
              </div>
            ) : (
              <Card className={cn(
                "text-center p-6",
                "border-dashed border-2 border-gray-200 bg-white/50",
                "dark:border-gray-700 dark:bg-gray-800/20"
              )}>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className={cn(
                    "mb-4 rounded-full p-3",
                    "bg-purple-50 dark:bg-purple-900/20" 
                  )}>
                    <CreditCard className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h3 className={cn(
                    "text-lg font-medium mb-2",
                    "text-gray-800 dark:text-gray-200"
                  )}>
                    Aucun crédit actif
                  </h3>
                  <p className={cn(
                    "text-sm mb-6 max-w-md",
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
              </Card>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
});

export default Credits;
