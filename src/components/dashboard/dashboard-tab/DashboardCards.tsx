
import { memo } from "react";
import { motion } from "framer-motion";
import { DashboardCards as OriginalDashboardCards } from "../dashboard-content/DashboardCards";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MemoizedDashboardCards = memo(OriginalDashboardCards);

// Animation variants
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

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
  currentView: "monthly" | "yearly";
}

/**
 * Composant qui affiche les cartes principales du dashboard
 */
export const DashboardCardsSection = ({
  revenue,
  expenses,
  totalMensualites,
  savings,
  savingsGoal,
  contributorShares,
  recurringExpenses,
  currentView,
}: DashboardCardsProps) => {
  // Vérifier si on est sur mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <motion.div 
      variants={rowVariants}
      className={isMobile ? "max-w-full overflow-hidden" : ""}
    >
      <MemoizedDashboardCards
        revenue={revenue}
        expenses={expenses}
        totalMensualites={totalMensualites}
        savings={savings}
        savingsGoal={savingsGoal}
        contributorShares={contributorShares}
        recurringExpenses={recurringExpenses}
        currentView={currentView}
      />
    </motion.div>
  );
};
