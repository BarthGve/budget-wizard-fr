import { memo, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Banknote, PiggyBank } from "lucide-react";
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

  // Formatter un montant en euros
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
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

        {/* Cards style similaire aux dépenses récurrentes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className={cn(
            "overflow-hidden",
            "border border-purple-100 bg-white shadow-sm",
            "dark:border-purple-900/20 dark:bg-gray-800/50"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <span className={cn(
                  "mr-2 flex h-8 w-8 items-center justify-center rounded-full",
                  "bg-purple-100 dark:bg-purple-900/30"
                )}>
                  <Banknote className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </span>
                <span>Mensualités actives</span>
              </CardTitle>
              <CardDescription>Total des mensualités de vos crédits en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(totalActiveMensualites)}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">/ mois</span>
                </div>
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  "bg-purple-50 text-purple-600",
                  "dark:bg-purple-900/20 dark:text-purple-400"
                )}>
                  {activeCredits.length} crédits actifs
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "overflow-hidden",
            "border border-green-100 bg-white shadow-sm",
            "dark:border-green-900/20 dark:bg-gray-800/50"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <span className={cn(
                  "mr-2 flex h-8 w-8 items-center justify-center rounded-full",
                  "bg-green-100 dark:bg-green-900/30"
                )}>
                  <PiggyBank className="h-4 w-4 text-green-600 dark:text-green-400" />
                </span>
                <span>Remboursements ce mois-ci</span>
              </CardTitle>
              <CardDescription>Mensualités remboursées durant le mois en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(monthlyStats.total_mensualites_remboursees)}
                </div>
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  "bg-green-50 text-green-600",
                  "dark:bg-green-900/20 dark:text-green-400"
                )}>
                  {monthlyStats.credits_rembourses_count} paiements
                </span>
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
            <div className="flex items-center mb-4">
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
