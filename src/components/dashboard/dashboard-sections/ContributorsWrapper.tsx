
import { motion } from "framer-motion";
import { ContributorsSection } from "../dashboard-tab/ContributorsSection";
import { DashboardPreferences } from "@/types/profile";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

interface ContributorsWrapperProps {
  contributors: Array<{
    id: string;
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner: boolean;
    profile_id: string;
    expenseShare: number;
    creditShare: number;
  }>;
  expenses: number;
  totalMensualites: number;
  dashboardPreferences: DashboardPreferences;
}

/**
 * Wrapper pour la section des contributeurs
 */
export const ContributorsWrapper = ({
  contributors,
  expenses,
  totalMensualites,
  dashboardPreferences
}: ContributorsWrapperProps) => {
  if (!dashboardPreferences.show_contributors) return null;

  return (
    <motion.div variants={sectionVariants}>
      <ContributorsSection 
        contributors={contributors}
        expenses={expenses}
        totalMensualites={totalMensualites}
      />
    </motion.div>
  );
};
