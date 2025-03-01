
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { DashboardCards } from "./dashboard-content/DashboardCards";
import { DashboardCharts } from "./dashboard-content/DashboardCharts";
import { DashboardContributors } from "./dashboard-content/DashboardContributors";

interface DashboardTabContentProps {
  revenue: number;
  expenses: number;
  savings: number;
  balance: number;
  savingsGoal: number;
  contributors: Array<{
    id: string;
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner: boolean;
    profile_id: string;
  }>;
  contributorShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  expenseShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
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
}

export const DashboardTabContent = ({
  revenue,
  expenses,
  savings,
  balance,
  savingsGoal,
  contributors,
  contributorShares,
  expenseShares,
  recurringExpenses,
  monthlySavings,
}: DashboardTabContentProps) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");

      if (error) {
        console.error("Error fetching credits:", error);
        return [];
      }

      return data;
    }
  });

  const activeCredits = credits?.filter(credit => credit.statut === 'actif') || [];
  const repaidThisMonth = credits?.filter(credit => {
    const repaymentDate = new Date(credit.date_derniere_mensualite);
    return credit.statut === 'remboursé' && repaymentDate >= firstDayOfMonth;
  }) || [];

  const totalActiveMensualites = activeCredits.reduce((sum, credit) => sum + credit.montant_mensualite, 0);
  const totalRepaidThisMonth = repaidThisMonth.reduce((sum, credit) => sum + credit.montant_mensualite, 0);

  const totalMensualites = totalActiveMensualites + totalRepaidThisMonth;

  // Map contributors to ensure all required properties are present
  const mappedContributors = contributors.map(contributor => ({
    ...contributor,
    is_owner: contributor.is_owner ?? false, // Provide a default value if is_owner is undefined
    expenseShare: 0, // Add default values for required Contributor properties
    creditShare: 0
  }));

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

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <DashboardCards 
        revenue={revenue}
        expenses={expenses}
        totalMensualites={totalMensualites}
        savings={savings}
        savingsGoal={savingsGoal}
        contributorShares={contributorShares}
        recurringExpenses={recurringExpenses.map(expense => ({
          amount: expense.amount,
          debit_day: expense.debit_day,
          debit_month: expense.debit_month,
          periodicity: expense.periodicity
        }))}
      />
      
      <DashboardCharts 
        expenses={expenses}
        savings={savings}
        totalMensualites={totalMensualites}
        credits={credits}
        recurringExpenses={recurringExpenses}
        monthlySavings={monthlySavings}
      />
      
      <DashboardContributors 
        contributors={mappedContributors}
        expenses={expenses}
        totalMensualites={totalMensualites}
      />
    </motion.div>
  );
};
