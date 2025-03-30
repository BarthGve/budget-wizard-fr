
import { RevenueCard } from "../RevenueCard";
import { ExpensesCard } from "../ExpensesCard";
import { CreditCard } from "../CreditCard";
import { SavingsCard } from "../SavingsCard";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DashboardPreferences } from "@/types/profile";

interface DashboardCardsProps {
  revenue: number;
  expenses: number;
  totalMensualites: number;
  savings: number;
  savingsGoal: number;
  contributorShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  recurringExpenses: Array<{
    amount: number;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  currentView?: "monthly" | "yearly";
  dashboardPreferences?: DashboardPreferences;
}

export const DashboardCards = ({
  revenue,
  expenses,
  totalMensualites,
  savings,
  savingsGoal,
  contributorShares,
  recurringExpenses,
  currentView = "monthly",
  dashboardPreferences = {
    show_revenue_card: true,
    show_expenses_card: true,
    show_credits_card: true,
    show_savings_card: true
  }
}: DashboardCardsProps) => {
  // Vérifier si on est sur mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  // Calculer combien de cartes sont affichées pour adapter la mise en page
  const visibleCardsCount = [
    dashboardPreferences.show_revenue_card,
    dashboardPreferences.show_expenses_card,
    dashboardPreferences.show_credits_card, 
    dashboardPreferences.show_savings_card
  ].filter(Boolean).length;

  // Ajuster les classes CSS en fonction du nombre de cartes
  const gridClassName = () => {
    if (isMobile) return 'grid-cols-1';
    
    switch(visibleCardsCount) {
      case 1: return 'md:grid-cols-1';
      case 2: return 'md:grid-cols-2';
      case 3: return 'md:grid-cols-3';
      default: return 'md:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <motion.div 
      className={`grid gap-6 ${gridClassName()}`}
      variants={containerVariants}
    >
      {dashboardPreferences.show_revenue_card && (
        <motion.div variants={itemVariants} className="w-full">
          <RevenueCard
            totalRevenue={revenue}
            contributorShares={contributorShares}
          />
        </motion.div>
      )}
      
      {dashboardPreferences.show_credits_card && (
        <motion.div variants={itemVariants} className="w-full">
          <CreditCard
            totalMensualites={totalMensualites}
            totalRevenue={revenue}
            currentView={currentView}
          />
        </motion.div>
      )}
      
      {dashboardPreferences.show_expenses_card && (
        <motion.div variants={itemVariants} className="w-full">
          <ExpensesCard
            totalExpenses={expenses}
            recurringExpenses={recurringExpenses}
          />
        </motion.div>
      )}
      
      {dashboardPreferences.show_savings_card && (
        <motion.div variants={itemVariants} className="w-full">
          <SavingsCard
            totalMonthlySavings={savings}
            savingsGoal={savingsGoal}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
