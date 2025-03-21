import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { DashboardCards } from "./dashboard-content/DashboardCards";
import { DashboardCharts } from "./dashboard-content/DashboardCharts";
import { DashboardContributors } from "./dashboard-content/DashboardContributors";
import { MonthlyExpensesCard } from "./MonthlyExpensesCard";
import { VehicleFuelExpensesCard } from "./VehicleFuelExpensesCard";
import { Credit } from "@/components/credits/types";
import { useExpenseStats } from "@/hooks/useExpenseStats";
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
  currentView: "monthly" | "yearly";
  fuelExpensesTotal?: number;
  fuelExpensesCount?: number;
  fuelVolume?: number;
}

// Composants memoizés pour éviter les re-rendus inutiles
const MemoizedDashboardCards = memo(DashboardCards);
const MemoizedDashboardCharts = memo(DashboardCharts);
const MemoizedDashboardContributors = memo(DashboardContributors);
const MemoizedMonthlyExpensesCard = memo(MonthlyExpensesCard);
const MemoizedVehicleFuelExpensesCard = memo(VehicleFuelExpensesCard);

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
  currentView,
  fuelExpensesTotal = 0,
  fuelExpensesCount = 0,
  fuelVolume = 0,
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

  // Obtenir les statistiques selon la période sélectionnée
  const { expensesTotal } = useExpenseStats(currentView);

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

  // Récupérer le profil utilisateur pour déterminer s'il est PRO
  const { data: profile } = useQuery({
    queryKey: ["current-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

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
      
      {/* Cartes pour les statistiques selon la période */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        variants={rowVariants}
      >
        <MemoizedMonthlyExpensesCard 
          totalExpenses={expensesTotal} 
          viewMode={currentView}
        />
        <MemoizedVehicleFuelExpensesCard 
          totalFuelExpenses={fuelExpensesTotal}
          fuelVolume={fuelVolume}
          fuelExpensesCount={fuelExpensesCount}
          profile={profile}
          viewMode={currentView}
        />
      </motion.div>
      
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
