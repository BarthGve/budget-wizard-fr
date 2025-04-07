
import { motion } from "framer-motion";
import { DashboardChartsSection } from "../dashboard-tab/DashboardChartsSection";
import { DashboardPreferences } from "@/types/profile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Animation simplifiée
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

interface ChartsWrapperProps {
  expenses: number;
  savings: number;
  totalMensualites: number;
  credits: any[] | null;
  recurringExpenses: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  dashboardPreferences: DashboardPreferences;
}

/**
 * Wrapper pour la section des graphiques
 */
export const ChartsWrapper = ({
  expenses,
  savings,
  totalMensualites,
  credits,
  recurringExpenses,
  monthlySavings,
  dashboardPreferences
}: ChartsWrapperProps) => {
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  // Ne pas rendre sur mobile ou si les préférences sont désactivées
  if (isMobileScreen || !dashboardPreferences.show_charts) return null;

  return (
    <motion.div 
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardChartsSection 
        expenses={expenses}
        savings={savings}
        totalMensualites={totalMensualites}
        credits={credits}
        recurringExpenses={recurringExpenses}
        monthlySavings={monthlySavings}
      />
    </motion.div>
  );
};
