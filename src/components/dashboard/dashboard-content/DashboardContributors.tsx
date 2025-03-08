
import { ContributorsTable } from "../ContributorsTable";
import { motion } from "framer-motion";

interface DashboardContributorsProps {
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
}

export const DashboardContributors = ({
  contributors,
  expenses,
  totalMensualites,
}: DashboardContributorsProps) => {
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

  // Afficher le tableau même s'il n'y a qu'un seul contributeur
  // Mais ne pas l'afficher s'il n'y a pas de contributeurs du tout
  if (!contributors || contributors.length === 0) return null;

  return (
    <motion.div variants={itemVariants}>
      <ContributorsTable 
        contributors={contributors}
        totalExpenses={expenses}
        totalCredits={totalMensualites}
      />
    </motion.div>
  );
}
