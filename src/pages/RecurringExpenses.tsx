
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { RecurringExpenseTable } from "@/components/recurring-expenses/RecurringExpenseTable";
import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import StyledLoader from "@/components/ui/StyledLoader";
import { memo, useCallback } from "react";
import { motion } from "framer-motion";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  periodicity: "monthly" | "quarterly" | "yearly";
  debit_day: number;
  debit_month: number | null;
  created_at: string;
}

// Utilisation de memo pour éviter les re-renders inutiles
const RecurringExpenses = memo(function RecurringExpenses() {
  const queryClient = useQueryClient();
  
  // Configuration optimisée de la requête
  const {
    data: recurringExpenses,
    isLoading
  } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos charges récurrentes");
        throw new Error("Not authenticated");
      }
      const {
        data,
        error
      } = await supabase.from("recurring_expenses").select("*").order("created_at", {
        ascending: true
      });
      if (error) {
        console.error("Error fetching recurring expenses:", error);
        toast.error("Erreur lors du chargement des charges récurrentes");
        throw error;
      }
      return data as RecurringExpense[];
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes to prevent unnecessary refetches
    refetchOnWindowFocus: false, // Disable refetching when window gains focus
    refetchOnReconnect: false, // Désactiver le refetch à la reconnexion
    retry: 1 // Only retry once on failure
  });

  // Optimiser avec useCallback pour éviter les recréations de fonctions
  const handleDeleteExpense = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("recurring_expenses").delete().eq("id", id);
      if (error) throw error;
      
      // Invalidation ciblée
      queryClient.invalidateQueries({
        queryKey: ["recurring-expenses"],
        exact: true
      });
      
      toast.success("Dépense supprimée avec succès");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Erreur lors de la suppression de la dépense");
    }
  }, [queryClient]);

  const monthlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "monthly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const quarterlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "quarterly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const yearlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "yearly").reduce((sum, expense) => sum + expense.amount, 0) || 0;

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
      rotateX: 10
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
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9,
      rotateX: 20,
      z: -50
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      z: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1
      }
    })
  };

  if (isLoading) {
    return <DashboardLayout><StyledLoader /></DashboardLayout>;
  }

  return <DashboardLayout>
    <motion.div 
      className="space-y-6 max-w-[1600px] mx-auto px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Charges récurrentes
          </h1>
          <p className="text-muted-foreground">Gérez vos charges récurrentes et leurs échéances</p>
        </div>
        <RecurringExpenseDialog
          trigger={
            <Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle charge
            </Button>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <CreateCategoryBanner />
      </motion.div>

      <motion.div 
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {[
          {
            title: "Mensuel",
            value: monthlyTotal,
            Icon: Calendar,
            index: 0
          },
          {
            title: "Trimestriel",
            value: quarterlyTotal,
            Icon: CalendarDays,
            index: 1
          },
          {
            title: "Annuel",
            value: yearlyTotal,
            Icon: CalendarRange,
            index: 2
          }
        ].map(({ title, value, Icon, index }) => (
          <motion.div
            key={title}
            custom={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.03,
              rotateX: 5,
              z: 20,
              boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
              transition: { duration: 0.3 }
            }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md dark:bg-gray-800 transform-gpu">
              <CardHeader className="py-[16px]">
                <div className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl md:text-2xl text-white">{title}</CardTitle>
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <CardDescription className="text-sm md:text-base text-white">Total des charges {title.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg md:text-xl text-white font-bold">{Math.round(value)} €</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="w-full overflow-hidden"
        variants={itemVariants}
      >
        <RecurringExpenseTable expenses={recurringExpenses || []} onDeleteExpense={handleDeleteExpense} />
      </motion.div>
    </motion.div>
  </DashboardLayout>;
});

export default RecurringExpenses;
