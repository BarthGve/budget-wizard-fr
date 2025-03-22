
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
          
          {/* Disposition avec flex pour mettre les cartes côte à côte */}
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 mt-8 mb-8">
            {/* Carte de total des dépenses (1/3) */}
            <motion.div variants={itemVariants} className="w-full lg:w-1/3">
              <YearlyTotalCard 
                key={`total-card-${currentYearTotal}`}
                currentYearTotal={currentYearTotal} 
                previousYearTotal={lastYearTotal} 
                expenses={expenses || []} 
                viewMode={viewMode}
              />
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
