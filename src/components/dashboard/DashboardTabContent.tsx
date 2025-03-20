
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { DashboardCards } from "./dashboard-content/DashboardCards";
import { DashboardCharts } from "./dashboard-content/DashboardCharts";
import { DashboardContributors } from "./dashboard-content/DashboardContributors";
import { DashboardExtraCards } from "./dashboard-content/DashboardExtraCards";
import { Credit } from "@/components/credits/types";
import { useMemo, memo } from "react";

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

// Composants memoizés pour éviter les re-rendus inutiles
const MemoizedDashboardCards = memo(DashboardCards);
const MemoizedDashboardCharts = memo(DashboardCharts);
const MemoizedDashboardContributors = memo(DashboardContributors);

// Animation variants
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

  const { data: credits = [] } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");

      if (error) {
        console.error("Error fetching credits:", error);
        return [];
      }

      return data as Credit[];
    },
    staleTime: 1000 * 30, // Réduit à 30 secondes pour plus de réactivité
    refetchOnWindowFocus: true, // Activer le rechargement lors du focus
    refetchOnReconnect: true, // Activer le rechargement lors de la reconnexion
  });

  // Memoize credit calculations to prevent recalculation on each render
  const { activeCredits, repaidThisMonth, totalMensualites } = useMemo(() => {
    const active = credits.filter(credit => credit.statut === 'actif') || [];
    const repaid = credits.filter(credit => {
      const repaymentDate = new Date(credit.date_derniere_mensualite);
      return credit.statut === 'remboursé' && repaymentDate >= firstDayOfMonth;
    }) || [];

    const activeMensualites = active.reduce((sum, credit) => sum + credit.montant_mensualite, 0);
    const repaidThisMonthSum = repaid.reduce((sum, credit) => sum + credit.montant_mensualite, 0);

    return {
      activeCredits: active,
      repaidThisMonth: repaid, 
      totalMensualites: activeMensualites + repaidThisMonthSum
    };
  }, [credits, firstDayOfMonth]);

  // Memoize mapped contributors to avoid unnecessary recalculations
  const mappedContributors = useMemo(() => {
    return contributors.map(contributor => ({
      ...contributor,
      is_owner: contributor.is_owner ?? false, 
      percentage_contribution: contributor.percentage_contribution ?? 0,
      expenseShare: 0,
      creditShare: 0
    }));
  }, [contributors]);

  // Afficher la section des contributeurs même s'il n'y en a qu'un
  // Permet de voir immédiatement l'ajout d'un nouveau contributeur
  const showContributorsSection = useMemo(() => {
    return mappedContributors.length > 0;
  }, [mappedContributors.length]);

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MemoizedDashboardCards 
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
      
      {/* Nouvelle section avec les cards supplémentaires */}
      <DashboardExtraCards />
      
      <MemoizedDashboardCharts 
        expenses={expenses}
        savings={savings}
        totalMensualites={totalMensualites}
        credits={credits}
        recurringExpenses={recurringExpenses}
        monthlySavings={monthlySavings}
      />
      
      {showContributorsSection && (
        <MemoizedDashboardContributors 
          contributors={mappedContributors}
          expenses={expenses}
          totalMensualites={totalMensualites}
        />
      )}
    </motion.div>
  );
};
