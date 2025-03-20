
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

// Utilisation de memo pour éviter les re-renders inutiles
const Expenses = memo(function Expenses() {
  const { retailers } = useRetailers();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  // Utiliser notre nouveau hook pour les données
  const { expenses, isLoading, handleExpenseUpdated } = useExpensesData();
  
  // Activer les écouteurs en temps réel
  useRealtimeListeners();
  
  // Utiliser notre hook pour calculer les totaux
  const { currentYearTotal, lastYearTotal } = useYearlyTotals(expenses);

  // Organiser les dépenses par détaillant
  const expensesByRetailer = retailers?.map(retailer => ({
    retailer,
    expenses: expenses?.filter(expense => expense.retailer_id === retailer.id) || []
  }));
  
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
  
  return (
    <DashboardLayout>
      <motion.div 
        className="grid gap-6 mt-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="space-y-4">
          {/* En-tête de la page avec le titre et le switch pour changer de vue */}
          <ExpensesHeader 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            onExpenseAdded={handleExpenseUpdated} 
          />

          {/* Bannière pour créer un nouveau détaillant si nécessaire */}
          <motion.div variants={itemVariants}>
            <CreateRetailerBanner />
          </motion.div>

          {/* Carte de total annuel */}
          <motion.div variants={itemVariants} className="mt-8 mb-8">
            <YearlyTotalCard 
              key={`total-card-${currentYearTotal}`}
              currentYearTotal={currentYearTotal} 
              previousYearTotal={lastYearTotal} 
              expenses={expenses || []} 
              viewMode={viewMode}
            />
          </motion.div>
          
          {/* Grille des cartes de détaillants */}
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
