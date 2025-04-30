
import { motion } from "framer-motion";
import { DashboardChartsSection } from "../dashboard-tab/DashboardChartsSection";
import { DashboardPreferences } from "@/types/profile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {ChartPie} from "lucide-react";

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
  <div className="flex items-center gap-3 mb-4">
   <h2 className=
          "tracking-tight text-xl font-medium text-primary flex items-center gap-2

    "
        >
          <div className=
            "p-1 rounded"
        
          >
            <ChartPie className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
          Analyse
        </h2>
  </div>
      
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
