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
  
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  const { monthlyAverage, yearlyAverage, averageMonthlyTransactions, averageYearlyTransactions } = useMemo(() => {
    if (!expenses || expenses.length === 0) return { 
      monthlyAverage: 0, 
      yearlyAverage: 0, 
      averageMonthlyTransactions: 0, 
      averageYearlyTransactions: 0 
    };
    
    const oldestExpenseDate = expenses.reduce((oldest, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate < oldest ? expenseDate : oldest;
    }, new Date());
    
    const currentDate = new Date();
    
    let monthsDiff = (currentDate.getFullYear() - oldestExpenseDate.getFullYear()) * 12 +
                     (currentDate.getMonth() - oldestExpenseDate.getMonth()) + 1;
    
    monthsDiff = Math.max(1, monthsDiff);
    
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const yearsDiff = Math.max(1, monthsDiff / 12);
    
    const monthlyAvg = totalAmount / monthsDiff;
    const yearlyAvg = totalAmount / yearsDiff;
    
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
        
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 mt-8 mb-8">
          <motion.div variants={itemVariants} className="w-full lg:w-1/3 grid grid-cols-1 gap-4">
            <motion.div>
              <YearlyTotalCard 
                key={`total-card-${currentYearTotal}`}
                currentYearTotal={currentYearTotal} 
                previousYearTotal={lastYearTotal} 
                expenses={expenses || []} 
                viewMode={viewMode}
              />
            </motion.div>
            
            <Card className={cn(
              "overflow-hidden transition-all duration-200 h-full relative",
              "border shadow-lg",
              "bg-white border-tertiary-100",
              "dark:bg-gray-800/95 dark:border-tertiary-700/50 dark:shadow-lg dark:shadow-black/20"
            )}>
         
              
              <CardHeader className="pb-2 pt-6 relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "bg-tertiary-100 text-tertiary-700",
                      "dark:bg-tertiary-800/70 dark:text-tertiary-200",
                      "p-2 rounded-lg"
                    )}>
                      <Calculator className="h-4 w-4" />
                    </div>
                    <CardTitle className={cn(
                      "text-lg font-semibold",
                      "dark:text-white"
                    )}>
                      Moyenne des dépenses
                    </CardTitle>
                  </div>
                </div>
                
                <CardDescription className={cn(
                  "mt-2 text-sm",
                  "text-tertiary-600/80",
                  "dark:text-tertiary-300"
                )}>
                  {viewMode === 'monthly' ? "Moyenne mensuelle" : "Moyenne annuelle"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-1 pb-6 relative z-10">
                <p className={cn(
                  "text-2xl font-bold",
                  "text-tertiary-800 dark:text-tertiary-200"
                )}>
                  {formatCurrency(viewMode === 'monthly' ? monthlyAverage : yearlyAverage)}
                </p>
                
                <div className="mt-3">
                  <p className={cn(
                    "text-sm",
                    "text-muted-foreground dark:text-gray-300"
                  )}>
                    {Math.round(viewMode === 'monthly' ? averageMonthlyTransactions : averageYearlyTransactions)} 
                    {viewMode === 'monthly' ? " achats par mois" : " achats par an"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
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
