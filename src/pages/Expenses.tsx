
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useState, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useRealtimeListeners } from "@/hooks/useRealtimeListeners";
import { YearlyTotalCard } from "@/components/expenses/YearlyTotalCard";
import { ExpensesHeader } from "@/components/expenses/ExpensesHeader";
import { useExpensesData } from "@/hooks/useExpensesData";
import { useYearlyTotals } from "@/hooks/useYearlyTotals";
import { RetailersExpensesChart } from "@/components/expenses/retailers-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ExpensesPageSkeleton } from "@/components/expenses/skeletons/ExpensesPageSkeleton";
import { RetailersSection } from "@/components/expenses/retailers-section";

const Expenses = memo(function Expenses() {
  const { retailers } = useRetailers();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  
  const { expenses, isLoading, handleExpenseUpdated } = useExpensesData();
  
  useRealtimeListeners();
  
  const { currentYearTotal, lastYearTotal } = useYearlyTotals(expenses);
  
  // Utiliser useMediaQuery pour détecter les petits écrans (smartphones)
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  // Calcul de la moyenne mensuelle et annuelle des dépenses
  const { monthlyAverage, yearlyAverage, averageMonthlyTransactions, averageYearlyTransactions } = useMemo(() => {
    if (!expenses || expenses.length === 0) return { 
      monthlyAverage: 0, 
      yearlyAverage: 0, 
      averageMonthlyTransactions: 0, 
      averageYearlyTransactions: 0 
    };
    
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
    
    // Calculer le nombre d'années
    const yearsDiff = Math.max(1, monthsDiff / 12);
    
    // Calculer les moyennes
    const monthlyAvg = totalAmount / monthsDiff;
    const yearlyAvg = totalAmount / yearsDiff;
    
    // Calculer le nombre moyen de transactions par mois et par an
    const avgMonthlyTx = expenses.length / monthsDiff;
    const avgYearlyTx = expenses.length / yearsDiff;
    
    return { 
      monthlyAverage: monthlyAvg, 
      yearlyAverage: yearlyAvg,
      averageMonthlyTransactions: avgMonthlyTx,
      averageYearlyTransactions: avgYearlyTx
    };
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
    return <ExpensesPageSkeleton displayMode={displayMode} />;
  }
  
  return (
    <motion.div 
      className="grid gap-6 container px-4 py-6 mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="space-y-4 gap-6">
        <ExpensesHeader 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          onExpenseAdded={handleExpenseUpdated}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />
        <motion.div variants={itemVariants}>
          <CreateRetailerBanner />
        </motion.div>
        
        {/* Disposition avec flex pour les écrans larges, colonne pour mobile */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 mt-8 mb-8">
          {/* Carte de total des dépenses (1/3 sur grands écrans, pleine largeur sur mobile) */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/3 grid grid-cols-1 gap-4">
            {/* Supprimer l'effet whileHover pour cette carte */}
            <motion.div>
              <YearlyTotalCard 
                key={`total-card-${currentYearTotal}`}
                currentYearTotal={currentYearTotal} 
                previousYearTotal={lastYearTotal} 
                expenses={expenses || []} 
                viewMode={viewMode}
              />
            </motion.div>
            
            {/* Carte de moyenne mensuelle/annuelle avec le même design - sans effet hover */}
            <Card className={cn(
              "overflow-hidden transition-all duration-200 h-full relative",
              "border shadow-lg",
              // Light mode
              "bg-white border-tertiary-100",
              // Dark mode
              "dark:bg-gray-800/90 dark:border-tertiary-800/50"
            )}>
              {/* Fond radial gradient */}
              <div className={cn(
                "absolute inset-0 opacity-5",
                // Light mode
                "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-tertiary-400 via-tertiary-300 to-transparent",
                // Dark mode
                "dark:opacity-10 dark:from-tertiary-400 dark:via-tertiary-500 dark:to-transparent"
              )} />
              
              <CardHeader className="pb-2 pt-6 relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      // Light mode
                      "bg-tertiary-100 text-tertiary-700",
                      // Dark mode
                      "dark:bg-tertiary-800/40 dark:text-tertiary-300",
                      // Common
                      "p-2 rounded-lg"
                    )}>
                      <Calculator className="h-4 w-4" />
                    </div>
                    <CardTitle className={cn(
                      "text-lg font-semibold",
                      // Light mode
                      "text-tertiary-700",
                      // Dark mode
                      "dark:text-tertiary-300"
                    )}>
                      Moyenne des dépenses
                    </CardTitle>
                  </div>
                </div>
                
                <CardDescription className={cn(
                  "mt-2 text-sm",
                  // Light mode
                  "text-tertiary-600/80",
                  // Dark mode
                  "dark:text-tertiary-400/90"
                )}>
                  {viewMode === 'monthly' ? "Moyenne mensuelle" : "Moyenne annuelle"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-1 pb-6 relative z-10">
                <p className={cn(
                  "text-2xl font-bold",
                  // Light mode
                  "text-tertiary-700",
                  // Dark mode
                  "dark:text-tertiary-300"
                )}>
                  {formatCurrency(viewMode === 'monthly' ? monthlyAverage : yearlyAverage)}
                </p>
                
                <div className="mt-3">
                  <p className={cn(
                    "text-sm",
                    "text-tertiary-600/80 dark:text-tertiary-400/90"
                  )}>
                    {Math.round(viewMode === 'monthly' ? averageMonthlyTransactions : averageYearlyTransactions)} 
                    {viewMode === 'monthly' ? " achats par mois" : " achats par an"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Graphique des dépenses par enseigne (2/3) - masqué sur mobile */}
          {!isMobileScreen && (
            <motion.div variants={itemVariants} className="w-full lg:w-2/3">
              <RetailersExpensesChart 
                expenses={expenses || []} 
                retailers={retailers || []} 
                viewMode={viewMode}
              />
            </motion.div>
          )}
        </motion.div>
        
        {/* Remplacement de la grille de cartes détaillants par la nouvelle section */}
        <RetailersSection 
          expensesByRetailer={expensesByRetailer || []}
          onExpenseUpdated={handleExpenseUpdated}
          viewMode={viewMode}
          displayMode={displayMode}
        />
      </motion.div>
    </motion.div>
  );
});

export default Expenses;
