
import { motion } from "framer-motion";
import { RecurringExpense } from "../types";
import { RecurringExpenseTable } from "../RecurringExpenseTable";
import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import { YearlyTotalCard } from "../RecurringExpensesSummaryCards"; // Importation corrigée
import { itemVariants } from "../animations/AnimationVariants";
import { RecurringExpensesHeader } from "../RecurringExpensesHeader";
import { MutableRefObject } from "react";
import { RecurringExpensesCategoryChart } from "../RecurringExpensesCategoryChart";

interface ExpenseSectionsProps {
  recurringExpenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
  setSelectedPeriod: (period: "monthly" | "quarterly" | "yearly" | null) => void;
  cardsRef: MutableRefObject<HTMLDivElement | null>;
}

/**
 * Sections principales pour l'affichage des charges récurrentes
 */
export const ExpenseSections = ({
  recurringExpenses,
  onDeleteExpense,
  selectedPeriod,
  setSelectedPeriod,
  cardsRef
}: ExpenseSectionsProps) => {
  // Calculer les totaux par périodicité
  const monthlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "monthly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const quarterlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "quarterly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const yearlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "yearly").reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Filtrer les dépenses en fonction de la période sélectionnée
  const filteredExpenses = selectedPeriod 
    ? recurringExpenses.filter(expense => expense.periodicity === selectedPeriod)
    : recurringExpenses;

  // Créer les données pour YearlyTotalCard
  const allExpensesWithDates = recurringExpenses.map(expense => ({
    id: expense.id,
    date: expense.created_at,
    amount: expense.amount
  }));

  return (
    <>
      <RecurringExpensesHeader />

      <motion.div variants={itemVariants}>
        <CreateCategoryBanner />
      </motion.div>

      <div ref={cardsRef}>
        {/* Utilisation du composant YearlyTotalCard à la place de RecurringExpensesSummaryCards */}
        <YearlyTotalCard
          currentYearTotal={monthlyTotal + quarterlyTotal * 3 + yearlyTotal}
          previousYearTotal={0}
          expenses={allExpensesWithDates}
          viewMode="yearly"
        />
      </div>

      {/* Graphique des dépenses par catégorie */}
      <RecurringExpensesCategoryChart 
        expenses={recurringExpenses} 
        selectedPeriod={selectedPeriod} 
      />

      <motion.div 
        className="w-full overflow-hidden"
        variants={itemVariants}
      >
        <RecurringExpenseTable 
          expenses={filteredExpenses} 
          onDeleteExpense={onDeleteExpense} 
        />
      </motion.div>
    </>
  );
};
