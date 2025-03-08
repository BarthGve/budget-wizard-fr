
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { RetailerCard } from "@/components/expenses/RetailerCard";
import { YearlyTotalCard } from "@/components/expenses/YearlyTotalCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useCallback, useState, memo, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { startOfYear, endOfYear, subYears } from "date-fns";
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import StyledLoader from "@/components/ui/StyledLoader";
import { motion } from "framer-motion";
import { useRealtimeListeners } from "@/hooks/useRealtimeListeners";

// Utilisation de memo pour éviter les re-renders inutiles
const Expenses = memo(function Expenses() {
  const queryClient = useQueryClient();
  const {
    retailers
  } = useRetailers();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  
  // Activer les écouteurs en temps réel
  useRealtimeListeners();
  
  // Configuration optimisée de la requête
  const {
    data: expenses,
    isLoading
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      const {
        data,
        error
      } = await supabase.from("expenses").select("*").eq("profile_id", user.id);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // Garder les données fraîches pendant 5 minutes
    refetchOnWindowFocus: false, // Désactiver le refetch au focus de la fenêtre
    refetchOnMount: true,
    refetchOnReconnect: false, // Désactiver le refetch à la reconnexion
  });

  // Configuration d'un écouteur spécifique pour les changements dans la table des dépenses
  useEffect(() => {
    console.log("Mise en place de l'écouteur pour les dépenses sur la page expenses");
    
    const channel = supabase
      .channel(`expenses-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log(`Changement détecté dans les dépenses:`, payload);
          
          // Forcer le rechargement des données des dépenses
          queryClient.invalidateQueries({ 
            queryKey: ["expenses"],
            exact: false,
            refetchType: 'all' // Forcer le rechargement
          });
        }
      )
      .subscribe((status) => {
        console.log(`Statut du canal expenses-realtime:`, status);
      });
    
    return () => {
      console.log("Nettoyage de l'écouteur expenses-realtime");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Optimiser avec useCallback pour éviter les recréations de fonctions
  const handleExpenseUpdated = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["expenses"],
      exact: true // Invalidation ciblée uniquement
    });
    setAddExpenseDialogOpen(false);
  }, [queryClient]);

  const expensesByRetailer = retailers?.map(retailer => ({
    retailer,
    expenses: expenses?.filter(expense => expense.retailer_id === retailer.id) || []
  }));

  // Calcul des totaux pour la carte de total annuel
  const now = new Date();
  const currentYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfYear(now) && expenseDate <= endOfYear(now);
  }) || [];
  const currentYearTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastYearStart = startOfYear(subYears(now, 1));
  const lastYearEnd = endOfYear(subYears(now, 1));
  const lastYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= lastYearStart && expenseDate <= lastYearEnd;
  }) || [];
  const lastYearTotal = lastYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Définition des variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      rotateX: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  if (isLoading) {
    return <DashboardLayout><StyledLoader/></DashboardLayout>;
  }
  
  return <DashboardLayout>
      <motion.div 
        className="grid gap-6 mt-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Dépenses</h1>
              <p className="text-muted-foreground">Suivez les dépenses que vous réalisez auprès de certaines enseignes.</p>
            </div>
        
            <div className="flex items-center gap-8">
              <div className="flex items-center space-x-2">
                <Switch id="view-mode" checked={viewMode === 'yearly'} onCheckedChange={checked => setViewMode(checked ? 'yearly' : 'monthly')} />
                <Label htmlFor="view-mode">
                  Vue annuelle
                </Label>
              </div>
              <AddExpenseDialog onExpenseAdded={handleExpenseUpdated} open={addExpenseDialogOpen} onOpenChange={setAddExpenseDialogOpen} />
            </div>
          </div>

          <motion.div variants={itemVariants}>
            <CreateRetailerBanner />
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <YearlyTotalCard 
              key={`total-card-${currentYearTotal}`}
              currentYearTotal={currentYearTotal} 
              previousYearTotal={lastYearTotal} 
              expenses={expenses || []} 
              viewMode={viewMode}
            />
          </motion.div>
          
          <motion.div 
            className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4"
            variants={containerVariants}
          >
            {expensesByRetailer?.map(({retailer, expenses: retailerExpenses}, index) => 
              <motion.div 
                key={`${retailer.id}-${retailerExpenses.reduce((sum, exp) => sum + exp.amount, 0)}`}
                variants={itemVariants}
                custom={index}
                whileHover={{
                  scale: 1.02,
                  rotateX: 2,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  z: 20,
                  transition: { duration: 0.2 }
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <RetailerCard 
                  retailer={retailer} 
                  expenses={retailerExpenses} 
                  onExpenseUpdated={handleExpenseUpdated} 
                  viewMode={viewMode} 
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>;
});

export default Expenses;
