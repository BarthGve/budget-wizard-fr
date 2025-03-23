
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useState, memo, useMemo } from "react";
import StyledLoader from "@/components/ui/StyledLoader";
import { motion } from "framer-motion";
import { useRealtimeListeners } from "@/hooks/useRealtimeListeners";
import { YearlyTotalCard } from "@/components/expenses/YearlyTotalCard";
import { ExpensesHeader } from "@/components/expenses/ExpensesHeader";
import { RetailersGrid } from "@/components/expenses/RetailersGrid";
import { useExpensesData } from "@/hooks/useExpensesData";
import { useYearlyTotals } from "@/hooks/useYearlyTotals";
import { RetailersExpensesChart } from "@/components/expenses/RetailersExpensesChart";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { subMonths, isAfter } from "date-fns";

const Expenses = memo(function Expenses() {
  const { retailers } = useRetailers();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  const { expenses, isLoading, handleExpenseUpdated } = useExpensesData();
  
  useRealtimeListeners();
  
  const { currentYearTotal, lastYearTotal } = useYearlyTotals(expenses);

  // Calcul de la moyenne mensuelle des dépenses
  const monthlyAverage = useMemo(() => {
    if (!expenses || expenses.length === 0) return 0;
    
    // Trouver la date de la plus ancienne dépense
    const oldestExpenseDate = expenses.reduce((oldest, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate < oldest ? expenseDate : oldest;
    }, new Date());
    
    // Date actuelle
    const currentDate = new Date();
    
    // Calculer le nombre de mois entre la plus ancienne dépense et aujourd'hui
    let monthsDiff = (currentDate.getFullYear() - oldestExpenseDate.getFullYear()) * 12 +
                     (currentDate.getMonth() - oldestExpenseDate.getMonth()) + 1;
    
    // S'assurer que le nombre de mois est au moins 1
    monthsDiff = Math.max(1, monthsDiff);
    
    // Calculer la somme totale des dépenses
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculer la moyenne mensuelle
    return totalAmount / monthsDiff;
  }, [expenses]);

  // Nombre de dépenses mensuelles en moyenne
  const averageMonthlyTransactions = useMemo(() => {
    if (!expenses || expenses.length === 0) return 0;
    
    // Trouver la date de la plus ancienne dépense
    const oldestExpenseDate = expenses.reduce((oldest, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate < oldest ? expenseDate : oldest;
    }, new Date());
    
    // Date actuelle
    const currentDate = new Date();
    
    // Calculer le nombre de mois entre la plus ancienne dépense et aujourd'hui
    let monthsDiff = (currentDate.getFullYear() - oldestExpenseDate.getFullYear()) * 12 +
                    (currentDate.getMonth() - oldestExpenseDate.getMonth()) + 1;
    
    // S'assurer que le nombre de mois est au moins 1
    monthsDiff = Math.max(1, monthsDiff);
    
    // Calculer la moyenne de transactions mensuelles
    return expenses.length / monthsDiff;
  }, [expenses]);

  const expensesByRetailer = retailers?.map(retailer => ({
    retailer,
    expenses: expenses?.filter(expense => expense.retailer_id === retailer.id) || []
  }));
  
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
  
  return (
    <DashboardLayout>
      <motion.div 
        className="grid gap-6 mt-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <ExpensesHeader 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            onExpenseAdded={handleExpenseUpdated} 
          />
          <motion.div variants={itemVariants}>
            <CreateRetailerBanner />
          </motion.div>
          
          {/* Disposition avec flex pour mettre les cartes côte à côte */}
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 mt-8 mb-8">
            {/* Carte de total des dépenses (1/3) */}
            <motion.div variants={itemVariants} className="w-full lg:w-1/3 grid grid-cols-1 gap-4">
              <YearlyTotalCard 
                key={`total-card-${currentYearTotal}`}
                currentYearTotal={currentYearTotal} 
                previousYearTotal={lastYearTotal} 
                expenses={expenses || []} 
                viewMode={viewMode}
              />
              
              {/* Nouvelle carte de moyenne mensuelle */}
              <Card className="border shadow-sm overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-amber-700 dark:text-amber-300">
                      Moyenne mensuelle
                    </h3>
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Calculator className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-2xl font-bold text-amber-700 dark:text-amber-200")}>
                        {formatCurrency(monthlyAverage)}
                      </p>
                    </div>
                    
                    <p className={cn("text-sm text-amber-600/80 dark:text-amber-300/80")}>
                      {Math.round(averageMonthlyTransactions)} achats par mois
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Graphique des dépenses par enseigne (2/3) */}
            <motion.div variants={itemVariants} className="w-full lg:w-2/3">
              <RetailersExpensesChart 
                expenses={expenses || []} 
                retailers={retailers || []} 
                viewMode={viewMode}
              />
            </motion.div>
          </motion.div>
          
          <RetailersGrid 
            expensesByRetailer={expensesByRetailer || []} 
            onExpenseUpdated={handleExpenseUpdated}
            viewMode={viewMode} 
          />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
});

export default Expenses;
