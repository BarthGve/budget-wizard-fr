import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  calculateTotalRevenue,
  calculateMonthlyExpenses,
  calculateYearlyExpenses,
  calculateTotalSavings,
  getCumulativeContributionPercentages,
  getCumulativeExpensePercentages,
} from "@/utils/dashboardCalculations";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const { contributors, monthlySavings, profile, recurringExpenses } = useDashboardData();
  const isMobile = useIsMobile();

  // Get current month name
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  // Calculate revenues
  const totalRevenue = calculateTotalRevenue(contributors);
  const yearlyRevenue = totalRevenue * 12;

  // Calculate expenses
  const monthlyExpenses = calculateMonthlyExpenses(recurringExpenses);
  const yearlyExpenses = calculateYearlyExpenses(recurringExpenses);

  // Calculate savings
  const totalMonthlySavings = calculateTotalSavings(monthlySavings);
  const yearlyMonthlySavings = totalMonthlySavings * 12;

  // Calculate balances
  const monthlyBalance = totalRevenue - monthlyExpenses - totalMonthlySavings;
  const yearlyBalance = yearlyRevenue - yearlyExpenses - yearlyMonthlySavings;

  // Calculate savings goal
  const savingsGoal = profile?.savings_goal_percentage 
    ? (currentView === "yearly" ? yearlyRevenue : totalRevenue) * profile.savings_goal_percentage / 100 
    : 0;

  // Get expenses for pie chart based on current view
  const getExpensesForPieChart = () => {
    if (!recurringExpenses) return [];

    return recurringExpenses.map(expense => {
      let amount = expense.amount;
      if (currentView === "yearly") {
        if (expense.periodicity === "monthly") {
          amount = expense.amount * 12;
        } else if (expense.periodicity === "quarterly") {
          amount = expense.amount * 4;
        }
      } else {
        if (expense.periodicity === "quarterly") {
          amount = expense.amount / 3;
        } else if (expense.periodicity === "yearly") {
          amount = expense.amount / 12;
        }
      }
      
      return {
        id: expense.id,
        name: expense.name,
        amount,
        category: expense.category,
        debit_day: expense.debit_day,
        debit_month: expense.debit_month,
        periodicity: expense.periodicity as "monthly" | "quarterly" | "yearly"
      };
    });
  };

  // Prepare savings data for pie chart based on view
  const getSavingsForPieChart = () => {
    if (!monthlySavings) return [];
    
    if (currentView === "yearly") {
      return monthlySavings.map(saving => ({
        ...saving,
        amount: saving.amount * 12
      }));
    }
    return monthlySavings;
  };

  // Animation variants for staggered children
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
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Tab animation variants
  const tabVariants = {
    inactive: { 
      scale: 0.95,
      opacity: 0.7,
      y: 0 
    },
    active: { 
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="grid gap-6 mt-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in ${isMobile ? 'mobile-title-shadow mobile-title-outline' : ''}`}>
                Tableau de bord
              </h1>
              <p className={`text-muted-foreground ${isMobile ? 'font-medium text-white mobile-title-shadow' : ''}`}>
                {currentView === "monthly" 
                  ? `Aperçu du budget pour le mois de ${currentMonthName} ${new Date().getFullYear()}` 
                  : `Aperçu du budget annuel ${new Date().getFullYear()}`}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Tabs
                defaultValue="monthly"
                onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
                className="w-[250px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <motion.div
                    initial="inactive"
                    animate={currentView === "monthly" ? "active" : "inactive"}
                    whileHover="hover"
                    variants={tabVariants}
                  >
                    <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                  </motion.div>
                  <motion.div
                    initial="inactive"
                    animate={currentView === "yearly" ? "active" : "inactive"}
                    whileHover="hover"
                    variants={tabVariants}
                  >
                    <TabsTrigger value="yearly">Annuel</TabsTrigger>
                  </motion.div>
                </TabsList>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
            }}
            transition={{ duration: 0.2 }}
          >
            <CreateCategoryBanner />
          </motion.div>
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
            }}
            transition={{ duration: 0.2 }}
          >
            <CreateRetailerBanner />
          </motion.div>
        </motion.div>
        
        <DashboardTabContent
          revenue={currentView === "monthly" ? totalRevenue : yearlyRevenue}
          expenses={currentView === "monthly" ? monthlyExpenses : yearlyExpenses}
          savings={currentView === "monthly" ? totalMonthlySavings : yearlyMonthlySavings}
          balance={currentView === "monthly" ? monthlyBalance : yearlyBalance}
          savingsGoal={savingsGoal}
          contributorShares={getCumulativeContributionPercentages(contributors, totalRevenue)}
          expenseShares={getCumulativeExpensePercentages(contributors, monthlyExpenses)}
          recurringExpenses={getExpensesForPieChart()}
          monthlySavings={getSavingsForPieChart()}
          contributors={contributors || []}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
