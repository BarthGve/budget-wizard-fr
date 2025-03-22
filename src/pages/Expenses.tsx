import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useState, memo } from "react";
import StyledLoader from "@/components/ui/StyledLoader";
import { motion } from "framer-motion";
import { useRealtimeListeners } from "@/hooks/useRealtimeListeners";
import { YearlyTotalCard } from "@/components/expenses/YearlyTotalCard";
import { ExpensesHeader } from "@/components/expenses/ExpensesHeader";
import { RetailersGrid } from "@/components/expenses/RetailersGrid";
import { useExpensesData } from "@/hooks/useExpensesData";
import { useYearlyTotals } from "@/hooks/useYearlyTotals";
import { RetailersExpensesChart } from "@/components/expenses/RetailersExpensesChart";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Expenses = memo(function Expenses() {
  const { retailers } = useRetailers();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  const { expenses, isLoading, handleExpenseUpdated } = useExpensesData();
  
  useRealtimeListeners();
  
  const { currentYearTotal, lastYearTotal } = useYearlyTotals(expenses);

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
          <motion.div variants={itemVariants} className="mt-8 mb-8">
            <YearlyTotalCard 
              key={`total-card-${currentYearTotal}`}
              currentYearTotal={currentYearTotal} 
              previousYearTotal={lastYearTotal} 
              expenses={expenses || []} 
              viewMode={viewMode}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Évolution des dépenses ({viewMode === 'monthly' ? 'mensuelles' : 'annuelles'})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpensesChart expenses={expenses || []} viewMode={viewMode} />
              </CardContent>
            </Card>
            <RetailersExpensesChart 
              expenses={expenses || []} 
              retailers={retailers || []} 
            />
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
