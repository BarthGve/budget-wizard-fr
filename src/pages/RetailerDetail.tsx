
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, ShoppingCart } from "lucide-react";
import { RetailerDetailCard } from "@/components/expenses/RetailerDetailCard";
import { RetailerPurchasesList } from "@/components/expenses/RetailerPurchasesList";
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { motion } from "framer-motion";
import { useMemo } from "react";
import StyledLoader from "@/components/ui/StyledLoader";

const RetailerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const now = new Date();

  // Fetch retailer details
  const { data: retailer, isLoading: isLoadingRetailer } = useQuery({
    queryKey: ["retailer", id],
    queryFn: async () => {
      if (!id) throw new Error("Retailer ID is required");
      
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch all expenses for this retailer
  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["retailer-expenses", id],
    queryFn: async () => {
      if (!id) throw new Error("Retailer ID is required");
      
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("retailer_id", id)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!expenses) return null;

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    // Current month expenses
    const currentMonthExpenses = expenses.filter(
      expense => new Date(expense.date) >= monthStart && new Date(expense.date) <= monthEnd
    );
    const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentMonthCount = currentMonthExpenses.length;

    // Current year expenses
    const currentYearExpenses = expenses.filter(
      expense => new Date(expense.date) >= yearStart && new Date(expense.date) <= yearEnd
    );
    const currentYearTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentYearCount = currentYearExpenses.length;

    // Monthly average (based on current year)
    const currentMonth = now.getMonth() + 1; // 1-12
    const monthlyAverage = currentYearTotal / currentMonth;
    const monthlyAveragePurchases = currentYearCount / currentMonth;

    return {
      currentMonth: {
        total: currentMonthTotal,
        count: currentMonthCount
      },
      currentYear: {
        total: currentYearTotal,
        count: currentYearCount,
        expenses: currentYearExpenses
      },
      monthly: {
        average: monthlyAverage,
        averagePurchases: monthlyAveragePurchases
      }
    };
  }, [expenses, now]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (isLoadingRetailer || isLoadingExpenses) {
    return (
      <DashboardLayout>
        <StyledLoader />
      </DashboardLayout>
    );
  }

  if (!retailer) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Enseigne non trouvée</h1>
          <Link to="/expenses">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux dépenses
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleExpenseUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["retailer-expenses", id] });
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6 p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/expenses">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {retailer.name}
              </h1>
              {retailer.logo_url && (
                <img 
                  src={retailer.logo_url} 
                  alt={retailer.name} 
                  className="w-8 h-8 rounded-full object-contain" 
                />
              )}
            </div>
          </div>
        </motion.div>

        {stats && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <RetailerDetailCard 
                title="Dépenses du mois en cours"
                icon={<Calendar className="h-5 w-5 text-indigo-500" />}
                amount={stats.currentMonth.total}
                subtitle={`${stats.currentMonth.count} achats ce mois-ci`}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <RetailerDetailCard 
                title="Dépenses de l'année"
                icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
                amount={stats.currentYear.total}
                subtitle={`${stats.currentYear.count} achats cette année`}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <RetailerDetailCard 
                title="Moyenne mensuelle"
                icon={<ShoppingCart className="h-5 w-5 text-amber-500" />}
                amount={stats.monthly.average}
                subtitle={`${stats.monthly.averagePurchases.toFixed(1)} achats par mois en moyenne`}
                isAverage={true}
              />
            </motion.div>
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold mb-4">Achats de l'année {now.getFullYear()}</h2>
          {stats && (
            <RetailerPurchasesList 
              expenses={stats.currentYear.expenses} 
              onExpenseUpdated={handleExpenseUpdated}
              retailerId={id || ""}
            />
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default RetailerDetail;
